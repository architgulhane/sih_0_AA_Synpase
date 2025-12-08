from fastapi import FastAPI, WebSocket, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from Bio import SeqIO
import shutil
import os
import uuid

from utils.utils import set_global_seed
from module.model_handler import DNABertEngine
from module.clustering import ClusterEngine
from module.verifier import AsyncBlastVerifier

set_global_seed(42)
ml_models = {"bert": DNABertEngine()} 

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "temp_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)



""""
Upload Files
"""
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Saves file and returns an ID. 
    Frontend uses this ID to open a WebSocket connection.
    """
    file_id = str(uuid.uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.fastq")
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"file_id": file_id, "message": "File received. Connect to WebSocket."}


""""
Socket for prcocessing 
"""
@app.websocket("/ws/{file_id}")
async def websocket_endpoint(websocket: WebSocket, file_id: str):
    await websocket.accept()
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}.fastq")

    try:
        # STEP 1: VALIDATION
        if not os.path.exists(file_path):
            await websocket.send_json({"type": "error", "message": "File not found"})
            return

        await websocket.send_json({"type": "log", "message": "Reading Sequences..."})
        sequences = []
        for record in SeqIO.parse(file_path, "fastq"):
            sequences.append(str(record.seq))

        # STEP 2: EMBEDDINGS
        await websocket.send_json({"type": "log", "message": "Generating AI Embeddings..."})
        engine = ml_models["bert"]
        
        embeddings = engine.process_sequences(sequences)
        await websocket.send_json({"type": "progress", "step": "embeddings", "status": "complete"})

        # STEP 3: CLUSTERING
        await websocket.send_json({"type": "log", "message": "Running UMAP & HDBSCAN..."})
        result_df = ClusterEngine.run_analysis(embeddings)
        stats = ClusterEngine.get_stats(result_df)
        
        await websocket.send_json({
            "type": "clustering_result", 
            "data": stats
        })

        # STEP 4: VERIFICATION (Streamed)
        await websocket.send_json({"type": "log", "message": "Starting NCBI Verification (Slow)..."})
        
        async for verify_result in AsyncBlastVerifier.verify_stream(sequences, result_df, top_n=5):
            
            await websocket.send_json({
                "type": "verification_update",
                "data": verify_result
            })

        await websocket.send_json({"type": "complete", "message": "Analysis Finished."})

    except Exception as e:
        await websocket.send_json({"type": "error", "message": str(e)})
    
    finally:
        # Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)
        await websocket.close()
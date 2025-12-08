import torch
import numpy as np
from transformers import AutoTokenizer, BertModel, AutoConfig

class DNABertEngine:
    def __init__(self, model_name="zhihan1996/DNABERT-S"):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        print(f"Initializing AI Engine on {self.device}...")
        
        # Load Model
        config = AutoConfig.from_pretrained(model_name, trust_remote_code=True)
        self.model = BertModel.from_pretrained(model_name, config=config, trust_remote_code=False)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, trust_remote_code=True)
        
        self.model.to(self.device)
        self.model.eval()
        print("AI Engine Ready.")

    def process_sequences(self, sequences: list, batch_size=16):
        embeddings = []
        
        # Process batches
        for i in range(0, len(sequences), batch_size):
            batch = sequences[i : i + batch_size]
            inputs = self.tokenizer(batch, return_tensors="pt", padding=True, truncation=True, max_length=100)
            inputs = {k: v.to(self.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model(**inputs)
                hidden_states = outputs[0]
                attention_mask = inputs['attention_mask'].unsqueeze(-1)
                sum_embeddings = torch.sum(hidden_states * attention_mask, dim=1)
                sum_mask = torch.clamp(attention_mask.sum(dim=1), min=1e-9)
                mean_embeddings = sum_embeddings / sum_mask
                embeddings.append(mean_embeddings.cpu().numpy())

        return np.vstack(embeddings)
#  SamudraSetu - eDNA Analysis Platform

An environmental DNA analysis platform for identifying organisms from DNA sequences. Built for the *Smart India Hackathon (SIH)* by CMLRE.

##  What It Does

Upload DNA sequences → Analyze with AI → View beautiful visualizations → Track all your uploads

*Key Features:*
-  Analyze FASTA/FASTQ files and text sequences
-  Interactive map showing where organisms were found
-  Charts and visualizations of organism abundance
-  Complete history of all your uploads
-  Real-time analysis with live logs
-  Automatic retry logic with health monitoring

##  What You Need

| Component | Requirements |
|-----------|--------------|
| *Backend* | Python 3.9+, FastAPI |
| *Frontend* | Node.js 18+, npm |
| *Overall* | 4GB RAM, internet connection |

##  Tech Stack

- *Backend*: FastAPI (Python), aiohttp, WebSocket
- *Frontend*: Next.js, React, TypeScript, Tailwind CSS
- *Maps*: MapLibre GL
- *Charts*: Recharts
- *External API*: Google Cloud Platform (GCP)

##  Quick Start

### Backend Setup (5 minutes)

bash
cd server

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows: or source venv/bin/activate on Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000


<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/10b42082-e82b-485a-a1fd-a13c14ac68d7" width="100%" />
      <br/>
      <b>DNA sequences stored as vector points in a Qdrant collection</b><br/>
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/b20fd899-171d-4ae9-a71f-3b2157d4cb56" width="100%" />
      <br/>
      <b>Live WebSocket feed summarizing the pipeline</b><br/>
    </td>
  </tr>
</table>


 You'll see: Uvicorn running on http://0.0.0.0:8000

### Frontend Setup (3 minutes)

bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/a07c176f-a0ff-44be-bb5d-f006e4e1c9a8" width="100%" />
      <br/>
      <b>Global Marine eDNA Dashboard</b><br/>
      Clean and intuitive dashboard for exploring marine eDNA samples and dominant organisms.
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/ff922265-25a3-4070-8838-e131cd8b5a6e" width="100%" />
      <br/>
      <b>Sequence Analysis Panel</b><br/>
      Simple interface to upload sequences and watch each processing step complete.
    </td>
  </tr>
</table>

<table>
  <tr>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/2173ef82-65fa-469a-80b1-17ecbce13840" width="100%" />
      <br/>
      <b>Mobile Sample Sheet</b><br/>
      Cruise metadata plus live status of each analysis run.
    </td>
    <td align="center" width="50%">
      <img src="https://github.com/user-attachments/assets/616f7388-273d-48f5-8c89-7bf17198bafe" width="100%" />
      <br/>
      <b>Sample & Connectivity Overview</b><br/>
      Tracks network/wallet connectivity, active eDNA samples, novel lineages, and biodiversity credits.
    </td>
  </tr>
</table>


 You'll see: ▲ Next.js - Local: http://localhost:3000

### That's it! 

Open your browser to http://localhost:3000 and start analyzing DNA sequences.
---

## 📖 How to Use

### Upload & Analyze
1. Click *"Analysis"* in sidebar
2. Upload a FASTA/FASTQ file or paste DNA sequence
3. Select file type and click *"Start Analysis"*
4. Watch live logs as analysis runs

### View Results
- *Dashboard* - See maps, charts, and statistics
- *History* - Browse all your previous uploads
- *Charts* - Explore organism distribution

---

##  Having Issues?

### Backend won't start?
bash
python --version  # Check Python 3.9+
pip install -r requirements.txt --upgrade


### Backend shows as "Offline"?
- Make sure backend server is running on port 8000
- Check your internet connection
- Refresh browser

### Charts not showing?
bash
npm install  # Reinstall dependencies
rm -rf .next  # Clear cache
npm run dev


### Port already in use?
bash
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -i :8000


---

##  Architecture Overview


User Browser
    ↓
Next.js Frontend (localhost:3000)
    ↓ (HTTP Upload + WebSocket)
FastAPI Backend (localhost:8000)
    ↓ (Retry Logic)
Google Cloud Platform
    ↓ (DNA Analysis)
Results → Dashboard → Maps, Charts, History


---

##  All Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /health | Check if backend is running |
| POST | /upload | Upload DNA file for analysis |
| WS | /ws/{file_id} | Receive live analysis logs |

---

##  Next Steps

After getting it running:
1. Upload a test DNA file
2. Watch the live analysis logs
3. Check out the interactive map
4. View your upload history
5. Export results for further research

---

##  Tips

- Upload smaller files first to test the setup
- Keep backend running while using frontend
- Check browser console (F12) if something breaks
- Clear browser cache if you see old data
- Backend retries API calls automatically

---

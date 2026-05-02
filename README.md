# Network Fingerprint Generator

## 📌 Overview
This project captures and analyzes network traffic of websites and generates unique behavioral fingerprints.

## 🚀 Features
- Packet capture using Scapy
- Feature extraction (packet size, protocols, IPs)
- Fingerprint generation
- Behavior classification
- Data visualization:
  - Pie chart (protocol distribution)
  - Histogram (packet sizes)
  - Timeline (traffic over time)
- Website comparison

## 🛠 Tech Stack
- Python (Flask)
- Scapy
- HTML/CSS/JS
- Chart.js

## ▶️ How to Run

1. Install dependencies:
pip install -r requirements.txt
2. Run:

python app.py


3. Open:

http://127.0.0.1:5000


## 📊 Example Use
- Analyze a single website
- Compare two websites
- Observe traffic behavior patterns

## ⚠️ Limitations
- Captures all network traffic (not filtered per site)
- HTTPS encryption limits payload visibility
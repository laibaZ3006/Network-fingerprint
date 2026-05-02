from flask import Flask, render_template, request, jsonify
from capture import capture_packets
from extract import extract_features
from fingerprint import generate_fingerprint

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    url = request.json['url']

    pcap = capture_packets(url)
    data = extract_features(pcap)
    fingerprint = generate_fingerprint(data, url)

    return jsonify(fingerprint)
@app.route('/compare', methods=['POST'])
@app.route('/compare', methods=['POST'])
def compare():
    url1 = request.json['url1']
    url2 = request.json['url2']

    pcap1 = capture_packets(url1, "cap1.pcap")
    data1 = extract_features(pcap1)
    fp1 = generate_fingerprint(data1, url1)

    pcap2 = capture_packets(url2, "cap2.pcap")
    data2 = extract_features(pcap2)
    fp2 = generate_fingerprint(data2, url2)

    diff = {
        "more_data": url1 if fp1["total_bytes"] > fp2["total_bytes"] else url2,
        "more_packets": url1 if fp1["total_packets"] > fp2["total_packets"] else url2,
        "larger_packets": url1 if fp1["mean_packet_size"] > fp2["mean_packet_size"] else url2
    }

    return jsonify({
        "site1": fp1,
        "site2": fp2,
        "difference": diff
    })

if __name__ == '__main__':
    app.run(debug=True)

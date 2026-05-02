from scapy.all import sniff, wrpcap
import requests
import threading

def generate_traffic(url):
    try:
        requests.get(url)
    except:
        pass

def capture_packets(url, output_file="capture.pcap", duration=10):
    thread = threading.Thread(target=generate_traffic, args=(url,))
    thread.start()

    packets = sniff(timeout=duration)
    wrpcap(output_file, packets)

    return output_file
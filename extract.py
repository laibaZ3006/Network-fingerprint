from scapy.all import rdpcap
from collections import Counter

def extract_features(pcap_file):
    packets = rdpcap(pcap_file)

    sizes = []
    protocols = []
    ips = set()
    times = []

    for pkt in packets:
        sizes.append(len(pkt))
        times.append(float(pkt.time))

        if pkt.haslayer("TCP"):
            protocols.append("TCP")
        elif pkt.haslayer("UDP"):
            protocols.append("UDP")

        if pkt.haslayer("IP"):
            ips.add(pkt["IP"].dst)

    protocol_count = Counter(protocols)

    return {
        "total_packets": len(packets),
        "packet_sizes": sizes,
        "mean_size": sum(sizes)/len(sizes) if sizes else 0,
        "max_size": max(sizes) if sizes else 0,
        "protocols": dict(protocol_count),
        "unique_ips": list(ips),
        "time_stamps": times,
        "total_bytes": sum(sizes)
    }
times = []


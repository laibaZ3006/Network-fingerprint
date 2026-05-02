from classify import classify_behavior
import datetime

def generate_fingerprint(data, url):
    return {
        "site_url": url,
        "timestamp": str(datetime.datetime.now()),
        "total_packets": data["total_packets"],
        "total_bytes": data["total_bytes"],
        "mean_packet_size": data["mean_size"],
        "max_packet_size": data["max_size"],
        "protocol_distribution": data["protocols"],
        "unique_ips": data["unique_ips"],
        "time_stamps": data["time_stamps"],
        "packet_sizes": data["packet_sizes"],  # ADD THIS LINE
        "behavior": classify_behavior(data)
    }
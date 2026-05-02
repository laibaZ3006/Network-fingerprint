def classify_behavior(data):
    if data["total_bytes"] > 300000:
        return "Streaming / Media"
    elif len(data["unique_ips"]) > 5:
        return "Social Media / Dynamic"
    elif data["total_packets"] < 100:
        return "Static Website"
    else:
        return "API / Data Service"
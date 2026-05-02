// ========== URL VALIDATION ==========
function isValidURL(url) {
    let pattern = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/i;
    return pattern.test(url);
}


// ========== ANALYZE (single URL) ==========
async function analyze() {
    let url = document.getElementById("url").value;
    let error = document.getElementById("error");

    // VALIDATION
    if (!isValidURL(url)) {
        error.innerText = "❌ Please enter a valid URL (must start with http:// or https://)";
        return;
    } else {
        error.innerText = "";
    }

    let res = await fetch("/analyze", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url: url})
    });

    let data = await res.json();

    document.getElementById("output").innerText =
        JSON.stringify(data, null, 2);

    drawCharts(data, "pie1", "bar1");

    // Timeline (same site twice)
    drawTimelineCompare(data, data);
}


// ========== COMPARE (two URLs) ==========
async function compare() {
    let url1 = document.getElementById("url1").value;
    let url2 = document.getElementById("url2").value;
    let error = document.getElementById("error");

    // VALIDATION
    if (!isValidURL(url1) || !isValidURL(url2)) {
        error.innerText = "❌ Enter valid URLs for both fields";
        return;
    } else {
        error.innerText = "";
    }

    let res = await fetch("/compare", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({url1: url1, url2: url2})
    });

    let data = await res.json();

    document.getElementById("output").innerText =
        "More Data: " + data.difference.more_data + "\n" +
        "More Packets: " + data.difference.more_packets + "\n" +
        "Larger Avg Packet: " + data.difference.larger_packets;

    drawCharts(data.site1, "pie1", "bar1");
    drawCharts(data.site2, "pie2", "bar2");

    drawTimelineCompare(data.site1, data.site2);
}


// ========== DRAW PIE + BAR ==========
function drawCharts(site, pieId, barId) {

    clearCanvas(pieId);
    clearCanvas(barId);

    // PIE CHART
    new Chart(document.getElementById(pieId), {
        type: 'pie',
        data: {
            labels: Object.keys(site.protocol_distribution),
            datasets: [{
                data: Object.values(site.protocol_distribution),
                backgroundColor: ["#36A2EB", "#FF6384"]
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Protocol Distribution"
                }
            }
        }
    });

    // HISTOGRAM
    let buckets = [0, 0, 0, 0];

    site.packet_sizes.forEach(size => {
        if (size <= 100) buckets[0]++;
        else if (size <= 500) buckets[1]++;
        else if (size <= 1000) buckets[2]++;
        else buckets[3]++;
    });

    new Chart(document.getElementById(barId), {
        type: 'bar',
        data: {
            labels: ["0-100", "101-500", "501-1000", "1000+"],
            datasets: [{
                label: "Packet Count",
                data: buckets,
                backgroundColor: "#4facfe"
            }]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Packet Size Distribution"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Packet Size Range (bytes)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Number of Packets"
                    }
                }
            }
        }
    });
}


// ========== DRAW TIMELINE ==========
function drawTimelineCompare(site1, site2) {

    clearCanvas("lineChart");

    function process(times) {
        if (!times || times.length === 0) return {labels: [], values: []};

        let start = times[0];
        let seconds = times.map(t => Math.floor(t - start));

        let counts = {};
        seconds.forEach(s => {
            if (s >= 0) counts[s] = (counts[s] || 0) + 1;
        });

        return {
            labels: Object.keys(counts),
            values: Object.values(counts)
        };
    }

    let t1 = process(site1.time_stamps);
    let t2 = process(site2.time_stamps);

    new Chart(document.getElementById("lineChart"), {
        type: 'line',
        data: {
            labels: t1.labels,
            datasets: [
                {
                    label: "Site 1",
                    data: t1.values,
                    borderColor: "#4facfe",
                    fill: false
                },
                {
                    label: "Site 2",
                    data: t2.values,
                    borderColor: "#ff7e5f",
                    fill: false
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Traffic Timeline (Packets per Second)"
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Time (seconds)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Packets"
                    }
                }
            }
        }
    });
}


// ========== CLEAR CANVAS ==========
function clearCanvas(id) {
    let canvas = document.getElementById(id);
    if (!canvas) return;

    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
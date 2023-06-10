function parseLedger() {
    var inbox = document.getElementById("input");
    var outbox = document.getElementById("output");
    var lines = inbox.value.replace(/\r\n/g,"\n").split("\n").filter(line => line);
    var final = new Map();
    for (line in lines){
        if (lines[line].startsWith("Timestamp")) { continue; }
        var outarr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var arr = lines[line].split("    ");
        var pilot = arr[2];
        var ore = arr[3];
        var quant = arr[4];
        
        minerals = ores.get(ore);
        for (var i=0; i < outarr.length; i++) {
            outarr[i] += Math.floor(minerals[i+1] * quant / minerals[0]);
        }

        if (final.has(pilot)){
            workarr = final.get(pilot);
            for (var i=0; i < outarr.length; i++) {
                workarr[i] += outarr[i];
            }
            final.set(pilot, workarr);
        } else {
            final.set(pilot, outarr);
        }
    }
    for (var i of final.entries()){
        outstring = "<span class=\"output\">" + i[0] + ": \r\n";
        for (x in i[1]) {
            if (i[1][x] == 0) { continue; }
            outstring += indexes[x] + " " + i[1][x] + "\r\n";
        }
        outstring += "</span>"
        outbox.innerHTML += outstring;
    }
}
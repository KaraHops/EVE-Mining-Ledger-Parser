function parseLedger() {
    var inbox = document.getElementById("input");
    var outbox = document.getElementById("output");
    var lines = inbox.value.replace(/\r\n/g,"\n").split("\n").filter(line => line);
    var final = new Map();
    outbox.innerHTML = "";
    for (line in lines){
        if (lines[line].startsWith("Timestamp")) { continue; }
        var outarr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
        var arr = lines[line].split("    ");
        var pilot = arr[2];
        var ore = arr[3];
        var quant = arr[4];
        
        minerals = ores.get(ore);
        for (var i=0; i < outarr.length; i++) {
            outarr[i] += Math.floor(minerals[i+2] * quant / minerals[0]);
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
        outstring = "<span class=\"output\"><span class=\"character\">" + i[0] + "</span><hr><span class=\"minerals\">";
        for (x in i[1]) {
            if (i[1][x] == 0) { continue; }
            outstring += indexes[x] + " " + i[1][x] + "\r\n";
        }
        outstring += "</span></span>"
        outbox.innerHTML += outstring;
    }
}


function openTab(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
  }
function parseLedger() {
    var inbox = document.getElementById("input");
    var outbox = document.getElementById("output");
    var lines = inbox.value.replace(/\r\n/g,"\n").split("\n").filter(line => line);
    var outmap = new Map();
    outbox.innerHTML = "";

    //Collect modifiers
    var baseval = 0.5 + parseFloat(document.getElementById("rig").value);
    var secmod = document.getElementById("security").value;
    var strucmod = document.getElementById("structure").value;
    var reprmod = (document.getElementById("reprocessing").value * 0.03) + 1;
    var effmod = (document.getElementById("efficiency").value * 0.02) + 1;
    var impmod = document.getElementById("implant").value;
    var basicmods = baseval * secmod * strucmod * reprmod * effmod * impmod;
    console.log("baseval: " + baseval + ", secmod: " + secmod + ", strucmod: " + strucmod + ", reprmod: " + reprmod + ", effmod: " + effmod + ", impmod: " + impmod + ", final basicmods: " + basicmods);

    for (line in lines){
        //Skip the header line if present
        if (lines[line].startsWith("Timestamp")) { continue; }

        //Declare a silly little array for all the types of minerals (35 of them!)
        var outarr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        //Collect the pilot's name, the ore they mined, and the amount mined.
        var arr = lines[line].split("    ");
        var pilot = arr[2];
        var ore = arr[3];
        var quant = arr[4];
        
        //Find which minerals are found in the particular ore being worked on and apply the appropriate multipliers.
        minerals = ores.get(ore);
        var oremod = (document.getElementById(minerals[1]).value * 0.02) + 1;
        for (var i=0; i < outarr.length; i++) {
            refinedvalue = Math.floor((minerals[i+2] * quant / minerals[0]) * basicmods * oremod);
            outarr[i] += refinedvalue;
        }

        //If the output map already has this pilot's name in it, add the results of the last calculation to the existing mineral array 
        if (outmap.has(pilot)){
            workarr = outmap.get(pilot);
            for (var i=0; i < outarr.length; i++) {
                workarr[i] += outarr[i];
            }
            outmap.set(pilot, workarr);
        } else {
            //Otherwise, add the pilot's name to the map with the new mineral array.
            outmap.set(pilot, outarr);
        }
    }

    //Output HTML to display the results for each pilot.
    for (var i of outmap.entries()){
        outstring = "<span class=\"output\"><span class=\"character\">" + i[0] + "</span><hr><span class=\"minerals\">";
        for (x in i[1]) {
            if (i[1][x] == 0) { continue; }
            outstring += indexes[x] + " " + i[1][x] + "\r\n";
        }
        outstring += "</span></span>"
        outbox.innerHTML += outstring;
    }
}

//Code for displaying the tabs for skills/facility input.
//Thanks, W3Schools!
function openTab(evt, tabName) {
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
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }
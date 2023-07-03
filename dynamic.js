async function parseLedger(appraise) {
    const inbox = document.getElementById("input");
    const outbox = document.getElementById("output");
    const lines = inbox.value.replace(/\r\n/g,"\n").split("\n").filter(line => line);
    var outmap = new Map();
    outbox.innerHTML = "";

    //Collect modifiers
    const baseval = 0.5 + parseFloat(document.getElementById("rig").value);
    const secmod = document.getElementById("security").value;
    const strucmod = document.getElementById("structure").value;
    const reprmod = (document.getElementById("reprocessing").value * 0.03) + 1;
    const effmod = (document.getElementById("efficiency").value * 0.02) + 1;
    const impmod = document.getElementById("implant").value;
    const basicmods = baseval * secmod * strucmod * reprmod * effmod * impmod;
    const buyback = document.getElementById("percentage").value / 100;
    const orelist = Array.from(ores.keys());
    console.log("baseval: " + baseval + ", secmod: " + secmod + ", strucmod: " + strucmod + ", reprmod: " + reprmod + ", effmod: " + effmod + ", impmod: " + impmod + ", final basicmods: " + basicmods);
    
    //Check whether to process moon mining ledger or loot history for non-moon ores
    if (inbox.value.includes(" has looted ")) {
      console.log("Parsing loot history...");
      for (line in lines){
        var ore = lines[line].split(" x ").slice(-1)[0];
        if (orelist.indexOf(ore) > -1){
          //Declare a silly little array for all the types of minerals (35 of them!)
          var outarr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
          var pilot = lines[line].split(/ has looted \d/)[0].split(" ");
          pilot.shift();
          pilot = pilot.join(" ");
          var quant = lines[line].split(/ has looted /)[1].split(/ x /)[0].replace(",","");
          
          //Find which minerals are found in the particular ore being worked on and apply the appropriate multipliers.
          minerals = ores.get(ore);
          const oremod = (document.getElementById(minerals[1]).value * 0.02) + 1;
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
      }
    } else {
      console.log("Parsing mining ledger...");
      for (line in lines){
        //Skip the header line if present
        if (lines[line].startsWith("Timestamp")) { continue; }

        //Declare a silly little array for all the types of minerals (35 of them!)
        var outarr = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

        //Collect the pilot's name, the ore they mined, and the amount mined.
        var arr;
        if (lines[line].includes("    ")) {
          arr = lines[line].split("    ");
        } else {
          arr = lines[line].split(/\t/);
        }
        if (arr.length == 9) {
          var pilot = arr[2];
          var ore = arr[3];
          var quant = arr[4];
        } else {
          var pilot = arr[1];
          var ore = arr[2];
          var quant = arr[3];
        }
        
        //Find which minerals are found in the particular ore being worked on and apply the appropriate multipliers.

        if (orelist.includes(ore)) {
          minerals = ores.get(ore);
          const oremod = (document.getElementById(minerals[1]).value * 0.02) + 1;
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
    }
    }
    
    //Output HTML to display the results for each pilot.
    for (var i of outmap.entries()){
        outstring = "<span class=\"output\"><span class=\"character\">" + i[0] + "</span><hr><span class=\"minerals\">";
        for (x in i[1]) {
            if (i[1][x] == 0) { continue; }
            outstring += indexes[x] + " " + i[1][x] + "\r\n";
        }
        outstring += "</span>"
        if (appraise) {
            value = await calculateTotalValue(i[1]);
            outstring += "<hr><span class=\"value\">" + Math.floor(parseFloat(value) * buyback) + " isk</span>";
        }
        outstring +="</span>";
        outbox.innerHTML += outstring;
    }
}

async function calculateTotalValue(items) {
    const url = window.location.origin + window.location.pathname + 'appraisal.php';

    var itemlist = {};
    for (var i=0; i < items.length; i++) {
        itemlist[indexes[i]] = items[i];
    }
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(itemlist)
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch appraisal data.');
      }
  
      const data = await response.json();

      return data.appraisal.totals.buy; // Use 'buy' for the total value
    } catch (error) {
      console.error('Error calculating total value:', error);
      return 0; // Return 0 in case of an error
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
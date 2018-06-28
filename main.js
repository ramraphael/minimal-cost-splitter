//
// GLOBAL VARIABLES GO HERE
// Names are self-explanatory
//
var billWithoutTip=0, tipPercentage=0, totalBill=0, partyNames=[], partyMembers=[];

// Variables for all forward buttons
var startButton = document.getElementById("startSplitter");
var submitBill = document.getElementById("submitBill");
var submitTip = document.getElementById("submitTip");
var submitNames = document.getElementById("submitNames");
var splitAgain = document.getElementById("splitEvenly");

// Variables for all back buttons
var back1 = document.getElementById("goBack1");
var back2 = document.getElementById("goBack2");
var back3 = document.getElementById("goBack3");

// Variables for individual splash pages
var startScreen = document.getElementById("introSplash");
var billScreen = document.getElementById("billRequest");
var tipScreen = document.getElementById("tipRequest");
var namesScreen = document.getElementById("nameRequest");
var finalScreen = document.getElementById("splitBills");

// Variables for input boxes
var billInput = document.getElementById("billWithoutTip");
var tipInput = document.getElementById("tipPercentage");
var namesInput = document.getElementById("partyNames");

//
// EVENT LISTENERS GO HERE//
//

// Event listeners for moving screen forward

// First button moves from welcome screen to bill input screen
startButton.addEventListener("click", function(){
    startScreen.style.display='none';
    billScreen.style.display='block';
});

// Second forward button saves bill without tip, converting it to float
submitBill.addEventListener("click", function(){
    if (stringToFloat(billInput.value)==-1 || isNaN(stringToFloat(billInput.value))){
        alert('Please enter a dollar amount');
    }
    else{
        billWithoutTip = stringToFloat(billInput.value);
        console.log("Bill without tip: "+billWithoutTip);
        billScreen.style.display='none';
        tipScreen.style.display='block'
    }
});

// Third forward button saves tip percentage as variable, and updates final totalBill variable
submitTip.addEventListener("click", function(){
    if (stringToFloat(tipInput.value)==-1 || isNaN(stringToFloat(tipInput.value))){
        alert ('Please enter a percentage');
    }
    else{
        tipPercentage = stringToFloat(tipInput.value);
        totalBill = Math.ceil((billWithoutTip * (1 + parseFloat(tipPercentage)/100)));
        console.log('Tip percentage: '+tipPercentage);
        console.log('Total bill: '+totalBill);
        tipScreen.style.display='none';
        namesScreen.style.display='block';
    }    
});

// Fourth button cleans up names of party members and adds to array
// Calls function to format individual split bills and displays them in table on final screen
submitNames.addEventListener("click", function(){
    // if every character of submission is a digit:
        // change entry to integer
        // for loop to add "Guest" + i to partyNames
    // else
    
    // Empties party names and party members array
    partyNames.splice(0,partyNames.length);
    partyMembers.splice(0,partyMembers.length);
    
    if (namesInput.value.isNumber()){
        var numGuests = parseInt(namesInput.value);
        for (var i=1; i<=numGuests; i++){
            partyNames.push("Guest "+i);
        }
        console.log(partyNames)
    }
    else{
        partyNames = namesInput.value.split(/[ ,]+/);
        // Makes every letter except for the first letter of each name lowercase
        for (var i=0; i<partyNames.length; i++){
            partyNames[i]=partyNames[i].trim().toLowerCase();        
            partyNames[i]=partyNames[i][0].toUpperCase()+partyNames[i].substr(1);
        }
        partyNames.sort();
        console.log(partyNames)
    }
        
    // Fill partyMembers array with each party member as an object
    // Bill percentage and money owed are set to a sane default, an even split
    for (var i=0; i<partyNames.length; i++){
        partyMembers.push({
            Name: partyNames[i],
            BillPercentage: parseFloat((parseFloat(100)/partyNames.length).toFixed(1)),
            MoneyOwed: parseFloat((totalBill * ((parseFloat(100)/partyNames.length)/100)).toFixed(1)),
            Edited: "false"
        })
    }    
    document.getElementById("finalTotalBill").innerHTML = "<h2 id='finalTotalBill'>The total bill (with tip) is: <span id='finalScreenTotalBill'> $" + totalBill + "</span></h2>";
    rebuildTable();
    assignSplitBillEventListeners();
    namesScreen.style.display='none';
    finalScreen.style.display='block';
});

splitAgain.addEventListener("click", function(){
    // Empties party members array
    partyMembers.splice(0,partyMembers.length);

    for (var i=0; i<partyNames.length; i++){
        partyMembers.push({
            Name: partyNames[i],
            BillPercentage: parseFloat((parseFloat(100)/partyNames.length).toFixed(1)),
            MoneyOwed: parseFloat((totalBill * ((parseFloat(100)/partyNames.length)/100)).toFixed(1)),
            Edited: "false"
        })
    }    
    document.getElementById("finalTotalBill").innerHTML = "<h2 id='finalTotalBill'>The total bill (with tip) is: <span id='finalScreenTotalBill'> $" + totalBill + "</span></h2>";
    rebuildTable();
    assignSplitBillEventListeners();    
})

// Event listeners for back buttons, input values are not cleared, so still accessible when going back
back1.addEventListener("click", function(){tipScreen.style.display='none'; billScreen.style.display='block';});
back2.addEventListener("click", function(){namesScreen.style.display='none'; tipScreen.style.display='block';});
back3.addEventListener("click", function(){finalScreen.style.display='none'; namesScreen.style.display='block';});

// Pseudo Input-Masking: Automatically add '$' & '%' signs to appropriate input boxes
document.getElementById("billWithoutTip").addEventListener('click', function(){
    if(this.value[0]!='$'){
        this.value='$'+this.value;
    }
});
document.getElementById("billWithoutTip").addEventListener('focusout',function(){
    if(this.value.length>1 && this.value[0]!='$'){
        this.value='$'+this.value;
    }
    else if (this.value.length==1 && this.value[0]=='$'){
        this.value = '';
    }
})
document.getElementById("tipPercentage").addEventListener('focusout',function(){
    if(this.value!='' && this.value[this.value.length-1]!='%'){
        this.value+='%';
    }
})

// Functions to display and format final split bills screen
function rebuildTable(){
    console.log(partyMembers[1].name)
    var table = document.getElementById('split-table');
    var newRow, newCell;
    while(table.hasChildNodes()){
        table.removeChild(table.firstChild);
    }
    // loop through partyMembers
    // if i is even, create new row, and assign it to newRow
    // create new cell, add data from object to it, formatted correctly
    for (var i=0; i<partyMembers.length; i++){
        if (i%2==0){
            newRow = table.insertRow(table.rows.length);
            newCell = newRow.insertCell(0);
            newCell.innerHTML = formatIndividualBill(partyMembers[i], i);                        
        }
        else{
            newCell = newRow.insertCell(1);
            newCell.innerHTML = formatIndividualBill(partyMembers[i], i);            
        }
    }
}
    
function assignSplitBillEventListeners(){
    //EDIT BUTTON EVENT LISTENERS
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-edit-money").addEventListener("click",function(){
            this.previousSibling.contentEditable = 'true';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var i=0; i<editButtons.length; i++){
                editButtons[i].style.display='none';
            }
            this.previousSibling.focus()
            this.previousSibling.addEventListener("blur", function(){
                this.focus();
            })
            this.nextSibling.style.display='inline';
            this.nextSibling.nextSibling.style.display='inline';                
        });
        document.getElementById(i+"-edit-percentage").addEventListener("click",function(){
            this.previousSibling.previousSibling.contentEditable = 'true';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var i=0; i<editButtons.length; i++){
                editButtons[i].style.display='none';
            }
            this.previousSibling.previousSibling.focus()
            this.previousSibling.addEventListener("blur", function(){
                this.focus();
            })
            this.nextSibling.style.display='inline';
            this.nextSibling.nextSibling.style.display='inline';                
        });
    }

    // SAVE BUTTON EVENT LISTENERS
    // Money Save Buttons
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-money-save-button").addEventListener("click",function(){
            var index = parseInt(this.id.split('-')[0]);
            if ((document.getElementById(index+"-money-owed").innerHTML>totalBill) || (document.getElementById(index+"-money-owed").innerHTML<0)){
                alert("Entered amount was over the total bill");
                document.getElementById(this.id.split('-')[0]+"-money-owed").innerText = partyMembers[this.id.split('-')[0]].MoneyOwed;
            }            
            else{
                partyMembers[index].MoneyOwed = parseFloat(parseFloat(document.getElementById(index+"-money-owed").innerHTML).toFixed(1));
                partyMembers[index].BillPercentage = (((parseFloat(partyMembers[index].MoneyOwed)/totalBill)*100).toFixed(1));                
                partyMembers[index].Edited = "true";
                recalculateMoneyOwed();
                rebuildTable();
                assignSplitBillEventListeners();
                var editButtons = document.getElementsByClassName('edit-button');
                for (var j=0; j<editButtons.length; j++){
                    editButtons[j].style.display='inline';
                }
                this.nextSibling.style.display='none';
                this.style.display='none';
            }            
        });
    }
    
    // Percent Save Buttons
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-percentage-save-button").addEventListener("click",function(){
            var index = parseInt(this.id.split('-')[0]);
            if ((document.getElementById(index+"-bill-percentage").innerHTML>100) || (document.getElementById(index+"-bill-percentage").innerHTML<0)){
                alert("Please enter a percentage between 0 and 100");
                document.getElementById(this.id.split('-')[0]+"-bill-percentage").innerText = partyMembers[this.id.split('-')[0]].BillPercentage;
            }            
            else{
                partyMembers[index].BillPercentage = parseFloat(parseFloat(document.getElementById(index+"-bill-percentage").innerHTML).toFixed(1));
                partyMembers[index].MoneyOwed = parseFloat((totalBill*(parseFloat(partyMembers[index].BillPercentage)/100)).toFixed(1));
                partyMembers[index].Edited = "true";
                recalculateMoneyOwed();
                rebuildTable();
                assignSplitBillEventListeners();
                var editButtons = document.getElementsByClassName('edit-button');
                for (var j=0; j<editButtons.length; j++){
                    editButtons[j].style.display='inline';
                }
                this.nextSibling.style.display='none';
                this.style.display='none';
            }        
        });
    }

    // CANCEL BUTTON EVENT LISTENERS
    // Money Cancel Buttons
    for (var i=0; i<partyMembers.length; i++){        
        document.getElementById(i+"-money-cancel-button").addEventListener("click",function(){                        
            document.getElementById(this.id.split('-')[0]+"-money-owed").innerText = partyMembers[this.id.split('-')[0]].MoneyOwed;            
            this.previousSibling.previousSibling.previousSibling.contentEditable='false';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var j=0; j<editButtons.length; j++){
                editButtons[j].style.display='inline';
            }
            this.previousSibling.style.display='none';
            this.style.display='none';
        });
    }
    
    // Percentage Cancel Buttons
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-percentage-cancel-button").addEventListener("click",function(){
            document.getElementById(this.id.split('-')[0]+"-bill-percentage").innerHTML = partyMembers[this.id.split('-')[0]].BillPercentage;
            this.previousSibling.previousSibling.previousSibling.previousSibling.contentEditable='false';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var j=0; j<editButtons.length; j++){
                editButtons[j].style.display='inline';
            }
            this.previousSibling.style.display='none';
            this.style.display='none';
        });
    }

    // Hide Save and Cancel buttons by default
    var saveCancelButtons = document.querySelectorAll('.save-button,.cancel-button');
    for (var i=0; i<saveCancelButtons.length; i++){
        saveCancelButtons[i].style.display='none';
    }
}

function formatIndividualBill(s, i){
    return "<div class='individual-split'>"+        
        "<h1 class='party-name'>"+s.Name+" owes $  <span id='"+i+"-money-owed' class='money-owed'>"+
            s.MoneyOwed+"</span>"+
            "<sup class='edit-button' id='"+i+"-edit-money'>edit</sup>"+
            "<span class='save-button fas fa-check' id='"+i+"-money-save-button'></span>"+
            "<span class='cancel-button fas fa-times' id='"+i+"-money-cancel-button'>  </span></h1>"+
        "<h2>or</h2>"+
        "<h1><span id='"+i+"-bill-percentage' class='bill-percentage'>"+s.BillPercentage+"</span><span>%</span>"+
        "<sup id='"+i+"-edit-percentage' class='edit-button'>edit</sup>"+
        "<span class='save-button fas fa-check' id='"+i+"-percentage-save-button'></span>"+
        "<span class='cancel-button fas fa-times' id='"+i+"-percentage-cancel-button'>  </span></h1>"+
        // "<div class='sliderContainer'>"+
        //     "<input type='range' min='1' max='100' value='50' class='slider' id='billSlider0'>"+
        // "</div>"+
        // "<h2>of the bill</h2>"+
    "</div>";    
}

function recalculateMoneyOwed(){
    // loop through partymembers
    // if party member edited = false, count++
    // editedPercentage -= partymember percentage
    // if i != id, partyMember[i].MoneyOwed = (totalBill - partyMember[id].MoneyOwed)/partyMembers.length
    var uneditedCount=0, uneditedPercentage=100;    
    for (var k=0; k<partyMembers.length; k++){
        if (partyMembers[k].Edited=="false"){
            uneditedCount++;            
        }
        else{
            uneditedPercentage-=partyMembers[k].BillPercentage;            
        }
    }
    if (uneditedCount==0){
        alert("Every amount was changed. Resetting to split evenly.");
         // Empties party names and party members array        
        partyMembers.splice(0,partyMembers.length);        
        for (var i=0; i<partyNames.length; i++){
            partyMembers.push({
                Name: partyNames[i],
                BillPercentage: Math.ceil((parseFloat(100)/partyNames.length)),
                MoneyOwed: parseFloat((totalBill * ((parseFloat(100)/partyNames.length)/100)).toFixed(1)),
                Edited: "false"
            })
        }
        document.getElementById("finalTotalBill").innerHTML = "<h2 id='finalTotalBill'>The total bill (with tip) is: <span id='finalScreenTotalBill'> $" + totalBill + "</span></h2>";
        rebuildTable();
        assignSplitBillEventListeners();    
    }
    else{
        for (var k=0; k<partyMembers.length; k++){
            if (partyMembers[k].Edited==="false"){
                partyMembers[k].BillPercentage=parseFloat((parseFloat(uneditedPercentage)/uneditedCount).toFixed(1));
                partyMembers[k].MoneyOwed = parseFloat((totalBill*(parseFloat(partyMembers[k].BillPercentage)/100)).toFixed(1));

            }
        }    
    }    
}

///
// Helper functions for calculation
///

// Cleans up bill input by removing dollar and percent signs
function stringToFloat(s){
    var returnString = '';
    for (var i=0; i<s.length; i++){
        if ((s=='') || (s.charCodeAt(i)!=46 && s.charCodeAt(i)!=37 && s.charCodeAt(i)!=36 && (s.charCodeAt(i)<=47 || s.charCodeAt(i)>=58))){
            return -1;
        }
        if (s.charCodeAt(i)==46 || (s.charCodeAt(i)>47 && s.charCodeAt(i)<58)){
            returnString += s.charAt(i);
        }
    }
    return parseFloat(returnString);
}

// Function for testing if a string contains only digits
String.prototype.isNumber = function(){
    return /^\d+$/.test(this);
}
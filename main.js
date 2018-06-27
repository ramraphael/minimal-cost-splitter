//
// GLOBAL VARIABLES GO HERE//
//
var billWithoutTip=0, tipPercentage=0, totalBill=0, partyNames=[], partyMembers=[];

// Variables for all forward buttons
var startButton = document.getElementById("startSplitter");
var submitBill = document.getElementById("submitBill");
var submitTip = document.getElementById("submitTip");
var submitNames = document.getElementById("submitNames");

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

// Second button saves tip percentage as variable
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

// Third button cleans up names of party members and adds to array
// Calls function to format individual split bills and displays them in table on final screen
submitNames.addEventListener("click", function(){
    // Clears original party array    
    partyNames.splice(0,partyNames.length);
    partyMembers.splice(0,partyMembers.length);
    partyNames = namesInput.value.split(/[ ,]+/);
    for (var i=0; i<partyNames.length; i++){
        partyNames[i]=partyNames[i].trim();
    }
    partyNames.sort();
    console.log(partyNames)
    // Fill partyMembers array with each party member as an object
    // Bill percentage and money owed are set at default, based on number of people
    for (var i=0; i<partyNames.length; i++){
        partyMembers.push({
            Name: partyNames[i],
            BillPercentage: Math.ceil((parseFloat(100)/partyNames.length)),
            MoneyOwed: Math.ceil(totalBill * ((parseFloat(100)/partyNames.length)/100))
        })
    }    
    document.getElementById("finalTotalBill").innerHTML = "<h2 id='finalTotalBill'>The total bill (with tip) is: </h2><span id='finalScreenTotalBill'> $" + totalBill + "</span>";
    displaySplitBill();
    namesScreen.style.display='none';
    finalScreen.style.display='block';
});

// Event listeners for back buttons
back1.addEventListener("click", function(){tipScreen.style.display='none'; billScreen.style.display='block';});
back2.addEventListener("click", function(){namesScreen.style.display='none'; tipScreen.style.display='block';});
back3.addEventListener("click", function(){finalScreen.style.display='none'; namesScreen.style.display='block';});

// Pseudo Input-Masking: Automatically append '$' & '%' signs to bill input box
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
function displaySplitBill(){
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
    
    //Assign event listeners for edit buttons
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-edit-money").addEventListener("click",function(){
            this.previousSibling.contentEditable = 'true';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var i=0; i<editButtons.length; i++){
                editButtons[i].style.display='none';
            }
            this.previousSibling.focus()
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
            this.nextSibling.style.display='inline';
            this.nextSibling.nextSibling.style.display='inline';                
        });
    }

    // SAVE BUTTON EVENT LISTENERS
    // Money Save Buttons
    // Percent Save Buttons

    // CANCEL BUTTON EVENT LISTENERS
    // Money Cancel Buttons
    for (var i=0; i<partyMembers.length; i++){
        document.getElementById(i+"-money-cancel-button").addEventListener("click",function(){            
            // console.log(partyMembers[i].MoneyOwed);
            // document.getElementById(i+"-money-owed").innerText = partyMembers[i].MoneyOwed;            
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
            // document.getElementById(i+"-bill-percentage").innerHTML = partyMembers[i].BillPercentage;
            this.previousSibling.previousSibling.previousSibling.previousSibling.contentEditable='false';
            var editButtons = document.getElementsByClassName('edit-button');
            for (var i=0; i<editButtons.length; i++){
                editButtons[i].style.display='inline';
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
    return "<div class='individul-split'>"+
        "<div class='modal-header'>"+
            "<h1 class='split-header party-name'>"+s.Name+" owes $  <span id='"+i+"-money-owed' class='money-owed'>"+
                s.MoneyOwed+"</span>"+
                "<sup class='edit-button' id='"+i+"-edit-money'>edit</sup>"+
                "<span class='save-button fas fa-check' id='"+i+"-save-button'></span>"+
                "<span class='cancel-button fas fa-times' id='"+i+"-money-cancel-button'>  </span></h1>"+
            "<h2 class='split-or'>or</h2>"+
            "<h1 class='split-header'><span id='"+i+"-bill-percentage' class='bill-percentage'>"+s.BillPercentage+"</span><span>%</span>"+
            "<sup id='"+i+"-edit-percentage' class='edit-button'>edit</sup>"+
            "<span class='save-button fas fa-check' id='"+i+"-save-button'></span>"+
            "<span class='cancel-button fas fa-times' id='"+i+"-percentage-cancel-button'>  </span></h1>"+
            // "<div class='sliderContainer'>"+
            //     "<input type='range' min='1' max='100' value='50' class='slider' id='billSlider0'>"+
            // "</div>"+
            "<h2>of the bill</h2>"+
        "</div>"+
    "</div>";
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
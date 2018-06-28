// Round up individual money owed to one decimal place
// Total bill (with tip) on final screen header
// Option to just enter the number of guests
Quick tip entry (Average, Good, Great)

Individual order for party members


recalculateMoney(){

}


// Edit button onclick:
    // Change bill/percent contenteditable=true
    // Change focus to number
    // Hide all other edit buttons
    // Replace current edit with save & cancel
        // On saveclick:
            // Leave focus
            // Change appropriate variable to element value
            // Update all other partymember bills
            // Update table fields
            // Hide save and cancel, show edit
        // On cancel:
            // Undo
            // Leave focus
            // Hide save and cancel, show edit

/*
    1.) Save totalBill to billWithoutTip (alert if not number).
    2.) Save tipPercentage to tipPercentage (alert if not number).
    3.) Split names input box into an array, partyNames. Save length of array as partyNumber.    
    4.) Create objects for each party member, with properties Name, Percentage, and MoneyOwed, and push it to array partyMembers.
        a.) Name is each name from partyNames
        b.) Percentage is 100/partyNumber
        c.) MoneyOwed is totalBill*(parseFloat(Percentage)/100)
*/
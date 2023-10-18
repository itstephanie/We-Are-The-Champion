// javascript
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://realtime-database-61e91-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const endorsementList = ref (database, "endorsement-list")

const textAreaEl = document.getElementById("text-area")
const publishBtnEl = document.getElementById("publish-btn")
const endorsementListEl = document.getElementById("endorsement-list") 

// publish button 
publishBtnEl.addEventListener("click", function() {
    let textAreaValue = textAreaEl.value;

    // Push data to the database
    push(endorsementList, textAreaValue);

    clearTextArea()
});

// onValue
onValue(endorsementList, function(snapshot) {
    if (snapshot.exists()) {
        let itemsObject = snapshot.val();
        let itemsArray = Object.entries(itemsObject).reverse();

        clearEndorsementList();

        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i];
            let currentItemID = currentItem[0];
            let currentItemValue = currentItem[1];

            appendItemToEndorsementList(currentItemID, currentItemValue);
        }
    } else {
        endorsementListEl.innerHTML = "Publish your endorsement...";
    }
});

// function to clear existing content 
function clearEndorsementList() {
    endorsementListEl.innerHTML = "";
}

function clearTextArea() {
    textAreaEl.value = "";
}

function appendItemToEndorsementList(itemID, itemValue) {
    let newEl = document.createElement("li");

    newEl.textContent = itemValue;

    newEl.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `endorsement-list/${itemID}`);

        // Remove item from the database
        remove(exactLocationOfItemInDB);
    });

    endorsementListEl.appendChild(newEl);
}
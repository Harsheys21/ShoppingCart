import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js'
import {getDatabase, ref, push, onValue, remove} from 'https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js'

const appSettings = {
    databaseURL: "" // put your database url here
}

const app = initializeApp(appSettings);
const databaseURL = getDatabase(app);
const groceriesInDB = ref(databaseURL, "groceries");

const inputField = document.getElementById("input-field");
const button = document.getElementById("add-button");
const list = document.getElementById("shopping-list")

button.addEventListener("click",updateConsole);

function updateConsole() {
    let input = inputField.value;
    push(groceriesInDB, input);
    console.log(input + " added to database");

    refreshInput();
    onValue(groceriesInDB, function(snapshot) {
        if(snapshot.exists()){
            let groceriesarray = Object.entries(snapshot.val());
            list.innerHTML = '';

            for(let i = 0; i < groceriesarray.length; i++){
                const currentItem =  groceriesarray[i];
                addToList(currentItem);
            }
        } else {
            list.innerHTML="No items here... yet";
        }
    })
}


function refreshInput(){
    inputField.value = null;
}

function addToList(input){
    let itemID = input[0];
    let itemValue = input[1];

    let element = document.createElement("li");

    element.textContent = itemValue;

    element.addEventListener("click", function(){
        let exactLocation = ref(databaseURL, `groceries/${itemID}`);
        remove(exactLocation);
    })

    list.append(element);
}
// Declare the elements that will be used into variables
// Defined in the global scope so that they can be accessed by all functions

const form = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const formButton = document.querySelector('form button');
const filterInput = document.getElementById('filter');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');

function addItem(e){
    // Prevent form from submitting
    e.preventDefault();

    const newItem = itemInput.value;

    // validate input
    if (newItem === ''){
        alert('Please add an item')
        return;
    }

    // create list item
    const li  = document.createElement('li');
    li.appendChild(document.createTextNode(newItem))
    const button = createButton('remove-item btn-link text-red');

    // Append button to the new item and append new item to existing list.
    li.appendChild(button);
    itemList.appendChild(li);

    checkUI();
    // Clear input
    itemInput.value = '';
}

// Functin to create buttons
function createButton(classes){
    const btn = document.createElement('button');
    btn.className = classes;

    const icon = createIcon('fa-solid fa-xmark')
    btn.appendChild(icon);
    return btn
}

// Function to create icon and pass to the button
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

function removeitem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        if (confirm('Are you sure?')){
            e.target.parentElement.parentElement.remove();
            checkUI();
        }
    }
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.firstChild.remove()
    }
    checkUI();
}

function checkUI(){
    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        clearButton.style.display = 'none';
        filterInput.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        filterInput.style.display = 'block';

    }
}

// Event Listeners
form.addEventListener('submit', addItem);
itemList.addEventListener('click', removeitem);
clearButton.addEventListener('click', clearItems);

checkUI();
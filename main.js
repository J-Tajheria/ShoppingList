// Declare the elements that will be used into variables
// Defined in the global scope so that they can be accessed by all functions

const form = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const formButton = document.querySelector('form button');
const filterInput = document.getElementById('filter');
const itemList = document.getElementById('item-list');
const clearButton = document.getElementById('clear');
let isEditMode = false;

function onAddItemSubmit(e){
    // Prevent form from submitting
    e.preventDefault();

    const newItem = itemInput.value;

    // validate input
    if (newItem === ''){
        alert('Please add an item')
        return;
    }

    // Check for edit mode
    if(isEditMode){
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove()
        isEditMode = false;
    } else {
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }
    // create dom element
    addItemToDOM(newItem);

    // add item to local storage
    addItemToStorage(newItem)

    checkUI();
    // Clear input
    itemInput.value = '';
}

function addItemToDOM(item){
    // create list item
    const li  = document.createElement('li');
    li.appendChild(document.createTextNode(item))
    const button = createButton('remove-item btn-link text-red');

    // Append button to the new item and append new item to existing list.
    li.appendChild(button);
    itemList.appendChild(li);
}

function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage
}

function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
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

function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else{
        setItemToEdit(e.target)
    }
}

function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
    }

function setItemToEdit(item){
    isEditMode = true;

    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = '#228B22';

    itemInput.value = item.textContent;
}

function removeItem(item){
    console.log(item)
    if (confirm('Are you sure?')){
        //  Remove item from DOM
        item.remove();
        // Remove item from Local storage
        removeItemFromStorage(item.textContent)
        checkUI();
    }
}

function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Reset to local storage.
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function clearItems(e){
    while(itemList.firstChild){
        itemList.firstChild.remove()
    }
    // Clear from local storage
    localStorage.removeItem('items')
    checkUI();
}

function checkUI(){
    itemInput.value = '';

    const items = itemList.querySelectorAll('li');

    if(items.length === 0){
        clearButton.style.display = 'none';
        filterInput.style.display = 'none';
    } else {
        clearButton.style.display = 'block';
        filterInput.style.display = 'block';
    }
    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add item'
    formButton.style.backgroundColor = '#333';
    isEditMode = false;
}

function filterItems(e){
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();
    
    items.forEach((item) => {
        const itemName = item.firstChild.textContent.toLowerCase()
        if (itemName.indexOf(text) !== -1){
            item.style.display = 'flex';
        } else{
            item.style.display = 'none';
        }
    })
}

// Initialise app
function init(){
    // Event Listeners
    form.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearButton.addEventListener('click', clearItems);
    filterInput.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
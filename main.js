// Grab frequently used DOM elements once (global scope so all functions can access them)
const form = document.getElementById('item-form');  // form that submits new items / updates
const itemInput = document.getElementById('item-input'); // text input for item name
const formButton = document.querySelector('form button'); // submit button inside the form
const filterInput = document.getElementById('filter'); // input used to filter visible items
const itemList = document.getElementById('item-list'); // <ul> or <ol> that contains list items
const clearButton = document.getElementById('clear'); // button to clear all items
let isEditMode = false;  // flag indicating whether we're editing an existing item

// Handle form submission - add a new item or update an existing one
function onAddItemSubmit(e){
    // Prevent form from posting and reloading the page
    e.preventDefault();

    const newItem = itemInput.value;

    // validate input
    if (newItem === ''){
        alert('Please add an item')
        return;
    }

    // If editing, replace the existing item; otherwise ensure the item is unique and add it
    if(isEditMode){
        // Find the item currently marked for editing, remove it from storage and the DOM
        const itemToEdit = itemList.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove()
        isEditMode = false;
    } else {
        // Prevent adding duplicates (case-sensitive based on storage content)
        if(checkIfItemExists(newItem)){
            alert('That item already exists!');
            return;
        }
    }

    // Create the list element in the DOM and persist the new item
    addItemToDOM(newItem);
    addItemToStorage(newItem)

    checkUI();            // update UI state (buttons, inputs)
    itemInput.value = ''; // clear the input for the next entry
}

// Create a single list item element with a remove button and append to the list
function addItemToDOM(item){
    // create list item
    const li  = document.createElement('li');
    li.appendChild(document.createTextNode(item))
    const button = createButton('remove-item btn-link text-red');

    // Append button to the new item and append new item to existing list.
    li.appendChild(button);
    itemList.appendChild(li);
}

// Persist a single item string in localStorage (keeps previous entries)
function addItemToStorage(item){
    const itemsFromStorage = getItemsFromStorage();

    itemsFromStorage.push(item);

    // convert to JSON string and set to local storage
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Retrieve the items array from localStorage (or return an empty array)
function getItemsFromStorage(){
    let itemsFromStorage;

    if(localStorage.getItem('items') === null){
        itemsFromStorage = [];
    } else{
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage
}

// Read items from storage and render each into the DOM. Also update UI controls.
function displayItems(){
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach((item) => addItemToDOM(item));
    checkUI();
}

// Utility to create a button element with a given class list (used for remove button)
function createButton(classes){
    const btn = document.createElement('button');
    btn.className = classes;

    const icon = createIcon('fa-solid fa-xmark')
    btn.appendChild(icon);
    return btn
}

// Utility to create an <i> element for an icon; caller sets class names
function createIcon(classes){
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// Handle clicks inside the item list: either remove an item or set it to edit mode
function onClickItem(e){
    if(e.target.parentElement.classList.contains('remove-item')){
        removeItem(e.target.parentElement.parentElement)
    } else{
        setItemToEdit(e.target)
    }
}

// Check whether a given item string already exists in storage (used to prevent duplicates)
function checkIfItemExists(item){
    const itemsFromStorage = getItemsFromStorage();

    return itemsFromStorage.includes(item);
    }

// Mark a list item as being edited: populate the input, change button text and color
function setItemToEdit(item){
    isEditMode = true;

    // Clear any previous edit-mode markings
    itemList
        .querySelectorAll('li')
        .forEach((i) => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formButton.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formButton.style.backgroundColor = '#228B22';

    itemInput.value = item.textContent; // copy existing text into the input for editing
}

// Remove an item element from the DOM and storage after confirmation
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

// Remove an item string from localStorage by filtering it out of the saved array
function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Filter out items to be removed
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Reset to local storage.
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Remove all list items from the DOM and clear localStorage
function clearItems(e){
    while(itemList.firstChild){
        itemList.firstChild.remove()
    }
    // Clear from local storage
    localStorage.removeItem('items')
    checkUI();
}

// Update UI elements based on current list state:
// - show/hide clear and filter controls
// - reset form button state and input
// - clear edit mode flag
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
    // Reset form button back to the default 'Add item' appearance
    formButton.innerHTML = '<i class="fa-solid fa-plus"></i> Add item'
    formButton.style.backgroundColor = '#333';
    isEditMode = false;
}

// Filter visible list items using the text in the filter input (case-insensitive)
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

// Initialise the app: attach event listeners and render stored items
function init(){
    // Form submit for add/update
    form.addEventListener('submit', onAddItemSubmit);
    // Delegate clicks inside the list to a single handler
    itemList.addEventListener('click', onClickItem);
    // Clear all items
    clearButton.addEventListener('click', clearItems);
    // Live filter as user types
    filterInput.addEventListener('input', filterItems);
    // On page load, populate list from storage
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
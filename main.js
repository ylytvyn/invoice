'use strict';

const ITEMS = [
    {
        id: 0,
        name: 'Premium Banana',
        price: 15
    },
    {
        id: 1,
        name: 'Oranges Leila',
        price: 17
    },
    {
        id: 2,
        name: 'Chicken Eggs',
        price: 40
    },
    {
        id: 3,
        name: 'Pizza "Mozzarella"',
        price: 150
    },
    {
        id: 4,
        name: 'Ice Cream "Bohemia"',
        price: 76
    },
    {
        id: 5,
        name: 'Green Lettuce',
        price: 67
    },
    {
        id: 6,
        name: 'Home Cucumbers',
        price: 77
    },
    {
        id: 7,
        name: 'Cheeze "Cheddar"',
        price: 89
    },
    {
        id: 8,
        name: 'Coffee "Lavazza Cream"',
        price: 155
    },
    {
        id: 9,
        name: 'Turkey',
        price: 205
    },
    {
        id: 10,
        name: 'Mayo "Picklles"',
        price: 58
    },
    {
        id: 11,
        name: 'Cheeze Muffin',
        price: 16
    },
    {
        id: 12,
        name: 'Olive Oil "Greek Pressure"',
        price: 198
    },
    {
        id: 13,
        name: 'Apple Juice "Yagodka"',
        price: 45
    },
    {
        id: 14,
        name: 'BBQ Sause "Ogonek"',
        price: 77
    },
    {
        id: 15,
        name: 'Orange Pepper',
        price: 54
    }
];

let SHOPPING_ITEMS = [];

(function(){
    // Click on ADD ITEM button
    let openModalBtn = document.getElementById('add-btn');
    openModalBtn.addEventListener('click', toggleModal);

    // Close window
    let closeModalBtn = document.querySelector('[data-dismiss="modal"]');
    closeModalBtn.addEventListener('click', toggleModal);

    // Save item
    let addBtn = document.querySelector('.save-btn');
    addBtn.addEventListener('click', addItem);

    // Show current date
    let dateWrap = document.querySelector('.date');
    dateWrap.innerHTML += (new Date()).toJSON().slice(0, 10).split('-').reverse().join('/');

    // Print invoice
    let printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', () => {
        if (!isShoppingListEmpty()) {
            window.print();
        }
    });

    // Find the most expensive item
    let expensiveBtn = document.getElementById('expensive-btn');
    expensiveBtn.addEventListener('click', findExpensiveItem);

    // Find average price
    let averageBtn = document.getElementById('average-btn');
    averageBtn.addEventListener('click', findAveragePrice);

    // Draw elements
    drawItems();
})();

// Check empty list
function isShoppingListEmpty() {
    if (!SHOPPING_ITEMS.length) {
        showWarning('Please add item first!');
        return true;
    } else {
        return false;
    }
}

// Warning
function showWarning(msg) {
    let dialog = document.createElement('div'),
        dialogOverlay = document.createElement('div');

    dialogOverlay.className = 'dialog-overlay';
    dialog.className = 'dialog';

    dialog.innerHTML = `<p>${msg}</p>`;

    document.body.append(dialogOverlay, dialog);

    setTimeout(() => {
        dialogOverlay.remove();
        dialog.remove();
    }, 3000);
}

// toggle Modal window with items
function toggleModal() {
    let modal = document.querySelector('.modal');

    if (modal.style.display === 'none' || modal.style.display === '') {
        modal.style.display = 'block';
    } else {
        modal.style.display = 'none';
    }
    
}

// Display in Modal list of items
function drawItems() {
    let form = document.forms['itemFrom'],
        select = form.item;

    ITEMS.forEach((item) => {
        select.innerHTML += `<option value="${item.id}">${item.name}</option>`;
    });
}

// Add item to list
function addItem() {
    let form = document.forms['itemFrom'],
        select = form.item,
        qty = form.qty,
        sameItem;

    sameItem = SHOPPING_ITEMS.filter(elem => elem.itemId === parseInt(select.value));
    
    if (sameItem.length) {
        let index = SHOPPING_ITEMS.findIndex(elem => elem.itemId === parseInt(select.value));

        SHOPPING_ITEMS[index].qty += parseInt(qty.value);
    } else {
        SHOPPING_ITEMS.push({
            itemId: parseInt(select.value),
            qty: parseInt(qty.value)
        });
    }

    drawList();
    // Erase fields and close modal
    toggleModal();
    qty.value = 1;
    select.value = ITEMS[0].id;
}

// Display Shopping List
function drawList() {
    let container = document.querySelector('.card-body'),
        totalContainer = document.querySelector('.total'),
        sumShoppingItems = 0;

    while (container.firstChild) {
        container.removeChild(container.lastChild);
    }

    SHOPPING_ITEMS.forEach((item) => {
        let initialItem = ITEMS.find(elem => elem.id === item.itemId),
            blockHTML = `<div class="card-row">
            <div class="card-col col-5">${initialItem.name}</div>
            <div class="card-col col-2 text-center">$${initialItem.price.toFixed(2)}</div>
            <div class="card-col col-2 text-center">${item.qty}</div>
            <div class="card-col col-2 text-right">$${(initialItem.price * item.qty).toFixed(2)}</div>
            <div class="card-col col-1 text-center">
                <button type="button" class="close" data-item=${item.itemId}>&times;</button>
            </div>
        </div>`;

        container.innerHTML += blockHTML;
        sumShoppingItems += initialItem.price * item.qty;
    });

    //Event Listeners
    let deleteBtns = document.querySelectorAll('.close');
    deleteBtns.forEach((elem) => {
        elem.addEventListener('click', deleteItem);
    });

    totalContainer.innerHTML = `$${sumShoppingItems.toFixed(2)}`;
}

// Delete item
function deleteItem() {
    let id = parseInt(this.dataset.item),
        initialItem = ITEMS.find(elem => elem.id === id),
        userAnswer = confirm(`Are you sure you want to delete ${initialItem.name}?`);

    if (userAnswer) {
        let i = SHOPPING_ITEMS.findIndex(elem => elem.itemId === id);
        SHOPPING_ITEMS.splice(i, 1);
        drawList();
    }
}

// Find the most expensive item
function findExpensiveItem() {
    if (isShoppingListEmpty()) {
        return;
    }

    let expensiveItem;

    SHOPPING_ITEMS.forEach(item => {
        let initialItem = ITEMS.find(elem => elem.id === item.itemId);

        if (expensiveItem) {
            expensiveItem = initialItem.price > expensiveItem.price ? initialItem : expensiveItem;
        } else {
            expensiveItem = initialItem;
        }
        
    });

    showWarning(`The Most Expensive item in your Shopping List is ${expensiveItem.name}, and it costs $${expensiveItem.price.toFixed(2)}.`);
}

// Average price
function findAveragePrice() {
    if (isShoppingListEmpty()) {
        return;
    }

    let sum = 0;

    SHOPPING_ITEMS.forEach((item) => {
        let initialItem = ITEMS.find(e => e.id === item.itemId);
        
        sum += initialItem.price;
    });

    let avg = (sum / SHOPPING_ITEMS.length).toFixed(2);

    showWarning(`The Average price in your Shopping List is $${avg}.`);
}
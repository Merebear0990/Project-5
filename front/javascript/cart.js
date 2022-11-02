const productID = 'Fred';



let template = `<article class="cart__item" data-id="${productID}" data-color="{product-color}">
<div class="cart__item__image">
  <img src="../images/product01.jpg" alt="Photo of sofa">
</div>

<div class="cart__item__content">
  <div class="cart__item__content__description">
    <h2>Name of the product</h2>
    <p>Green</p>
    <p>€42.00</p>
</div>

 <div class="cart__item__content__settings">
  <div class="cart__item__content__setting__quantity">
    <p>Qté : </p>
    <input type="number" class="itemQuantity" min="1" max="100" value="42">
  </div>
   <div class="cart__item__content__settings__delete">
    <p class="deleteItem">Delete</p>
   </div>
  </div>
 </div>
<article>`
console.log(template);



// this is the cart array from local storage
let productLocalStorage = JSON.parse(localStorage.getItem('cart'));

// updates the cart array
function syncCart() {
    let cartString = JSON.stringify(productLocalStorage); // takes data and turns it into a JSON string
    localStorage.setItem('cart', cartString); // add the data to the cart array localStorage
    productLocalStorage = JSON.parse(cartString); // productLocalStorage is the parsed version of the cartString
}

// store product prices on object
const productPrices = {};
fetch('http://localhost:3000/api/products/')
    .then(response => response.json())
    .then(data => initialPrices(data))
    .then(() => {
        buildPage();
        getTotals();
    })
    .catch(error => console.log(error));

// initializes price object
function initialPrices(array) {
    const length = array.length;
    for (let i = 0; i < length; i++) {
        // id - key - property of an object
       //  price - value - price that corresponds to that id
        productPrices[array[i]._id] = array[i].price; // array[i] is object
    }
    console.log(productPrices);
}

function buildPage() {
    // if product is not in local storage
    if (!productLocalStorage) {
        cart = [];
    } else {
        // iterate through all items in the cart
        for (let i = 0; i < productLocalStorage.length; i++) {
            
            // create article
            let productArticle = document.createElement('article');
            productArticle.classList.add('cart__item');
            productArticle.setAttribute('data-id', productLocalStorage[i]._id);
            productArticle.setAttribute('data-color', productLocalStorage[i].color);
            document.querySelector('#cart__items').appendChild(productArticle);
            
            // create image div
            let productDivImage = document.createElement('div');
            productDivImage.classList.add('cart__item__img');
            productArticle.appendChild(productDivImage);

            // create image
            let productImage = document.createElement('img');
            productImage.src = productLocalStorage[i].imageUrl;
            productImage.alt = productLocalStorage[i].altTxt;
            productDivImage.appendChild(productImage);
            
            // create cart item content div
            let productItemContent = document.createElement('div');
            productItemContent.classList.add('cart__item__content');
            productArticle.appendChild(productItemContent);
            
            // create cart item description div
            let productItemContentDescription = document.createElement('div');
            productItemContentDescription.classList.add('cart__item__content__description');
            productItemContent.appendChild(productItemContentDescription);
            
            // add title
            let productName = document.createElement('h2');
            productName.innerHTML = productLocalStorage[i].name;
            productItemContentDescription.appendChild(productName);
            
            // add color
            let productColor = document.createElement('p');
            productColor.innerHTML = productLocalStorage[i].color;
            productItemContentDescription.appendChild(productColor);

            // add price, getting the price from the object not localStorage
            let productPrice = document.createElement('p');

            productPrice.innerHTML = '€' + productPrices[productLocalStorage[i]._id];
            productItemContentDescription.appendChild(productPrice);

            // create cart item content settings div
            let productItemContentSettings = document.createElement('div');
            productItemContentSettings.classList.add('cart__item__content__settings');
            productItemContent.appendChild(productItemContentSettings);

            // create cart item content settings quantity div
            let productItemContentQuantity = document.createElement('div');
            productItemContentQuantity.classList.add('cart__item__content__settings__quantity');
            productItemContentSettings.appendChild(productItemContentQuantity);

            // add quantity text
            let productQuantityText = document.createElement('p');
            productQuantityText.innerHTML = 'Qté : ';
            productItemContentQuantity.appendChild(productQuantityText);

            // add quantity
            let productQuantity = document.createElement('input');
            productQuantity.value = productLocalStorage[i].quantity;
            productQuantity.className = 'itemQuantity';
            productQuantity.setAttribute('type', 'number');
            productQuantity.setAttribute('min', '1');
            productQuantity.setAttribute('max', '100');
            productQuantity.setAttribute('name', 'itemQuantity');
            productItemContentQuantity.appendChild(productQuantity);
            productQuantity.addEventListener('input', updateQuantity);

            // create cart delete div
            let productDelete = document.createElement('button');
            productDelete.setAttribute("type", "button");


            productDelete.className = 'deleteItem';
            productDelete.innerHTML = 'Delete';
            productItemContentSettings.appendChild(productDelete);
            
            productDelete.addEventListener('click', deleteItem);
        }


        // end of for loop
        // order button
        const orderBtn = document.getElementById('order');
        orderBtn.addEventListener('click', orderItem);



    }
}

// delete item function
function deleteItem(event) {
    //remove element from the DOM
    console.log(event);
    const deleteBtn = event.target;
    // const productCard = deleteBtn.parentElement.parentElement.parentElement.parentElement;
    const productCard = deleteBtn.closest('article');
    productCard.getAttribute('data-id');
    const productId = productCard.dataset.id; // grab the data-id of the item being deleted
    const productColor = productCard.dataset.color // grab the data-color of the item being deleted
    productCard.remove();
    const matches = document.querySelectorAll("article[data-id]");

    console.log(matches);
    // remove item from the array
    // counts backwards through the array and when it finds the items with those property values it deletes it
    for (let i = productLocalStorage.length - 1; i >= 0; i--) {
        if (productId === productLocalStorage[i]._id && productColor === productLocalStorage[i].color) {
            productLocalStorage.splice(i, 1);
        }
    }

    // change total price and quantity in DOM to reflect deleted cart item
    getTotals();
    // update localStorage
    syncCart();
}

// modify quantity
function updateQuantity(e) {
    console.log(e.target);

    const productCard = e.target.parentElement.parentElement.parentElement.parentElement;
    console.log(productCard);
    let quantityInput = 0;
    let productQuantity = document.createElement('input');
    const productId = productCard.dataset.id; // grab the data-id
    const productColor = productCard.dataset.color // grab the data-color

    // for (let i = 0; i < productLocalStorage.length; i++) {
    // const cartItem = productLocalStorage[i];
    for (let cartItem of productLocalStorage) {
        if (productId === cartItem._id && productColor === cartItem.color) {
            quantityInput += e.target.valueAsNumber;
            cartItem.quantity = quantityInput;
        }
    }
    // change quantity in DOM to reflect changed cart item
    getTotals();
    // update localStorage
    syncCart();


}

// total quantity and price on page load and when you change the quantity or delete an item
function getTotals() {
    // total quantity
    let productQte = document.getElementsByClassName('itemQuantity');
    let myLength = productQte.length;
    let totalQte = 0;

    for (let i = 0; i < myLength; i++) {
        totalQte += productQte[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQte; // inserting the total quantity into the html

    // total price
    let totalPrice = 0;
    for (let i = 0; i < myLength; i++) {
        totalPrice += (productQte[i].valueAsNumber * productPrices[productLocalStorage[i]._id]);
    } // total price = price times the product quantity

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;
    syncCart();
}

// form data
// regular expressions for validation
let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
let charAlphaRegExp = /^[A-Za-z -]{3,32}$/;
let addressRegExp = /^[A-Za-z0-9 ]{7,32}$/;

// getting access to form data in the DOM
let form = document.querySelector('.cart__order__form');
let firstName = document.getElementById('firstName');
let lastName = document.getElementById('lastName');
let address = document.getElementById('address');
let city = document.getElementById('city');
let email = document.getElementById('email');

let validFirstName = false;
let validLastName = false;
let validAddress = false;
let validCity = false;
let validEmail = false;

// form input event listeners and form data validation
 // first name change event and validation
firstName.addEventListener('change', checkFirstName);
let firstNameErrorMsg = document.getElementById('firstNameErrorMsg');
function checkFirstName() {
    if (charAlphaRegExp.test(firstName.value)) {
        firstNameErrorMsg.innerHTML = null;
        firstName.style.border = '2px solid green';
        validFirstName = true;
    } else if (charAlphaRegExp.test(firstName.value) === false || firstName.value === '') {
        firstNameErrorMsg.innerHTML = "Please enter a valid First Name";
        firstName.style.border = '2px solid red';
        validFirstName = false;
    }
};

// last name change event and validation
lastName.addEventListener('change', checkLastName);
let lastNameErrorMsg = document.getElementById('lastNameErrorMsg');
function checkLastName() {
    if (charAlphaRegExp.test(lastName.value)) {
        lastNameErrorMsg.innerHTML = null;
        lastName.style.border = '2px solid green';
        validLastName = true;
    } else if (charAlphaRegExp.test(lastName.value) === false || lastName.value === '') {
        lastNameErrorMsg.innerHTML = 'Please enter a valid last name';;
        lastName.style.border = '2px solid red';
        validLastName = false;
    }
};

// address change event and validation
address.addEventListener('change', checkAddress);
let addressErrorMsg = document.getElementById('addressErrorMsg');
function checkAddress() {
    if (addressRegExp.test(address.value)) {
        addressErrorMsg.innerHTML = null;
        address.style.border = '2px solid green';
        validAddress = true;
    } else if (addressRegExp.test(address.value) === false || address.value === '') {
        addressErrorMsg.innerHTML = 'Please enter a valid address';
        address.style.border = '2px solid red';
        validAddress = false;
    }
};

// city change event and validation
city.addEventListener('change', checkCity);
let cityErrorMsg = document.getElementById('cityErrorMsg');
function checkCity() {
    if (charAlphaRegExp.test(city.value)) {
        cityErrorMsg.innerHTML = null;
        city.style.border = '2px solid green';
        validCity = true;
    } else if (charAlphaRegExp.test(city.value) === false || city.value === '') {
        cityErrorMsg.innerHTML = 'Please enter a valid city';
        city.style.border = '2px solid red';
        validCity = false;
    }
};

//email change event and validation
email.addEventListener('change', checkEmail);
let emailErrorMsg = document.getElementById('emailErrorMsg');
function checkEmail() {
    if (emailRegExp.test(email.value)) {
        emailErrorMsg.innerHTML = null;
        email.style.border = '2px solid green';
        validEmail = true;
    } else if (emailRegExp.test(email.value) === false || email.value === '') {
        emailErrorMsg.innerHTML = 'Please enter a valid email address';
        email.style.border = '2px solid red';
        validEmail = false;
    }
};

// post form and gathering order data
function orderItem(event) {
    event.preventDefault();

    // contact object 
    let contact = {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    }

    // creation of product array, get items IDs
    const products = [];
    for (let i = 0; i < productLocalStorage.length; i++) {
        products.push(productLocalStorage[i]._id);
    }

    // collection of form data object
    const formData = {
        contact,
        products,
    }

    // header and stringified form object
    const orderData = {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
            'Content-type': 'application/json',
        }
    };

    // POST request
    if (validFirstName === true && validLastName === true && validAddress === true && validCity === true && validEmail === true) {
        fetch('http://localhost:3000/api/products/order', orderData)
            .then(response => response.json())
            .then((data) => {
                let confirmationUrl = './confirmation.html?id=' + data.orderId;

                localStorage.clear();
                window.location.href = confirmationUrl;
            })
            .catch(error => console.log(error));
    } else {
        alert('Please fill out the form properly');
    }



}



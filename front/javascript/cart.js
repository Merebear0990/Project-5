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




let productLocalStorage = JSON.parse(localStorage.getItem('cart'));

function syncCart() {
    let cartString = JSON.stringify(productLocalStorage);
    localStorage.setItem('cart', cartString);
}

const productPrices = {};
fetch('http://localhost:3000/api/products/')
    .then(response => response.json())
    .then(data => initialPrices(data))
    .then(() => {
        buildPage();
        getTotals();
    })
    .catch(error => console.log(error));

function initialPrices(array) {
    const length = array.length;
    for (let i = 0; i < length; i++) {
        productPrices[array[i]._id] = array[i].price;
    }
    console.log(productPrices);
}

function buildPage() {
    if (!productLocalStorage) {
        cart = [];
    } else {
        for (let i = 0; i < productLocalStorage.length; i++) {
            let productArticle = document.createElement('article');
            productArticle.classList.add('cart__item');
            productArticle.setAttribute('data-id', productLocalStorage[i]._id);
            productArticle.setAttribute('date-color', productLocalStorage[i].color);
            document.querySelector('#cart__items').appendChild(productArticle);

            let productDivImage = document.createElement('div');
            productDivImage.classList.add('cart__item__img');
            productArticle.appendChild(productDivImage);

            let productImage = document.createElement('img');
            productImage.src = productLocalStorage[i].imageUrl;
            productImage.alt = productLocalStorage[i].altTxt;
            productDivImage.appendChild(productImage);

            let productItemContent = document.createElement('div');
            productItemContent.classList.add('cart__item__content');
            productArticle.appendChild(productItemContent);

            let productItemContentDescription = document.createElement('div');
            productItemContentDescription.classList.add('cart__item__content__description');
            productItemContent.appendChild(productItemContentDescription);

            let productName = document.createElement('h2');
            productName.innerHTML = productLocalStorage[i].name;
            productItemContentDescription.appendChild(productName);

            let productColor = document.createElement('p');
            productColor.innerHTML = productLocalStorage[i].color;
            productItemContentDescription.appendChild(productColor);

            let productPrice = document.createElement('p');
            
            productPrice.innerHTML = '€' + productPrices[productLocalStorage[i]._id];
            productItemContentDescription.appendChild(productPrice);

            let productItemContentSettings = document.createElement('div');
            productItemContentSettings.classList.add('cart__item__content__settings');
            productItemContent.appendChild(productItemContentSettings);

            let productItemContentQuantity = document.createElement('div');
            productItemContentQuantity.classList.add('cart__item__content__settings__quantity');
            productItemContentSettings.appendChild(productItemContentQuantity);

            let productQuantityText = document.createElement('p');
            productQuantityText.innerHTML = 'Qté : ';
            productItemContentQuantity.appendChild(productQuantityText);

            let productQuantity = document.createElement('input');
            productQuantity.value = productLocalStorage[i].quantity;
            productQuantity.className = 'itemQuantity';
            productQuantity.setAttribute('type', 'number');
            productQuantity.setAttribute('min', '1');
            productQuantity.setAttribute('max', '100');
            productQuantity.setAttribute('name', 'itemQuantity');
            productItemContentQuantity.appendChild(productQuantity);
            productQuantity.addEventListener('click', updateQuantity);

            let productDelete = document.createElement('button');
            productDelete.setAttribute("type", "button");

            productDelete.className = 'deleteItem';
            productDelete.innerHTML = 'Delete';
            productItemContentSettings.appendChild(productDelete);
            productDelete.addEventListener('click', deleteItem);
        }

        const orderBtn = document.getElementById('order');
        orderBtn.addEventListener('click', orderItem);



    }
}

function deleteItem(event){

    console.log(event);
    const deleteBtn = event.target;
    const productCard = deleteBtn.parentElement.parentElement.parentElement.parentElement;
    const productId = productCard.dataset.id;
    const productColor = productCard.dataset.color
    productCard.remove();

    for (let i = productLocalStorage.length - 1; i >= 0; i--) {
        if (productId === productLocalStorage[i]._id && productColor === productLocalStorage[i].color){
            productLocalStorage.splice(i, 1);
        }
    }

    getTotals();
    syncCart();
}

function getTotals(){

    let productQte = document.getElementsByClassName('itemQuantity');
    let myLength = productQte.length;
    let totalQte = 0;

    for (let i=0; i < myLength; i++) {
        totalQte += productQte[i].valueAsNumber;
    }

    let productTotalQuantity = document.getElementById('totalQuantity');
    productTotalQuantity.innerHTML = totalQte;

    let totalPrice = 0;
      for (let i = 0; i < myLength; i++) {
        totalPrice += (productQte[i].valueAsNumber * productPrices[productLocalStorage[i]._id]);
      }

    let productTotalPrice = document.getElementById('totalPrice');
    productTotalPrice.innerHTML = totalPrice;
    syncCart();
}

let emailRegExp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; 
let charAlphaRegExp = /^[A-Za-z -]{3,32}$/;
let addressRegExp = /^[A-Za-z0-9 ]{7,32}$/; 

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

firstName.addEventListener('change', checkFirstName);
let firstNameErrorMessage = document.getElementById('firstNameErrorMessage');
function checkFirstName() {
    if (charAlphaRegExp.test(firstName.value)) {
        firstNameErrorMessage.innerHTML = null;
        firstName.style.border = '2px solid green';
        validFirstName = true;
    } else if (charAlphaRegExp.test(firstName.value) === false||firstName.value === '') {
        firstNameErrorMessage.innerHTML = "Please enter a valid First Name";
        firstName.style.border = '2px solid red';
        validFirstName = false;
    }
};

lastName.addEventListener('change', checkLastName);
let lastNameErrorMessage = document.getElementById('lastNameErrorMessage');
function checkLastName() {
    if (charAlphaRegExp.test(lastName.value)) {
        lastNameErrorMessage.innerHTML = null;
        lastName.style.border = '2px solid green';
        validLastName = false;
    }
};

address.addEventListener('change', checkAddress);
let addressErrorMessage = document.getElementById('addressErrorMessage');
function checkAddress() {
    if (addressRegExp.test(address.value)) {
        addressErrorMessage.innerHTML = null;
        address.style.border = '2px solid green';
        validAddress = true;
    } else if (addressRegExp.test(address.value) === false||address.value === ''){
        addressErrorMessage.innerHTML = 'Please enter a valid address';
        address.style.border = '2px solid red';
        validAddress = false;
    }
};

city.addEventListener('change', checkCity);
function checkCity() {
    if (charAlphaRegExp.test(city.value)) {
        cityErrorMessage.innerHTML = null;
        city.style.border = '2px solid green';
        validCity = true;
    } else if (charAlphaRegExp.test(city.value) === false||city.value === ''){
        cityErrorMessage.innerHTML = 'Please enter a valid city';
        city.style.border = '2px solid red';
        validCity = false;
    }
};

email.addEventListener
let emailErrorMessage = document.getElementById('emailErrorMessage');
function checkEmail() {
    if (emailRegExp.test(email.value)) {
        emailErrorMessage.innerHTML = null;
        email.style.border = '2px solid green';
        validEmail = true;
    } else if (emailRegExp.test(email.value) === false||email.value === '') {
        emailErrorMessage.innerHTML = 'Please enter a valid email address';
        email.style.border = '2px solid red';
        validEmail = false;
    }
};

function orderItem(event){
    event.preventDefault();

    // contact object 
    let contact = {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            city: city.value,
            email: email.value,
    }

   const products = [];
   for (let i = 0; i < productLocalStorage.length; i++) {
    products.push(productLocalStorage[i]._id);
   } 

   const formData = {
    contact,
    products,
   }

   const orderData = {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: {
        'Content-type': 'application/json',
    }
   };

   if (validFirstName === true && validLastName === true && validAddress === true && validCity === true && validEmail === true){
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

function updateQuantity() {
    // TODO...
}

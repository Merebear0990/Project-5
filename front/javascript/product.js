//returns the url of the current page
const _id = new URL(window.location.href).searchParams.get('id');
console.log(_id);

// set up the cart - 3 places local storage, array, and JSON
let cartString = localStorage.getItem('cart') || '[]'; // gets data from the cart or creates an empty array








let cartArray = JSON.parse(cartString);
// JSON.parse, takes the string data and parses it into a useable javascript object
// objects that represent each item are stored in an array so we can store multiple items under a single name

// object that represents the product
const product = {
    _id: '',
    name: '',
    imageUrl: '',
    altTxt: '',
    color: '',
    quantity: 1
}

// getting the item from the api with the ID of the current product
fetch("http://127.0.0.1:3000/api/products/" + _id)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        makeProductCard(data);
        initProdObject(data);
    })
    .catch(error => console.log(error));

function makeProductCard(productDetails) {
    // getting access to variables for DOM elements
    const prodImage = document.querySelector('.item__img');
    const productDescription = document.getElementById('description');
    const prodPrice = document.getElementById('price');
    const prodTitle = document.getElementById('title');
    const itemQuantity = document.getElementById('quantity');
    const addBtn = document.getElementById('addToCart');
    const prodColors = document.getElementById('colors');

    // add content to elements

    //image
    const itemImage = document.createElement('img');
    itemImage.setAttribute('src', productDetails.imageUrl);
    itemImage.setAttribute('alt', productDetails.altTxt);
    prodImage.appendChild(itemImage);

    // price, title, description
    prodPrice.innerHTML = productDetails.price;
    prodTitle.innerHTML = productDetails.name;
    productDescription.innerHTML = productDetails.description;

    // updating quantity event
    quantity.addEventListener('change', updateQuantity);
    //listener for a change event that will run the updateQuantity function

    // add to cart
    addBtn.addEventListener('click', addToCart);
    // listener for a click event that will run the addToCart function

    // color change pulldown
    for (let i = 0; i < productDetails.colors.length; i++) {
        const pulldown = document.createElement('option');
        pulldown.setAttribute('value', productDetails.colors[i]);
        pulldown.value = productDetails.colors[i];
        pulldown.innerHTML = productDetails.colors[i];
        prodColors.appendChild(pulldown);
        prodColors.addEventListener('change', updateColor);
    }
}

//update quantity function
function updateQuantity(event) {
    console.log(event.target, event.target.value)
    product.quantity = parseInt(event.target.value, 10); // parseInt(quantity, 10)
    console.log(product)
}

// update color function
function updateColor(event) {
    console.log(event.target, event.target.value)
    product.color = event.target.value;
    console.log(product)
}

// initialize product
function initProdObject(productDetails) {
    product._id = productDetails._id;
    product.name = productDetails.name;
    product.imageUrl = productDetails.imageUrl;
    product.altTxt = productDetails.altTxt;

}

// add to cart event and function
function addToCart(event) {
    let pushToCart = true; // indicates whether to put the item in the cart

    // is it empty?
    console.log(cartArray);
    if (cartArray.length > 0) {
        // iterates through each item in the cartArray to see if name and options matches current cart items
        for (let i = 0; i < cartArray.length; i++) {
            if (product._id === cartArray[i]._id &&
                product.color === cartArray[i].color) {
                //if already in cart don't push, do increase quantity
                cartArray[i].quantity = cartArray[i].quantity + product.quantity;
                //needs to be set to false because we don't want to push
                pushToCart = false;
                syncCart(); // calling the function syncCart
            }
        }
    }

    if (pushToCart) {
        cartArray.push(product);
        syncCart();
    }
}





function syncCart() {
    cartString = JSON.stringify(cartArray); // takes data and turns it into a JSON string
    localStorage.setItem('cart', cartString); // add the data to the cart localStorage
    cartArray = JSON.parse(cartString); // cartArray is the parsed version of the cartString object
}
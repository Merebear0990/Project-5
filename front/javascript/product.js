const _id = new URL(window.location.href).searchParams.get('id');
console.log(_id);


let cartString = localStorage.getItem('cart') || '[]';







let cartArray = JSON.parse(cartString);

const product = {
    _id: '',
    name: '',
    imageUrl: '',
    altTxt: '',
    color: '',
    quantity: 1
}

fetch("http://127.0.0.1:3000/api/products/" + _id)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        makeProductCard(data);
        initProdObject(data);
    })
    .catch(error => console.log(error));

function makeProductCard(productDetails) {
    const prodImage = document.querySelector('.item__img');
    const productDescription = document.getElementById('description');
    const prodPrice = document.getElementById('price');
    const prodTitle = document.getElementById('title');
    //TODO have Scott check this
    const itemQuantity = document.getElementById('quantity');
    const addBtn = document.getElementById('addToCart');
    const prodColors = document.getElementById('colors');

    const itemImage = document.createElement('img');
    itemImage.setAttribute('src', productDetails.imageUrl);
    itemImage.setAttribute('alt', productDetails.altTxt);
    prodImage.appendChild(itemImage);
    prodPrice.innerHTML = productDetails.price;
    prodTitle.innerHTML = productDetails.name;
    productDescription.innerHTML = productDetails.description;

    quantity.addEventListener('change', updateQuantity);

    addBtn.addEventListener('click', addToCart);

    for (let i = 0; i < productDetails.colors.length; i++) {
        const pulldown = document.createElement('option');
        pulldown.setAttribute('value', productDetails.colors[i]);
        pulldown.value = productDetails.colors[i];
        pulldown.innerHTML = productDetails.colors[i];
        prodColors.appendChild(pulldown);
        prodColors.addEventListener('change', updateColor);
    }
}

function updateQuantity(event) {
    console.log(event.target, event.target.value)
    product.quantity = parseInt(event.target.value, 10); // parseInt(quantity, 10)
    console.log(product)
}

function updateColor(event) {
    console.log(event.target, event.target.value)
    product.color = event.target.value;
    console.log(product)
}

function initProdObject(productDetails) {
    product._id = productDetails._id;
    product.name = productDetails.name;
    product.imageUrl = productDetails.imageUrl;
    product.altTxt = productDetails.altTxt;

}

function addToCart(event) {
    let pushToCart = true;

    console.log(cartArray);
    if (cartArray.length > 0) {

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
    cartString = JSON.stringify(cartArray);
    localStorage.setItem('cart', cartString); // add the data to the cart localStorage
    cartArray = JSON.parse(cartString); // cartArray is the parsed version of the cartString object
}
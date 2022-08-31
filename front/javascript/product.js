const _id = new URL(window.location.href).searchParams.get('id');
console.log(_id);


let cartString = localStorage.getItem('cart') || '[]';







let cartArray = JSON.parse(cartString);

const productObject = {
    _id: '',
    name: '',
    imageURL: '',
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

function makeProductCard(obj) {
    const prodImg = document.querySelector('.item_img');
    const productDescription = document.getElementById('descritption');
    const prodPrice = document.getElementById('price');
    const prodTitle = document.getElementById('title');
    const prodQuantity = document.getElementById('quantity');
    const addBtn = document.getElementById('addToCart');
    const prodColors = document.getElementById('colors');

    const itemImg = document.createElement('img');
    itemImg.setAttribute('src', obj.imageURL);
    itemImg.setAttribute('alt', obj.altTxt);
    prodImg.appendChild(itemImg);

    prodPrice.innerHTML = obj.price;
    prodTitle.innerHTML = obj.name;
    productDescription.innerHTML = obj.description;

    quantity.addEventListener('change', updateQuantity);

    addBtn.addEventListener('click', addToCart);

    for (let i = 0; i < obj.colors.length; i++) {
        const pulldown = document.createElement('option');
        pulldown.setAttribute('value', obj.colors[i]);
        pulldown.value = obj.colors[i];
        pulldown.innerHTML = obj.colors[i];
        prodColors.appendChild(pulldown);
        prodColors.addEventListener('change', updateColor);
    }
}

function updateQuantity(event) {
    console.log(event.target, event.target.value)
    productObject.quantity = event.target.value;
    console.log(productObject)
}

function updateColor(event) {
    console.log(event.target, event.target.value)
    productObject.color = event.target.value;
    console.log(productObject)
}

function initProdObject(object) {
    productObject._id = object._id;
    productObject.name = object.name;
    productObject.imageURL = object.imageURL;
    productObject.altTxt = object.altTxt;

}

function addToCart(event) {
    let pushToCart = true;
}

console.log(cartArray);
if (cartArray.length > 0) {

    for (let i = 0; i < cartArray.length; i++) {
        if (productObject.name === cartArray[i].name &&
            productObject.color === cartArray[i].color) {

            cartArray[i].quantity = cartArray[i].quantity + productObject.quantity;

            pushToCart = false;
            syncCart();
        }
    }
}

if (pushToCart) {
    cartArray.push(productObject);
    syncCart();
}

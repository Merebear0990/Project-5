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
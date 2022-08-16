// Meredith  - read through this article. It walks you through an example similar to this!
// https://www.digitalocean.com/community/tutorials/how-to-use-the-javascript-fetch-api-to-get-data

/*
 * Get all products
 */
fetch("http://127.0.0.1:3000/api/products")
  .then(function (resp) {
    return resp.json();
  }).then(function (data) {
    data.forEach(function (item) {
      // console.debug(item);

      var articleElement = document.createElement('article');

      // This is lazy, but it will work for now. "JQuery" helps with this dynamic HTML code creation
      articleElement.innerHTML =
        `<img src="${item.imageUrl}" alt="${item.altTxt}">
         <h3 class="productName">${item.name}</h3>
         <p class="productDescription">${item.description}</p>`;

      /* What the code above is supposed to generate:
        <article>
          <img src=".../product01.jpg" alt="Lorem ipsum dolor sit amet, Kanap name1">
          <h3 class="productName">Kanap name1</h3>
          <p class="productDescription">Dis enim malesuada risus sapien gravida nulla nisl arcu. Dis enim malesuada risus sapien gravida nulla nisl arcu.</p>
        </article>
      */

      // Grab the "Items" part of the page by using the HTML element ID
      var itemsSection = document.getElementById("items");

      // Append the article element we just created abolve to the items secdtion
      itemsSection.appendChild(articleElement);


    });
  }).catch(function (err) {
    alert("There was an error - is your API server running?")
    console.debug(`"${err}"`)
  });
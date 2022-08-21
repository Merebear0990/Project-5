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
    console.debug(item);

  

      let articleElement = document.createElement('article');
      let anchor = document.createElement('a');
      
      

      articleElement.innerHTML =
        `<img src="${item.imageUrl}" alt="${item.altTxt}">
         <h3 class="productName">${item.name}</h3>
         <p class="productDescription">${item.description}</p>`;

      

     
      var itemsSection = document.getElementById("items");

      // Append the article element we just created abolve to the items secdtion
      itemsSection.appendChild(articleElement);


    });
  }).catch(function (err) {
    alert("There was an error - is your API server running?")
    console.debug(`"${err}"`)
  });
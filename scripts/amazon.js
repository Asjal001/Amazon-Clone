import { cart } from '../data/cart.js';
import { products,loadProducts } from '../data/products.js';

loadProducts(renderProductsGrid);
function renderProductsGrid() 
{
  updateCartQuantity();
  //generating HTML with JS
  let HTML='';
  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  // filter the products that match the search.
  if (search) {
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if (keyword.toLowerCase().includes(search.toLowerCase())) {
          matchingKeyword = true;
        }
      });

      return matchingKeyword || product.name.includes(search);
    });
  }

    filteredProducts.forEach((products)=>{
    HTML+=`
      <div class="product-container">
        <div class="product-image-container">
          <img class="product-image"
            src='${products.image}'>
        </div>
        <div class="product-name limit-text-to-2-lines">
          ${products.name}
        </div>
        <div class="product-rating-container">
          <img class="product-rating-stars"
            src="images/ratings/rating-${products.getStarUrl()}.png">
          <div class="product-rating-count link-primary">
            ${products.rating.count}
          </div>
        </div>
        <div class="product-price">
          ${products.getPrice()}
        </div>
        <div class="product-quantity-container">
            <select class="js-quantity-selector-${products.id}">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>
          ${products.extraInfoHTML()}
          <div class="product-spacer"></div>

          <div class="added-to-cart js-added-${products.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${products.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  });
  //cart quantity funtionality
  function updateCartQuantity()
  {
    document.querySelector('.cart-quantity').innerHTML=cart.calculateCartQuantity();
  }
  document.querySelector('.js-products-grid').innerHTML=HTML;
  //add to cart button funtionality
  const timeouts = {};
  document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
    button.addEventListener('click',()=>{
      const productId=button.dataset.productId;
      cart.addToCart(productId);
      updateCartQuantity();
      //Added text dissapearing after 2 sec functionality
      const addedElement = document.querySelector(`.js-added-${productId}`);
      addedElement.classList.add('js-added');
      // Clear any existing timeout for this product
      if (timeouts[productId]) {
        clearTimeout(timeouts[productId]);
      }
      // Set a new timeout and store its ID
      timeouts[productId] = setTimeout(() => {
        addedElement.classList.remove('js-added');
      }, 2000);
    });
  });
  document.querySelector('.js-search-button')
    .addEventListener('click', () => {
      const search = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${search}`;
    });
    // Extra feature: searching by pressing "Enter" on the keyboard.
  document.querySelector('.js-search-bar')
  .addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const searchTerm = document.querySelector('.js-search-bar').value;
      window.location.href = `amazon.html?search=${searchTerm}`;
    }
  });
}
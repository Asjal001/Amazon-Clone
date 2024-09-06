import { cart, addToCart } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from "../utilis/money.js";
//generating HTML with JS
let HTML='';
products.forEach((products)=>{
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
          src="images/ratings/rating-${products.rating.stars*10}.png">
        <div class="product-rating-count link-primary">
          ${products.rating.count}
        </div>
      </div>
      <div class="product-price">
        $${formatCurrency(products.priceCents)}}
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
  let totalQuantity=0;
  cart.forEach((cartItem)=>{
    totalQuantity+=cartItem.quantity;
  });
  document.querySelector('.cart-quantity').innerHTML=totalQuantity;
}
document.querySelector('.js-products-grid').innerHTML=HTML;
//add to cart button funtionality
const timeouts = {};
document.querySelectorAll('.js-add-to-cart').forEach((button)=>{
  button.addEventListener('click',()=>{
    const productId=button.dataset.productId;
    addToCart(productId);
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
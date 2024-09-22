import { cart } from "../data/cart.js";
import { orders } from "../data/order.js";
import { formatCurrency } from "../utilis/money.js";
import { getProduct,loadProductsFetch } from "../data/products.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

updateCartQuantity();

console.log(orders);
function updateCartQuantity()
{
  document.querySelector('.cart-quantity').innerHTML=cart.calculateCartQuantity();
}

async function displayOrder(order)
{
  try
  {
    await loadProductsFetch();
  }
  catch (error)
  {
    console.log('Unexpected error. Try again later.')
  }
  let HTML='';
  order.products.forEach((product)=>{
    const productId=product.productId;
    const matchingProduct=getProduct(productId);
    HTML+=`
      <div class="product-image-container">
        <img src='${matchingProduct.image}'>
      </div>

      <div class="product-details">
        <div class="product-name">
          ${matchingProduct.name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${dayjs(product.estimatedDeliveryTime).format('MMMM D')}
        </div>
        <div class="product-quantity">
          Quantity: ${product.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html?
        orderId=123&
        productId=456">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `
  });
  return HTML;
}

async function renderOrders() {
  let HTML='';

  for (const order of orders) {

    HTML+=`
      <div class="order-container">

        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${dayjs(order.orderTime).format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${formatCurrency(order.totalCostCents)}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>

        <div class="order-details-grid">${await displayOrder(order)}</div>
      </div>
    `;
  }

  document.querySelector('.orders-grid').innerHTML=HTML;
}
renderOrders();
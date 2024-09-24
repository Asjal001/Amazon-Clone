import { orders } from "../data/order.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { getProduct,loadProductsFetch } from "../data/products.js";
import { cart } from "../data/cart.js";


updateCartQuantity();
function updateCartQuantity()
{
  document.querySelector('.cart-quantity').innerHTML=cart.calculateCartQuantity();
}
async function trackOrder()
{
  await loadProductsFetch();
  const url=new URL(window.location.href);
  const orderId=url.searchParams.get('orderId');
  const productId=url.searchParams.get('productId');
  let product;
  let order;
  orders.forEach((element) => {
    if (element.id === orderId)
    {
      order = element;
    }
  });
  order.products.forEach((element) => {
    if (element.productId === productId)
    {
      product = element;
    }
  });
  const today = dayjs();
  const orderTime = dayjs(order.orderTime);
  const deliveryTime = dayjs(product.estimatedDeliveryTime);
  const percentProgress = ((today - orderTime) / (deliveryTime - orderTime)) * 100;
  const matchingProduct=getProduct(productId);
  const deliveredMessage = today < deliveryTime ? 'Arriving on' : 'Delivered on';
  const HTML=`
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        ${deliveredMessage} ${dayjs(product.estimatedDeliveryTime).format('MMMM D')}
      </div>

      <div class="product-info">
        ${matchingProduct.name}
      </div>

      <div class="product-info">
        Quantity: ${product.quantity}
      </div>

      <img class="product-image" src='${matchingProduct.image}'>

      <div class="progress-labels-container">
        <div class="progress-label ${percentProgress < 50 ? 'current-status' : ''}">
          Preparing
        </div>
        <div class="progress-label ${(percentProgress >= 50 && percentProgress < 100) ? 'current-status' : ''}">
          Shipped
        </div>
        <div class="progress-label ${percentProgress >= 100 ? 'current-status' : ''}">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" style="width: ${percentProgress}%;"></div>
      </div>
    </div>`;

  document.querySelector('.main').innerHTML = HTML;
}
trackOrder();
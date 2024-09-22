import { cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../../utilis/money.js";
import { addOrder } from "../../data/order.js";
export function renderPaymentSummary() 
{
  let productCost=0;
  let deliveryCost=0;
  cart.cartItem.forEach((cartItem) => {
    const product=getProduct(cartItem.productId);
    productCost+=cartItem.quantity*(product.priceCents);
    const deliveryOption=getDeliveryOption(cartItem.deliveryOptionId);
    deliveryCost+=deliveryOption.priceCents;
  });
  const totalCostWithoutTax=productCost+deliveryCost;
  const tax=totalCostWithoutTax*0.1;
  const totalCost=totalCostWithoutTax+tax;
  const PaymentHtml=`
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${cart.calculateCartQuantity()}):</div>
      <div class="payment-summary-money">$${formatCurrency(productCost)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurrency(deliveryCost)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCostWithoutTax)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurrency(tax)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${formatCurrency(totalCost)}</div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
    <script type="module" src="scripts/checkout.js"></script>
  `;
  document.querySelector('.payment-summary').innerHTML=PaymentHtml;
  document.querySelector('.js-place-order').addEventListener('click',async ()=>{
    try
    {
      const response=await fetch('https://supersimplebackend.dev/orders',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart.cartItem
        })
      });
      const order=await response.json();
      addOrder(order);
    }
    catch(error)
    {
      console.log('Error placing order. Please try again later.');
    }  

    window.location.href = 'orders.html';
  });
}
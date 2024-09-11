import { calculateCartQuantity, cart } from "../../data/cart.js";
import { getProduct } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../../utilis/money.js";
export function renderPaymentSummary() 
{
  let productCost=0;
  let deliveryCost=0;
  cart.forEach((cartItem) => {
    const product=getProduct(cartItem.productId);
    productCost+=cartItem.quantity*(product.priceCents);
    const deliveryOption=getDeliveryOption(cartItem.deliveryOptionId);
    deliveryCost+=deliveryOption.priceCents;
  });
  const totalCostWithoutTax=productCost+deliveryCost;
  const tax=totalCostWithoutTax*0.1;
  const totalCost=totalCostWithoutTax+tax;
  const PaymentHtnl=`
    <div class="payment-summary">
      <div class="payment-summary-title">
        Order Summary
      </div>

      <div class="payment-summary-row">
        <div>Items (${calculateCartQuantity()}):</div>
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

      <button class="place-order-button button-primary">
        Place your order
      </button>
      <script type="module" src="scripts/checkout.js"></script>
    </div>
  `;
  document.querySelector('.payment-summary').innerHTML=PaymentHtnl;
}
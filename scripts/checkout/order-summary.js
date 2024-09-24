import { cart } from "../../data/cart.js";
import { getProduct  } from "../../data/products.js";
import { formatCurrency } from "../../utilis/money.js";
import { calculateDeliveryDate, getDeliveryOption,deliveryOptions } from "../../data/deliveryOptions.js";
import { renderPaymentSummary , placeOrder } from "./payment-summary.js";

function updateCartQuantity()
{
  document.querySelector('.return-to-home-link').innerHTML= `Items: ${cart.calculateCartQuantity()}`;
}
export function renderOrderSummary()
{
  updateCartQuantity();
  //generating html for checkout page
  let cartHTML='';
  cart.cartItem.forEach((cartItem)=>{
    const productId=cartItem.productId;
    const matchingProduct=getProduct(productId);
    const deliveryOptionId=cartItem.deliveryOptionId;
    const deliveryOption=getDeliveryOption(deliveryOptionId);
    const dateString=calculateDeliveryDate(deliveryOption);
    cartHTML+=`
    <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: ${dateString}
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src='${matchingProduct.image}'>

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity
          js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update"  data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input type="number" class="updateInput js-update-input-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
            <span class="saveQuantityLink link-primary" data-product-id="${matchingProduct.id}">Save</span>
            <span class="delete-quantity-link link-primary js-delete js-delete-link-${matchingProduct.id}" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>
        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHtml(cartItem)}
        </div>
      </div>
      <button class="place-order-button button-primary js-place-order-2">Place your order</button>
    </div>
    `;
  });

  function deliveryOptionsHtml(cartItem)
  {
    let DeliveryHtml='';
    deliveryOptions.forEach((deliveryOption)=>
    {
      const dateString=calculateDeliveryDate(deliveryOption);
      const priceString=deliveryOption.priceCents===0
      ?'Free'
      :`$${formatCurrency(deliveryOption.priceCents)} -`;
      const isChecked=deliveryOption.id===cartItem.deliveryOptionId;
      DeliveryHtml+=`
      <div class="delivery-option js-delivery-option" data-product-id="${cartItem.productId}" data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
        ${isChecked ? 'checked':''}
          class="delivery-option-input"
          name="delivery-option-${cartItem.productId}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
      `
    });
    return DeliveryHtml;
  }
  document.querySelector('.order-summary').innerHTML=cartHTML;
  document.querySelector('.js-place-order-2').addEventListener('click',async ()=>{placeOrder();});
  //delete button functionality
  document.querySelectorAll('.js-delete').forEach((link)=>{
    link.addEventListener('click',()=>
    {
      const productId=link.dataset.productId;
      cart.removeFromCart(productId);
      // const container=document.querySelector(`.js-cart-item-container-${productId}`);
      // container.remove();
      // updateCartQuantity();
      renderOrderSummary();
      renderPaymentSummary();
    });
  }); 
  //update button functionality
  document.querySelectorAll('.js-update').forEach((link)=>{
    link.addEventListener('click',()=>
    {
      const productId=link.dataset.productId;
      const container=document.querySelector(`.js-cart-item-container-${productId}`);
      container.classList.add('is-editing-quantity');
    });
  }); 

  //save button functionality
  document.querySelectorAll('.saveQuantityLink').forEach((link)=>{
    link.addEventListener('click',()=>
    {
      const productId=link.dataset.productId;
      updateAndSave(productId);
    });
  });

  document.querySelectorAll('.updateInput').forEach((link)=>{
    link.addEventListener('keydown',(event)=>
    {
      if(event.key==='Enter')
      {
        const productId=link.dataset.productId;
        updateAndSave(productId);
      }
    });
  });
  function updateAndSave(productId)
  {
    const container=document.querySelector(`.js-cart-item-container-${productId}`);
    let newQuantity=document.querySelector(`.js-update-input-${productId}`).value;
    newQuantity=Number(newQuantity);
    if(newQuantity>0 && newQuantity<1000)
    {
      document.querySelector(`.quantity-label-${productId}`).innerHTML=newQuantity;
      cart.cartItem.forEach((cartItem)=>{
        if(cartItem.productId===productId)
        {
          cartItem.quantity=newQuantity;
        }
      });
      cart.saveToLocal();
      updateCartQuantity();
    } 
    container.classList.remove('is-editing-quantity');
    renderPaymentSummary();
  }
  document.querySelectorAll('.js-delivery-option').forEach((element)=>
  {
    element.addEventListener('click',()=>
    {
      const {productId,deliveryOptionId}=element.dataset;
      cart.updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    })
  });
}

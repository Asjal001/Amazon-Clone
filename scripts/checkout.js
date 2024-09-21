import { renderOrderSummary } from "./checkout/order-summary.js";
import { renderPaymentSummary } from "./checkout/payment-summary.js";
//import '../data/backend-practice.js';
import { loadProducts } from '../data/products.js';

//creating first promise
new Promise((resolve) => {
  loadProducts(()=>{
    resolve();
  });
}).then(() => {
  renderOrderSummary();
  renderPaymentSummary();
});

// loadProducts(()=>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });
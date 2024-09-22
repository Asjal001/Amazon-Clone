import { renderOrderSummary } from "./checkout/order-summary.js";
import { renderPaymentSummary } from "./checkout/payment-summary.js";
//import '../data/backend-practice.js';
import { loadProducts,loadProductsFetch } from '../data/products.js';

//async await
async function loadPages() 
{
  await loadProductsFetch();
  renderOrderSummary();
  renderPaymentSummary();
}
loadPages();

//promise and fetch
// loadProductsFetch().then(() => {
//   renderOrderSummary();
//   renderPaymentSummary();
// });

//callback
// loadProducts(()=>{
//   renderOrderSummary();
//   renderPaymentSummary();
// });
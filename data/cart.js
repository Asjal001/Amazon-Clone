export let cart=JSON.parse(localStorage.getItem('cart'))||[
  {
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 2
  },
  {
    productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
    quantity: 1
  }
];
function saveToLocal()
{
  localStorage.setItem('cart',JSON.stringify(cart));
}
export function addToCart(productId)
{
  let alreadyInCart;
  let dropdownQuantity=document.querySelector(`.js-quantity-selector-${productId}`).value;
  dropdownQuantity=Number(dropdownQuantity);
  cart.forEach((cartItem)=>{
    if(productId===cartItem.productId)
    {
      alreadyInCart=cartItem;
    }
  });
  if(alreadyInCart){
    alreadyInCart.quantity += dropdownQuantity;
  }
  else{
    cart.push({
      productId: productId,
      quantity: dropdownQuantity
    });
  }
  saveToLocal();
}

export function removeFromCart(productId)
{
  const newCart=[];
  cart.forEach((cartItem)=>{
    if(cartItem.productId!==productId)
    {
      newCart.push(cartItem);
    }
  });
  cart=newCart;
  saveToLocal();
}
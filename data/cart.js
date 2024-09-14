class Cart
{
  cartItem;
  #localStorageId;
  constructor(localStorageId)
  {
    this.#localStorageId=localStorageId;
    this.loadFromStorage();
  }
  loadFromStorage() 
  {
    this.cartItem=JSON.parse(localStorage.getItem(this.#localStorageId))||[
      {
        productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
        quantity: 2,
        deliveryOptionId: '1'
      },
      {
        productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
        quantity: 1,
        deliveryOptionId: '2'
      }
    ];
  }
  calculateCartQuantity()
  {
    let totalQuantity=0;
    this.cartItem.forEach((cartItem)=>{
    totalQuantity+=cartItem.quantity;
    });
    return totalQuantity;
  }
  saveToLocal()
  {
    localStorage.setItem(this.#localStorageId,JSON.stringify(this.cartItem));
  }
  addToCart(productId)
  {
    let matchingItem;
    let dropdownQuantity=document.querySelector(`.js-quantity-selector-${productId}`).value;
    dropdownQuantity=Number(dropdownQuantity);
    this.cartItem.forEach((cartItem)=>{
      if(productId===cartItem.productId)
      {
        matchingItem=cartItem;
      }
    });

    if(matchingItem){
      matchingItem.quantity += dropdownQuantity;
    }
    else{
      this.cartItem.push({
        productId: productId,
        quantity: dropdownQuantity,
        deliveryOptionId: '1'
      });
    }
    this.saveToLocal();
  }

  removeFromCart(productId)
  {
    const newCart=[];
    this.cartItem.forEach((cartItem)=>{
      if(cartItem.productId!==productId)
      {
        newCart.push(cartItem);
      }
    });
    this.cartItem=newCart;
    this.saveToLocal();
  }

  updateDeliveryOption(productId,deliveryOptionId)
  {
    let matchingItem; 
    this.cartItem.forEach((cartItem)=>{
      if(productId===cartItem.productId)
      {
        matchingItem=cartItem;
      }
    });
    matchingItem.deliveryOptionId=deliveryOptionId;
    this.saveToLocal();
  }
}


export let cart=new Cart('cart');
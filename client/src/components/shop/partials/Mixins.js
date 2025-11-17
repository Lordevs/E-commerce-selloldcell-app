export const subTotal = (id, price) => {
  let subTotalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      subTotalCost = item.quantitiy * price;
    }
  });
  return subTotalCost;
};

export const quantity = (id) => {
  let product = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    if (item.id === id) {
      product = item.quantitiy;
    }
  });
  return product;
};

export const totalCost = () => {
  let totalCost = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  carts.forEach((item) => {
    totalCost += item.quantitiy * item.price;
  });
  return totalCost;
};

export const calculateDeliveryCharges = (products) => {
  if (!products || products.length === 0) return 0;
  let totalDeliveryCharges = 0;
  let carts = JSON.parse(localStorage.getItem("cart"));
  
  products.forEach((product) => {
    const cartItem = carts.find((item) => item.id === product._id);
    if (cartItem && product.pDeliveryCharges) {
      totalDeliveryCharges += product.pDeliveryCharges * cartItem.quantitiy;
    }
  });
  
  return totalDeliveryCharges;
};
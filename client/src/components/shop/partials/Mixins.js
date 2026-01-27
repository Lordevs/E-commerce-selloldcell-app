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

export const calculateDeliveryCharges = (products, settings) => {
  if (!products || products.length === 0 || !settings) return 0;

  let baseDeliveryCharge = parseFloat(settings.baseDeliveryCharge) || 0;
  let extraItemCharge = parseFloat(settings.extraItemCharge) || 0;

  let totalQuantity = 0;
  let carts = JSON.parse(localStorage.getItem("cart")) || [];

  products.forEach((product) => {
    const cartItem = carts.find((item) => item.id === product._id);
    if (cartItem) {
      totalQuantity += cartItem.quantitiy;
    }
  });

  if (totalQuantity === 0) return 0;

  // Base charge for the first item + extra charge for each additional item
  let totalDeliveryCharges = baseDeliveryCharge + (totalQuantity - 1) * extraItemCharge;

  return totalDeliveryCharges;
};

export const calculateTaxes = (subtotal, settings) => {
  if (!settings || !settings.taxes || settings.taxes.length === 0) return [];

  return settings.taxes.map(tax => ({
    label: tax.label,
    amount: (subtotal * (tax.percentage / 100))
  }));
};

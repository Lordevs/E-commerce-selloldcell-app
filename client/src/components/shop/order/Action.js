import { createOrder } from "./FetchApi";

export const fetchData = async (cartListProduct, dispatch) => {
  dispatch({ type: "loading", payload: true });
  try {
    let responseData = await cartListProduct();
    if (responseData && responseData.Products) {
      setTimeout(function () {
        dispatch({ type: "cartProduct", payload: responseData.Products });
        dispatch({ type: "loading", payload: false });
      }, 1000);
    }
  } catch (error) {
    console.log(error);
  }
};

export const pay = async (
  data,
  dispatch,
  state,
  setState,
  totalCost,
  calculateDeliveryCharges,
  history
) => {
  if (!state.address) {
    setState({ ...state, error: "Please provide your address" });
  } else if (!state.phone) {
    setState({ ...state, error: "Please provide your phone number" });
  } else {
    dispatch({ type: "loading", payload: true });
    
    const subtotal = totalCost();
    const deliveryCharges = calculateDeliveryCharges(data.cartProduct);
    const totalAmount = subtotal + deliveryCharges;
    
    // Generate a unique transaction ID for cash on delivery
    const transactionId = "COD_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    
    let orderData = {
      allProduct: JSON.parse(localStorage.getItem("cart")),
      user: JSON.parse(localStorage.getItem("jwt")).user._id,
      amount: totalAmount,
      transactionId: transactionId,
      address: state.address,
      phone: state.phone,
      paymentMethod: "Cash on Delivery",
    };
    
    try {
      let responseData = await createOrder(orderData);
      if (responseData.success) {
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch({ type: "cartProduct", payload: null });
        dispatch({ type: "cartTotalCost", payload: null });
        dispatch({ type: "orderSuccess", payload: true });
        dispatch({ type: "loading", payload: false });
        return history.push("/");
      } else if (responseData.error) {
        setState({ ...state, error: responseData.error });
        dispatch({ type: "loading", payload: false });
      }
    } catch (error) {
      console.log(error);
      setState({ ...state, error: "Failed to place order. Please try again." });
      dispatch({ type: "loading", payload: false });
    }
  }
};

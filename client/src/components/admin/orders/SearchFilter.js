import React, { Fragment, useContext, useState, useEffect } from "react";
import { OrderContext } from "./index";
import { getAllOrder } from "./FetchApi";

const SearchFilter = (props) => {
  const { data, dispatch } = useContext(OrderContext);
  const [search, setSearch] = useState("");
  const [productArray, setPa] = useState(null);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      setPa(responseData.Orders);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (search) {
        // Filter from the originally fetched data or fresh fetch?
        // Using fresh fetch to be safe and consistent with other filters
        filterOrders(search);
      } else {
        // If search is empty, restore original list (or fetch fresh)
        // We'll fetch fresh to be safe
        dispatchFetchAll();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const filterOrders = async (term) => {
    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      let newData = responseData.Orders.filter((item) => {
        return (
          (item.transactionId &&
            item.transactionId.toLowerCase().includes(term.toLowerCase())) ||
          (item._id && item._id.toLowerCase().includes(term.toLowerCase()))
        );
      });
      dispatch({ type: "fetchOrderAndChangeState", payload: newData });
    }
  };

  const dispatchFetchAll = async () => {
    let responseData = await getAllOrder();
    if (responseData && responseData.Orders) {
      dispatch({
        type: "fetchOrderAndChangeState",
        payload: responseData.Orders,
      });
    }
  };

  return (
    <Fragment>
      <div className="rounded-full flex items-center justify-between overflow-hidden">
        <span style={{ background: "#303031" }} className="py-2 px-3">
          <svg
            className="rounded-l-full w-6 h-6 text-gray-100"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Transaction id..."
          className="py-2 px-2 focus:outline-none rounded-r-full border-1 border-gray-500 w-full"
          type="text"
        />
      </div>
    </Fragment>
  );
};
export default SearchFilter;

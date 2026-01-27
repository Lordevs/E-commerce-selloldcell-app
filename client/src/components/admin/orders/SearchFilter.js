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
    <Fragment>
      <div className="flex items-center space-x-2 bg-white border border-gray-100 rounded-2xl px-4 py-4 shadow-lg hover:shadow-xl transition-all w-full md:w-80 group/search">
        <svg
          className="w-5 h-5 text-gray-300 group-hover/search:text-emerald-500 transition-colors"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="SEARCH TRANSACTION ID..."
          className="bg-transparent border-none text-xs font-bold text-gray-700 placeholder-gray-300 uppercase tracking-widest w-full focus:outline-none focus:ring-0"
          type="text"
        />
      </div>
    </Fragment>
    </Fragment>
  );
};
export default SearchFilter;

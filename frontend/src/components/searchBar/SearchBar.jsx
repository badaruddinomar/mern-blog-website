import { useCallback, useEffect, useState } from "react";
// import { backendUrl } from "../helper";
import "./searchBar.css";
import { useDispatch } from "react-redux";

const SearchBar = () => {
  const dispatch = useDispatch();
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchData, setSearchData] = useState("");
  const [loading, setLoading] = useState(false);
  const [datafound, setDatafound] = useState(true);

  const searchDataChangeHandler = (event) => {
    setSearchData(event.target.value);

    // event.target.addEventListener("keydown", (e) => {
    //   if (e.key === "Enter") {
    //     searchHandler();
    //   }
    // });
  };
  useEffect(() => {
    dispatch({
      type: "searchPosts",
      payload: searchedPosts,
    });
  }, [dispatch, searchedPosts]);

  const searchHandler = useCallback(async () => {
    if (searchData === "") return;

    setLoading(true);
    const response = await fetch(`/search?search=${searchData}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    setSearchedPosts(data?.data);

    if (response.ok) setLoading(false);
    if (data.data?.length === 0) {
      setDatafound(false);
    } else {
      setDatafound(true);
    }
  }, [searchData]);

  useEffect(() => {
    searchHandler();
  }, [searchHandler]);

  return (
    <>
      <div className="search-bar flex-row">
        <div className="search-container">
          <label htmlFor="searchBar"></label>
          <input
            type="text"
            id="searchBar"
            placeholder="search"
            value={searchData}
            onChange={searchDataChangeHandler}
            autoComplete="true"
          />

          <button className="search-btn opacity-hover" onClick={searchHandler}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </button>
        </div>
      </div>

      {!datafound && <p className="nothing-text">Nothing found!</p>}

      {loading && <p className="loading-text">Searching...</p>}
    </>
  );
};

export default SearchBar;

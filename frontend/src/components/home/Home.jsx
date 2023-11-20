import { useEffect, useState } from "react";
// import { backendUrl } from "./../helper";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import SearchBar from "../searchBar/SearchBar";
import Posts from "../posts/Posts";

const Home = () => {
  const [postData, setPostData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchHandler = async () => {
      setLoading(true);
      const response = await fetch(`/post`, {
        credentials: "include",
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();
      setPostData(data?.data);
      if (response?.ok) return setLoading(false);
    };
    fetchHandler();
  }, []);

  return (
    <>
      {loading ? (
        <div className="spinner-div">
          <ClipLoader className="spinner" color="white" />
        </div>
      ) : (
        <>
          <Link to={"/searchTerm"}>
            <SearchBar />
          </Link>

          <Posts postData={postData} />
        </>
      )}
    </>
  );
};

export default Home;

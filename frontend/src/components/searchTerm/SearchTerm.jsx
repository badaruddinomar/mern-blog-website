import { useSelector } from "react-redux";
import SearchBar from "../searchBar/searchBar";
import Posts from "../posts/Posts";

const SearchTearm = () => {
  const { sPosts } = useSelector((state) => state.custom);
  return (
    <>
      <SearchBar />
      <Posts postData={sPosts} />
    </>
  );
};

export default SearchTearm;

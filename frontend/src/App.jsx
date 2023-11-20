import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Login from "./components/login/Login";
import Register from "./components/register/Register";
import CreatePost from "./components/createPost/CreatePost";
import Home from "./components/home/Home";
import SinglePost from "./components/singlePost/SinglePost";
import EditPost from "./components/editPost/EditPost";
import UserDetail from "./components/userDetail/UserDetail";
import UserProfile from "./components/userProfile/UserProfile";
import SearchTerm from "./components/searchTerm/SearchTerm";
Layout;

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/single-post/:id" element={<SinglePost />} />
            <Route path="/edit-post/:id" element={<EditPost />} />
            <Route path="/user-details/:id" element={<UserDetail />} />
            <Route path="/user-profile/:id" element={<UserProfile />} />
            <Route path="/searchTerm" element={<SearchTerm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

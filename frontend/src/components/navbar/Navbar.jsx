import { Link } from "react-router-dom";
import "./navbar.css";
// import { backendUrl } from "../helper";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import Toast from "../toast/Toast";
import avatar from "./../../images/avatar.png";

const Navbar = () => {
  const { loggedIn } = useSelector((state) => state.custom);
  const [userData, setUserData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [menuClicked, setMenuClicked] = useState(false);
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");
  const dispatch = useDispatch();

  const menuClikedHandler = () => {
    setMenuClicked(!menuClicked);
  };

  const notLoggedIn = () => {
    dispatch({
      type: "notLoggedIn",
      payload: undefined,
    });
  };

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`/profile`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      setUserData(data);

      const isLoggedIn = (userData) => {
        dispatch({
          type: "isLoggedIn",
          payload: userData,
        });
      };
      if (response.ok) {
        isLoggedIn(data);
      }
    };

    fetchHandler();
  }, [dispatch, loggedIn]);

  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`/user-details/${userData?.id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setUserInfo(data);
    };

    fetchHandler();
  }, [userData]);

  const logOutHandler = async () => {
    const response = await fetch(`/logout`, {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const result = await response.json();

    if (response.ok) {
      notLoggedIn();
    }

    if (response.ok) {
      setSuccess(true);
      setToastMessage(result.message);
      setTimeout(() => {
        setSuccess(false);
      }, 1500);
    } else {
      setToastMessage(result.message);
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 1500);
    }
  };
  return (
    <>
      {error && (
        <Toast
          classes="error"
          iconClass="fa-solid fa-circle-xmark"
          message={toastMessage}
        />
      )}
      {success && (
        <Toast
          classes="success"
          iconClass="fa-solid fa-circle-check"
          message={toastMessage}
        />
      )}
      <nav className="navbar flex-row">
        <div className="logo">
          <Link className="logo-link opacity-hover" to={"/"}>
            Blogo
          </Link>
        </div>
        <div className="nav-user-info flex-row">
          {loggedIn ? (
            <Link
              className="link logout opacity-hover"
              onClick={logOutHandler}
              to={"/"}
            >
              Logout
            </Link>
          ) : (
            <Link className="link login opacity-hover" to={"/login"}>
              Login
            </Link>
          )}

          {loggedIn ? (
            <Link
              className="link create-post opacity-hover"
              to={"/create-post"}
            >
              Create Post
            </Link>
          ) : (
            <Link className="link register opacity-hover" to={"/register"}>
              Register
            </Link>
          )}
          {loggedIn && (
            <Link
              className="user-avatar flex-row"
              to={`/user-details/${userData?.id}`}
            >
              <img src={userInfo?.cover || avatar} alt="avatar" />
              <p className="username opacity-hover">
                {userInfo?.username?.split(" ")[0]}
              </p>
            </Link>
          )}
          <div className="burger">
            {!menuClicked && (
              <MenuIcon
                className="menu-icon opacity-hover"
                onClick={menuClikedHandler}
              />
            )}
            {menuClicked && (
              <CloseIcon
                className="menu-icon opacity-hover"
                onClick={menuClikedHandler}
              />
            )}
          </div>
        </div>
        <div className={`menubar flex-row ${menuClicked ? "active" : ""}`}>
          {loggedIn ? (
            <Link
              className="link opacity-hover"
              onClick={logOutHandler}
              to={"/"}
            >
              Logout
            </Link>
          ) : (
            <Link className="link opacity-hover" to={"/login"}>
              Login
            </Link>
          )}

          {loggedIn ? (
            <Link className="link opacity-hover" to={"/create-post"}>
              Create Post
            </Link>
          ) : (
            <Link className="link opacity-hover" to={"/register"}>
              Register
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

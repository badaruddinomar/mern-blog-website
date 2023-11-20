import { useState } from "react";
// import { backendUrl } from "../helper";
import { Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Toast from "../toast/Toast";
import "./login.css";

const Login = () => {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(Boolean);
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");

  const dispatch = useDispatch();
  const isLoggedIn = () => {
    dispatch({
      type: "isLoggedIn",
    });
  };
  const notLoggedIn = () => {
    dispatch({
      type: "notLoggedIn",
    });
  };

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const passwordChangeHadler = (event) => {
    setPassword(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const submitHandler = async (event) => {
    try {
      event.preventDefault();
      setLoading(true);
      // if (email === "" || password === "") return;

      const response = await fetch(`/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();

      if (response.ok) {
        setLoading(false);
        isLoggedIn();

        setSuccess(true);
        setToastMessage(result.message);
        setTimeout(() => {
          setSuccess(false);
          setRedirect(true);
        }, 1500);
      } else {
        setLoading(true);
        notLoggedIn();

        setToastMessage(result.message);
        setError(true);
        setTimeout(() => {
          setLoading(false);
          setError(false);
          setRedirect(false);
        }, 1500);
      }
      setEmail("");
      setPassword("");
    } catch (error) {
      // console.log(error);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

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
      <div className="login flex-row">
        <h3 className="login-header">Login to get started</h3>

        <form onSubmit={submitHandler} className="flex-row">
          <div className="form-controller flex-row">
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              value={email}
              placeholder="enter email"
              onChange={emailChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="password"> password</label>
            <input
              type="password"
              id="password"
              placeholder="enter password"
              value={password}
              onChange={passwordChangeHadler}
            />
          </div>

          <button className="btn opacity-hover">
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;

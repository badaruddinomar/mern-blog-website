import { useState } from "react";
// import { backendUrl } from "./../helper";
import { Navigate } from "react-router-dom";
import Toast from "../toast/Toast";
import "./register.css";

function Register() {
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(Boolean);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [files, setFiles] = useState("");
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");

  const userNameChangeHandler = (event) => {
    setUsername(event.target.value);
  };
  const passwordChangeHadler = (event) => {
    setPassword(event.target.value);
  };
  const emailChangeHandler = (event) => {
    setEmail(event.target.value);
  };
  const descChangeHandler = (event) => {
    setDesc(event.target.value);
  };
  const linkChangeHandler = (event) => {
    setLink(event.target.value);
  };
  const filesChangeHandler = (event) => {
    setFiles(event.target.files);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("username", username);
    data.append("password", password);
    data.append("email", email);
    data.append("desc", desc);
    data.append("link", link);
    data.append("file", files[0]);

    const response = await fetch(`/register`, {
      method: "POST",
      credentials: "include",
      body: data,
    });
    const result = await response.json();
    // if (response.ok) {
    //   setLoading(false);
    //   setRedirect(true);
    // } else {
    //   setLoading(true);
    //   setRedirect(false);
    // }

    if (response.ok) {
      setLoading(false);
      setSuccess(true);
      setToastMessage(result.message);
      setTimeout(() => {
        setSuccess(false);
        setRedirect(true);
      }, 1500);
    } else {
      setLoading(true);
      setToastMessage(result.message);
      setError(true);
      setTimeout(() => {
        setLoading(false);
        setError(false);
        setRedirect(false);
      }, 1500);
    }

    setUsername("");
    setPassword("");
    setEmail("");
    setDesc("");
    setLink("");
  };

  if (redirect) {
    return <Navigate to={"/login"} />;
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
      <div className="register flex-row">
        <h4>Register to get started</h4>
        <form onSubmit={submitHandler}>
          <div className="form-controller flex-row">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              placeholder="enter username"
              onChange={userNameChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="enter password"
              onChange={passwordChangeHadler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="enter email"
              value={email}
              onChange={emailChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="desc">Write about you</label>
            <input
              type="text"
              placeholder="something about you"
              id="desc"
              value={desc}
              onChange={descChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="link">Your social link</label>
            <input
              type="text"
              placeholder="add a valuable social link"
              id="link"
              value={link}
              onChange={linkChangeHandler}
            />
          </div>
          <div className="form-controller avatar flex-row">
            <label htmlFor="avatar">Avatar</label>
            <input type="file" id="avatar" onChange={filesChangeHandler} />
          </div>

          <button className="btn opacity-hover">
            {loading ? "Processing..." : "Submit"}{" "}
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;

import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillFormats } from "../helper";
import { quillModules } from "../helper";
import { Navigate } from "react-router-dom";
// import { backendUrl } from "./../helper";
import Toast from "../toast/Toast";
import "./createPost.css";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(Boolean);
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");

  const titleChangeHandler = (event) => {
    setTitle(event.target.value);
  };
  const summaryChangeHandler = (event) => {
    setSummary(event.target.value);
  };
  const contentChangeHandler = (value) => {
    setContent(value);
  };
  const fileChangeHandler = (event) => {
    setFiles(event.target.files);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.set("title", title);
    data.set("summary", summary),
      data.set("content", content),
      data.set("file", files[0]);

    const response = await fetch(`/create-post`, {
      method: "Post",
      credentials: "include",
      body: data,
    });
    const result = await response.json();

    if (response.ok) {
      setSuccess(true);
      setLoading(false);
      setToastMessage(result.message);
      setTimeout(() => {
        setSuccess(false);
        setRedirect(true);
      }, 1500);
    } else {
      setToastMessage(result.message);
      setError(true);
      setTimeout(() => {
        setError(false);
        setRedirect(false);
        setLoading(false);
      }, 1500);
    }
  };
  if (redirect) return <Navigate to={"/"} />;

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
      <div className="create-post flex-row">
        <h4>Create your post</h4>

        <form action="" className="flex-row" onSubmit={submitHandler}>
          <div className="form-controller flex-row">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter a title >100 char"
              value={title}
              onChange={titleChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="summary">Summary</label>
            <input
              type="text"
              placeholder="Enter a summary >150 char"
              id="summary"
              value={summary}
              onChange={summaryChangeHandler}
            />
          </div>

          <div className="form-controller flex-row file">
            <label htmlFor="file">Cover Photo</label>
            <input
              type="file"
              placeholder="add a banner"
              onChange={fileChangeHandler}
            />
          </div>

          <ReactQuill
            formats={quillFormats}
            modules={quillModules}
            theme="snow"
            value={content}
            className="react-quill"
            onChange={contentChangeHandler}
            placeholder="Write your blog post"
          />

          <button className="btn opacity-hover">
            {loading ? "Processing..." : "Create Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default CreatePost;

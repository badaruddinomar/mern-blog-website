import { useEffect, useState } from "react";
// import { backendUrl } from "../helper";
import { useParams, Navigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { quillFormats } from "../helper";
import { quillModules } from "../helper";
import "./editPost.css";
import Toast from "../toast/Toast";

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(Boolean);
  const [error, setError] = useState(Boolean);
  const [success, setSuccess] = useState(Boolean);
  const [toastMessage, setToastMessage] = useState("");

  const { id } = useParams();
  useEffect(() => {
    const fetchHandler = async () => {
      const response = await fetch(`/single-post/${id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();

      setTitle(data.data.title);
      setSummary(data.data.summary);
      setContent(data.data.content);
    };
    fetchHandler();
  }, [id]);

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

    const response = await fetch(`/edit-post/${id}`, {
      method: "PATCH",
      credentials: "include",
      body: data,
    });
    const result = await response.json();
    if (response.ok) setLoading(false);
    if (response.ok) {
      setSuccess(true);
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

      <div className="edit-post flex-row">
        <h3>Edit your post</h3>

        <form onSubmit={submitHandler} className="flex-row">
          <div className="form-controller flex-row">
            <label htmlFor="title">Edit Title</label>
            <input
              type="text"
              id="title"
              placeholder="Enter a title"
              value={title}
              onChange={titleChangeHandler}
            />
          </div>
          <div className="form-controller flex-row">
            <label htmlFor="summary">Edit Summary</label>
            <input
              type="text"
              placeholder="Enter a summary"
              id="summary"
              value={summary}
              onChange={summaryChangeHandler}
            />
          </div>
          <div className="form-controller flex-row file">
            <label htmlFor="file">Edit Banner</label>
            <input
              type="file"
              placeholder="Input a banner"
              onChange={fileChangeHandler}
            />
          </div>
          <ReactQuill
            className="react-quill"
            formats={quillFormats}
            modules={quillModules}
            theme="snow"
            value={content}
            onChange={contentChangeHandler}
          />
          <button className="btn opacity-hover" type="submit">
            {loading ? "Processing..." : "Edit Post"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditPost;

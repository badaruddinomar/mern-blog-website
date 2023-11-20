import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
// import { backendUrl } from "../helper";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import defaultBanner from "./../../images/default-banner.jpg";
import "./singlePost.css";

const SinglePost = () => {
  const { userData } = useSelector((state) => state.custom);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const [postData, setPostData] = useState({});
  useEffect(() => {
    const fetchHandler = async () => {
      setLoading(true);
      const response = await fetch(`/single-post/${id}`, {
        headers: { "content-type": "application/json" },
      });
      const data = await response.json();
      setPostData(data.data);
      setLoading(false);
    };
    fetchHandler();
  }, [id]);

  return (
    <>
      {loading ? (
        <div className="spinner-div">
          <ClipLoader className="spinner" color="white" />
        </div>
      ) : (
        <div className="single-post-container flex-row">
          <div className="row flex-row">
            <h3 className="post-title">{postData?.title}</h3>
            <div>
              <Link
                className="author opacity-hover"
                to={`/user-profile/${postData?.author?._id}`}
              >
                {postData?.author?.username}
              </Link>
              <span className="date">
                {new Date(postData?.createdAt).toDateString()}
              </span>
            </div>

            {postData?.author?._id === userData?.id && (
              <Link
                className="edit-btn btn opacity-hover"
                to={`/edit-post/${id}`}
              >
                Edit
              </Link>
            )}
            <div className="summary">{postData?.summary}</div>

            <div className="post-banner">
              <img src={postData?.cover || defaultBanner} alt="post-banner" />
            </div>
            <div
              className="post-desc"
              dangerouslySetInnerHTML={{ __html: postData?.content }}
            ></div>
          </div>
        </div>
      )}
    </>
  );
};

export default SinglePost;

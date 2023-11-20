/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import defaultBanner from "./../../images/default-banner.jpg";
import defaultAvatar from "./../../images/avatar.png";
import "./posts.css";

const Posts = ({ postData }) => {
  return (
    <>
      <div className="post-container flex-row">
        {postData?.map((post, ind) => {
          return (
            <div key={ind} className="post-wrapper flex-row text-deco-none">
              <div className="post flex-row">
                <div className="post-banner">
                  <Link to={`/single-post/${post?._id}`}>
                    <img
                      className="opacity-hover"
                      src={post?.cover || defaultBanner}
                      alt="banner"
                    />
                  </Link>
                </div>

                <div className="post-desc">
                  <Link to={`/single-post/${post?._id}`}>
                    <h2 className="opacity-hover">
                      {post?.title?.slice(0, 100)}
                    </h2>
                  </Link>

                  <p>{post?.summary?.slice(0, 150)} ...</p>

                  <div className="post-author flex-row">
                    <Link
                      to={`/user-profile/${post?.author?._id}`}
                      className="avatar flex-row text-deco-none"
                    >
                      <img
                        className="opacity-hover"
                        src={post?.author?.cover || defaultAvatar}
                        alt="avatar"
                      />
                      <span className="opacity-hover">
                        {post?.author?.username?.split(" ")[0]}
                      </span>
                    </Link>
                    <p>{new Date(post?.createdAt).toDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Posts;

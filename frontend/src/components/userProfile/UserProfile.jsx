import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { backendUrl } from "../helper";
import "./userProfile.css";
import ClipLoader from "react-spinners/ClipLoader";
import writing from "./../../images/writing.jpg";
import Posts from "../posts/Posts";

const UserProfile = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHandler = async () => {
      setLoading(true);
      const response = await fetch(`/user-profile/${id}`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) setLoading(false);

      const data = await response.json();
      setUserInfo(data);
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
        <div className="user-profile flex-row">
          <div className="user-profile__container">
            <div className="user-profile__banner">
              <img src={writing} alt="banner" />
            </div>
            <div className="user-profile__info">
              <div className="user-img">
                <img width={"300px"} src={userInfo?.cover} alt="user-image" />
              </div>
              <p className="username">{userInfo?.username}</p>
              <p className="desc">{userInfo?.desc}</p>
              <a
                target="_blank"
                rel="noreferrer"
                className="link opacity-hover"
                href={userInfo?.link}
              >
                <i className="fa-solid fa-globe"></i>
                My social link
              </a>
            </div>

            <Posts postData={userInfo?.filteredPost} />
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfile;

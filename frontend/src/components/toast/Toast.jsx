/* eslint-disable react/prop-types */
import "./toast.css";

const Toast = (props) => {
  const { classes, iconClass, message } = props;
  return (
    <>
      <div className={`toast ${classes}`}>
        <p className="message">
          <i className={`${iconClass}`}></i> {message}
        </p>
      </div>
    </>
  );
};

export default Toast;

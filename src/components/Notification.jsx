import React from "react";
import "./Notification.css";

const Notification = ({ message, type }) =>
  message ? (
    <div className={`notification ${type}`}>
      {message}
    </div>
  ) : null;

export default Notification;

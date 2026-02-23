import React from "react";

export default function GuestRoutes(props) {
  if (localStorage.getItem("token") === null) {
    return props.children;
  } else {
    return <Navigate to="/" />;
  }
}

import React from "react";
import LoginContext from "../../context/LoginContext";
import Login from "./Login";
const IndexLogin = () => {
  return (
    <LoginContext>
      <Login />
    </LoginContext>
  );
};
export default IndexLogin;
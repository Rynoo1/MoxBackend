import React from "react";

const Login: React.FC = () => {
  return (
    <div className="login-page">
      <h1>Login</h1>
      <form className="login-form">
        <input type="email" placeholder="Email" name="email" required />
        <input type="password" placeholder="Password" name="password" required />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default Login;

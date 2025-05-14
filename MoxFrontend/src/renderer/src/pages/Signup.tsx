import React from "react";

const Signup: React.FC = () => {
  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form className="signup-form">
        <input type="text" placeholder="Full Name" name="fullName" required />
        <input type="email" placeholder="Email" name="email" required />
        <input type="password" placeholder="Password" name="password" required />
        <input type="password" placeholder="Confirm Password" name="confirmPassword" required />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;

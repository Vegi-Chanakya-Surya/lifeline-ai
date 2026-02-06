import { Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  return (
    <div className="auth-page">
      <div className="auth-card">

        <h1>Create your account</h1>
        <p className="auth-subtitle">
          Get started with ArogyaMitra in seconds
        </p>

        {/* Google Auth Button */}
        <button className="google-button">
          Continue with Google
        </button>

        {/* Divider */}
        <div className="auth-divider">
          <span>or</span>
        </div>

        {/* Manual Register Form */}
        <form className="auth-form">
          <div>
            <label>Name</label>
            <input
              type="text"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type="password"
              placeholder="Create a password"
            />
          </div>

          <button className="auth-button" type="submit">
            Create account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account?
          <Link to="/login">Login</Link>
        </div>

      </div>
    </div>
  );
};

export default Register;

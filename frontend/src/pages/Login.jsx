import { Link } from "react-router-dom";
import "./Auth.css";


const Login = () => {
  return (

    <div className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-subtitle">
          Login to continue to LifeLine AI
        </p>

        <button className="google-button">
        Continue with Google
        </button>

        <div className="auth-divider">
        <span>or</span>
        </div>

        <form className="auth-form">
          <div>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" />
          </div>

          <div>
            <label>Password  </label>
            <input type="password" placeholder="••••••••" />
          </div>

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>

        <div className="auth-footer">
          Don’t have an account?
          <Link to="/register">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

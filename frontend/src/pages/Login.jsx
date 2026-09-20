import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiEye,
  FiEyeOff,
  FiGithub,
  FiArrowLeft,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("access_token", data.access_token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <div className="login-visual">
        <div className="visual-grid"></div>

        <div className="visual-glow visual-glow-one"></div>
        <div className="visual-glow visual-glow-two"></div>

        <button
          className="back-home"
          onClick={() => navigate("/")}
        >
          <FiArrowLeft />
          Back to Home
        </button>

        <div className="visual-content">
          <div className="visual-logo">
            NOVA<span>TECH</span>
          </div>

          <div className="visual-line"></div>

          <h2>
            BUILD.
            <br />
            CREATE.
            <br />
            <span>INNOVATE.</span>
          </h2>

          <p>
            Build powerful digital experiences
            with technology that moves your
            ideas forward.
          </p>

          <div className="visual-orb">
            <div className="orb-ring ring-one"></div>
            <div className="orb-ring ring-two"></div>
            <div className="orb-core"></div>
          </div>
        </div>

        <div className="visual-footer">
          <span>© 2026 NOVATECH</span>
          <span>TECHNOLOGY • DESIGN • INNOVATION</span>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-form-side">

        <div className="login-card">

          <div className="login-heading">
            <span className="login-small-title">
              WELCOME BACK
            </span>

            <h1>Sign in</h1>

            <p>
              Enter your details to access your
              NOVATECH account.
            </p>
          </div>

          <form onSubmit={handleLogin}>

            <div className="login-input-group">
              <label>Email</label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-input-group">
              <label>Password</label>

              <div className="password-wrapper">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FiEyeOff />
                  ) : (
                    <FiEye />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="login-divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="social-login">

            <button
              type="button"
              className="social-button"
            >
              <FiGithub />
              <span>GitHub</span>
            </button>

            <button
              type="button"
              className="social-button"
            >
              <FcGoogle />
              <span>Google</span>
            </button>

          </div>

          <p className="login-note">
            Social login will be available soon.
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;
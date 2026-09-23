import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import "./Login.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("Account created successfully!");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setError(error.message || "Registration failed");
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
              JOIN NOVATECH
            </span>

            <h1>Create Account</h1>

            <p>
              Create your account to get started
              with NOVATECH.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            <div className="login-input-group">
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
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

            {success && (
              <div className="login-success">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create Account"}
            </button>
          </form>

          <button
            type="button"
            className="register-link"
            onClick={() => navigate("/login")}
          >
            Already have an account?{" "}
            <span>Sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;


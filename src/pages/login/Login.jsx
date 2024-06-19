import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post("http://localhost:8081/login", credentials);
      
      if (res.data && res.data.token) {
        const username = credentials.username;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", username);
        navigate("/");
      } else {
        setError({ message: "Login failed. Please check your credentials." });
      }
    } catch (err) {
      setError({ message: "An error occurred. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="lContainer">
        <input
          type="text"
          placeholder="username"
          id="username"
          value={credentials.username}
          onChange={handleChange}
          className="lInput"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          value={credentials.password}
          onChange={handleChange}
          className="lInput"
        />
        <button disabled={loading} onClick={handleClick} className="lButton">
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <span className="error">{error.message}</span>}
      </div>
    </div>
  );
};

export default Login;

import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaUser, FaLock } from 'react-icons/fa';
import "./login.scss";

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);

    const { username, password } = credentials;

    try {
      // Step 1: Perform login to get the token
      const res = await axios.post('http://localhost:8081/login', { username, password });

      // Step 2: Fetch user details using the username and token
      const token = res.data.token;

      console.log("Username:", username);
      console.log("Token:", token);
      console.log("Credentials:", credentials);
      console.log("Data:", res.data);

      const userRes = await axios.get(`http://localhost:8081/api/v1/users/admin`, {
        params: { username }, // Set username as a query parameter
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
      });

      console.log("User:", userRes.data);

      // Check if user data is received and user is admin
      if (userRes.data && userRes.data.role === "ADMIN") {
        // Step 3: Store token and user data in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userRes.data));

        // Step 4: Navigate to home or admin panel
        navigate("/");
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Access Denied',
          text: 'You do not have permission to access this application.',
        });
      }
    } catch (err) {
      console.error("Login error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: 'An error occurred. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <div className="login">
      <div className="lContainer">
        <h2>Login</h2>
        <div className="inputContainer">
          <FaUser />
          <input
            type="text"
            placeholder="Username"
            id="username"
            value={credentials.username}
            onChange={handleChange}
            className="lInput"
          />
        </div>
        <div className="inputContainer">
          <FaLock />
          <input
            type="password"
            placeholder="Password"
            id="password"
            value={credentials.password}
            onChange={handleChange}
            className="lInput"
          />
        </div>
        <button disabled={loading} onClick={handleClick} className="lButton">
          {loading ? "Logging in..." : "Login"}
        </button>
      </div>
    </div>
  );
};

export default Login;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../../home.scss";
import Swal from "sweetalert2";

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    fname: "",
    lname: "",
    username: "",
    password: "",
    email: "",
    phone: "",
    photo: "",
    role: "CLIENT",
  });

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(`http://localhost:8081/api/v1/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser(response.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      if (id) {
        await axios.put(
          `http://localhost:8081/api/v1/users/update`,
          user,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(
          'http://localhost:8081/register',
          user,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      navigate('/user');
    } catch (error) {
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response.data,
      })
      console.error('Error saving user:', error);
    }
  }, [user, id, navigate]);

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="container mt-4">
          <h2>{id ? "Edit User" : "Create User"}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input
                type="text"
                className="form-control"
                name="fname"
                value={user.fname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                className="form-control"
                name="lname"
                value={user.lname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                name="username"
                value={user.username}
                onChange={handleChange}
                required
              />
            </div>
            {!id && (
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={user.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                name="phone"
                value={user.phone}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                name="role"
                value={user.role}
                onChange={handleChange}
                required
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CLIENT">CLIENT</option>
                <option value="TECHNICIAN">TECHNICIAN</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary">
              {id ? "Update" : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;

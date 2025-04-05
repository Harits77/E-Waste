import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const [Form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handlechange = (e) => {
    const { name, value } = e.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:6002/register", Form)
      .then((result) => {
        if (result.data.message === "Email already exists") {
          alert("Email already exists");
        } else if (result.data.message === "User registered successfully") {
          alert("Registration successful!");
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-700">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8 md:p-12 w-[90%] max-w-md text-white">
        <h1 className="text-3xl font-extrabold text-emerald-400 mb-8 text-center">
          Create Your Account 📝
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block mb-2 text-lg font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={Form.name}
              onChange={handlechange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-lg font-semibold">
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={Form.email}
              onChange={handlechange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-lg font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={Form.password}
              onChange={handlechange}
              className="w-full p-2 rounded-md bg-slate-700 border border-slate-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-md transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="text-center mt-6 text-sm md:text-base">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;

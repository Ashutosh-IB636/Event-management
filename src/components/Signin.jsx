import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../redux/slice/usersSlice";
import { User, Lock, Building2, Briefcase } from "lucide-react";

function Signin() {
  const [role, setRole] = useState("employee");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const users = useSelector((state) => state.user.allUsers);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = () => {
    // Add authentication logic here
    if (role === "admin") {
      const user = users?.filter(
        (user) =>
          user.role == "admin" &&
          user.email === username &&
          user.password === password
      );
      if (user) {
        dispatch(setUser({ user: user[0], isAdmin: true }));
        navigate(`/admin`);
      }
    } else {
      const user = users?.filter(
        (user) => user.email === username && user.password === password
      );
      if (user) {
        dispatch(setUser({ user: user[0], isAdmin: false }));
        navigate(`/employee/${user[0].id}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please sign in to your account
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-fourth focus:border-fourth sm:text-sm"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-fourth focus:border-fourth sm:text-sm"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {role === "admin" ? (
                    <Building2 className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-fourth focus:border-fourth sm:text-sm"
                >
                  <option value="employee">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogin}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fourth hover:bg-fourth/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fourth"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}

export default Signin;

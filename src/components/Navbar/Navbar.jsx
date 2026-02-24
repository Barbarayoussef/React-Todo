import React, { useContext } from "react";
import { userContext } from "../Contexts/UserContext/UserContext";
import { Link, NavLink, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, token, setUser, setToken } = useContext(userContext);
  let navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser({});
    navigate("/login");
  }

  return (
    <nav className="bg-white/80 backdrop-blur-lg fixed w-full z-50 top-0 start-0 border-b border-purple-50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <i className="fa-solid fa-spa text-purple-500"></i>
          </div>
          <span className="self-center text-xl font-bold tracking-tighter text-slate-800">
            Space For You<span className="text-purple-400">.</span>
          </span>
        </Link>

        <div className="flex items-center md:order-2 space-x-3 rtl:space-x-reverse">
          {token && (
            <div className="flex items-center gap-4">
              <span className="hidden sm:block text-xs font-semibold text-slate-400 uppercase tracking-widest">
                {user.name}
              </span>

              <button
                onClick={logout}
                className="bg-slate-100 text-slate-500 hover:bg-purple-100 hover:text-purple-600 px-4 py-2 rounded-xl text-sm font-bold transition-all"
              >
                Logout
              </button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-slate-400 rounded-xl md:hidden hover:bg-purple-50 focus:outline-none"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
          id="navbar-user"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-purple-50 rounded-2xl bg-white md:bg-transparent md:flex-row md:space-x-8 md:mt-0 md:border-0">
            {token ? (
              <>
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block py-2 px-3 transition-colors ${
                        isActive
                          ? "text-purple-600 font-bold"
                          : "text-slate-500 hover:text-purple-400"
                      }`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="profile"
                    className={({ isActive }) =>
                      `block py-2 px-3 transition-colors ${
                        isActive
                          ? "text-purple-600 font-bold"
                          : "text-slate-500 hover:text-purple-400"
                      }`
                    }
                  >
                    Profile
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink
                    to="login"
                    className={({ isActive }) =>
                      `block py-2 px-3 transition-colors ${
                        isActive
                          ? "text-purple-600 font-bold"
                          : "text-slate-500 hover:text-purple-400"
                      }`
                    }
                  >
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="register"
                    className="block py-2 px-5 bg-purple-500 text-white rounded-xl font-bold hover:bg-purple-600 transition-all shadow-sm shadow-purple-100"
                  >
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

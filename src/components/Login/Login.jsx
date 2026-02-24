import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { userContext } from "../Contexts/UserContext/UserContext";
import { Helmet } from "react-helmet";

let schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one number, and one special character",
    ),
});

export default function Login() {
  let [successMsg, setSuccessMsg] = useState("");
  let [errorMsg, setErrorMsg] = useState("");
  let [isLoading, setIsloading] = useState(false);
  let navigate = useNavigate();

  const { setToken, setUser } = useContext(userContext);

  function doLogin(data) {
    setIsloading(true);
    axios
      .post("https://todo-nti.vercel.app/user/login", data)
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setSuccessMsg(res.data.message);
        setErrorMsg("");
        setToken(res.data.token);
        setUser(res.data.user);
        setIsloading(false);
        navigate("/");
      })
      .catch(() => {
        setErrorMsg("Invalid email or password");
        setSuccessMsg("");
        setIsloading(false);
      });
  }

  let loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
  });
  let { register, handleSubmit, formState } = loginForm;
  return (
    <>
      <Helmet>
        <title>Login Page</title>
      </Helmet>
      <div className="min-h-screen pt-32 pb-12 px-4 bg-[#f8f9fc]">
        <form
          onSubmit={handleSubmit(doLogin)}
          className="max-w-md mx-auto bg-white border border-purple-50 rounded-[2.5rem] p-10 shadow-xl shadow-purple-100/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Welcome Back
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Enter your details to continue
            </p>
          </div>

          {successMsg && (
            <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-xs font-bold mb-4 text-center border border-emerald-100">
              {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="bg-rose-50 text-rose-500 p-3 rounded-xl text-xs font-bold mb-4 text-center border border-rose-100">
              {errorMsg}
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="email"
              className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1"
            >
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
              placeholder="name@example.com"
            />
            {formState.errors.email && (
              <p className="text-rose-400 text-[11px] mt-1.5 ml-1 font-medium italic">
                {formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-8">
            <label
              htmlFor="password"
              className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1"
            >
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
              placeholder="••••••••"
            />
            {formState.errors.password && (
              <p className="text-rose-400 text-[11px] mt-1.5 ml-1 font-medium italic">
                {formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all active:scale-95 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <i className="fa-solid fa-circle-notch fa-spin"></i> Loading..
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

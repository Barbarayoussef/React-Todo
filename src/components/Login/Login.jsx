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
    <form
      onSubmit={handleSubmit(doLogin)}
      className="max-w-xl mx-auto border border-default-medium rounded-base m-12 p-6 shadow-xs"
    >
      {successMsg && (
        <p className="text-green-500 text-sm mb-4">{successMsg}</p>
      )}
      {errorMsg && <p className="text-red-500 text-sm mb-4">{errorMsg}</p>}

      <div className="mb-5">
        <label
          htmlFor="email"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          Your email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="name@flowbite.com"
        />
        {formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {formState.errors.email.message}
          </p>
        )}
      </div>
      <div className="mb-5">
        <label
          htmlFor="password"
          className="block mb-2.5 text-sm font-medium text-heading"
        >
          Your password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
          placeholder="••••••••"
        />
        {formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="text-white bg-brand box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none w-full disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? (
          <span>
            <i className="fa-solid fa-spinner fa-spin mr-2"></i>Logging in..
          </span>
        ) : (
          "Log in"
        )}
      </button>
    </form>
    </>
  );
}

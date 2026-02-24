import { useForm } from "react-hook-form";
import { useState } from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

let schema = z
  .object({
    name: z
      .string()
      .min(5, "Name is required")
      .max(30, "Name must be less than 30 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one number, and one special character",
      ),
    confirmPassword: z
      .string()
      .min(8, "Confirm password must be at least 8 characters")
      .regex(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Confirm password must contain at least one uppercase letter, one number, and one special character",
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export default function Register() {
  let [successMsg, setSuccessMsg] = useState("");
  let [errorMsg, setErrorMsg] = useState("");
  let [isLoading, setIsloading] = useState(false);
  let navigate = useNavigate();
  function doRegister(data) {
    setIsloading(true);
    axios
      .post("https://todo-nti.vercel.app/user/signup", data)
      .then((res) => {
        if (res.data.message === "user already exsist") {
          setErrorMsg(res.data.message);
          setSuccessMsg("");
        } else {
          setErrorMsg("");
          setSuccessMsg(res.data.message);
        }
        setIsloading(false);

        navigate("/login");
      })
      .catch(() => {});
  }

  let registerForm = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });
  let { register, handleSubmit, formState } = registerForm;
  return (
    <>
      <Helmet title="Register" />

      <div className="min-h-screen pt-32 pb-12 px-4 bg-[#f8f9fc]">
        <form
          onSubmit={handleSubmit(doRegister)}
          className="max-w-md mx-auto bg-white border border-purple-50 rounded-[2.5rem] p-10 shadow-xl shadow-purple-100/20"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Join us and start organizing
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

          <div className="space-y-5">
            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Full Name
              </label>
              <input
                {...register("name")}
                className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
                placeholder="Your Name"
              />
              {formState.errors.name && (
                <p className="text-rose-400 text-[11px] mt-1.5 ml-1 italic">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Email
              </label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
                placeholder="name@example.com"
              />
              {formState.errors.email && (
                <p className="text-rose-400 text-[11px] mt-1.5 ml-1 italic">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <input
                {...register("password")}
                type="password"
                className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
                placeholder="••••••••"
              />
              {formState.errors.password && (
                <p className="text-rose-400 text-[11px] mt-1.5 ml-1 italic">
                  {formState.errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">
                Confirm
              </label>
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full bg-slate-50 border border-slate-100 text-slate-700 text-sm rounded-2xl focus:ring-2 focus:ring-purple-200 focus:bg-white transition-all block px-4 py-3.5 outline-none"
                placeholder="••••••••"
              />
              {formState.errors.confirmPassword && (
                <p className="text-rose-400 text-[11px] mt-1.5 ml-1 italic">
                  {formState.errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-100 transition-all active:scale-95 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? (
              <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
            ) : (
              "Create Account"
            )}
          </button>
        </form>
      </div>
    </>
  );
}

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z, { set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

let schema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});
export default function Home() {
  let [isLoading, setIsloading] = useState(false);
  let [todos, setTodos] = useState([]);
  let [isOpen, setIsOpen] = useState(false);
  let [selectedTodoID, setSelectedTodoID] = useState("");

  //create todo
  let createForm = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  function createTodo(data) {
    setIsloading(true);
    axios
      .post("https://todo-nti.vercel.app/todo/create", data, {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then(() => {
        toast.success("Successfully added!");
      })
      .catch(() => {
        toast.error("Failed to add TODO. Please try again.");
      })
      .finally(() => {
        setIsloading(false);
        createForm.reset();
        getAllTodos();
      });
  }

  //get all todos
  function getAllTodos() {
    axios
      .get("https://todo-nti.vercel.app/todo/get-all", {
        headers: {
          token: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log(response.data);
        setTodos(response.data.todos);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }

  useEffect(() => {
    getAllTodos();
  }, []);

  //delete todo
  function deleteTodo(id) {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        console.log(id);

        axios
          .delete(`https://todo-nti.vercel.app/todo/delete-todo/${id}`, {
            headers: {
              token: localStorage.getItem("token"),
            },
          })
          .then(() => {
            Swal.fire({
              title: "Deleted!",
              text: "Your task has been removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            getAllTodos();
          })
          .catch((error) => {
            console.error("Error deleting todo:", error);
            Swal.fire({
              title: "Error!",
              text: "Could not delete the task. Please try again.",
              icon: "error",
            });
          });
      }
    });
  }
  //update todo
  let updateForm = useForm({
    resolver: zodResolver(schema),
  });

  function setupUpdate(todo) {
    console.log(todo);
    updateForm.reset({
      title: todo.title,
      description: todo.description,
    });
    setSelectedTodoID(todo._id);
    setIsOpen(true);
  }

  function updateTodo(data) {
    console.log(selectedTodoID);
    axios
      .patch(
        `https://todo-nti.vercel.app/todo/update-todo/${selectedTodoID}`,
        data,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      )
      .then((res) => {
        console.log(res);
        toast.success("Successfully updated!");
        getAllTodos();
      })
      .catch(() => {
        toast.error("Failed to update TODO. Please try again.");
      });
  }

  return (
    <>
      <Helmet>
        <title>Home Page</title>
      </Helmet>
      ;{/* Modal Overlay */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* Backdrop blur */}
        <div
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        ></div>

        {/* Modal Content */}
        <div className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all scale-100">
          {/* Modal Header */}
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-xl p-8 border border-slate-100">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-slate-800">
                Update Task
              </h3>
              <p className="text-xs text-slate-400">
                Make your adjustments below.
              </p>
            </div>
          </div>

          {/* Modal Body */}
          <form
            onSubmit={updateForm.handleSubmit(updateTodo)}
            className="space-y-4"
          >
            <input
              {...updateForm.register("title")}
              className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none"
            />
            <textarea
              {...updateForm.register("description")}
              rows="3"
              className="w-full bg-slate-50 border-none rounded-xl px-5 py-3 text-slate-700 focus:ring-2 focus:ring-purple-200 outline-none resize-none"
            />

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsOpen(false)}
                type="submit"
                className="flex-1 bg-purple-500 text-white font-bold py-3 rounded-xl hover:bg-purple-600 transition-all shadow-sm"
              >
                Save
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-slate-100 text-slate-500 font-bold py-3 rounded-xl hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="min-h-screen pt-24 pb-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-tr from-slate-100 to-purple-50 rounded-[2rem] p-10 shadow-sm border border-purple-100/50 mb-12">
            <div className="mb-8">
              <h2 className="text-2xl font-light tracking-tight text-slate-800">
                Welcome,{" "}
                <span className="font-semibold text-purple-500">Back!</span>
              </h2>
              <p className="text-slate-500 text-sm">
                Organize your thoughts for the day.
              </p>
            </div>

            <form
              onSubmit={createForm.handleSubmit(createTodo)}
              className="space-y-4"
            >
              <input
                {...createForm.register("title")}
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all outline-none"
                placeholder="Task title..."
              />
              <textarea
                {...createForm.register("description")}
                className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all outline-none resize-none"
                placeholder="Detailed notes..."
                rows="2"
              />
              <button
                disabled={isLoading}
                className="w-full bg-purple-200 hover:bg-purple-300 text-purple-800 font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                {isLoading ? (
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                ) : (
                  "Add to List"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-white border border-slate-100 p-7 rounded-[1.8rem] shadow-sm hover:shadow-md hover:border-purple-100 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-slate-700 group-hover:text-purple-600 transition-colors">
                {todo.title}
              </h3>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-400 hover:text-red-600 transition-colors"
              >
                <i className="fa-regular fa-trash-can"></i>
              </button>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              {todo.description}
            </p>
            <button
              onClick={() => setupUpdate(todo)}
              className="w-full py-2 rounded-xl bg-slate-50 text-slate-500 text-xs font-bold hover:bg-purple-100 hover:text-purple-700 transition-all"
            >
              Edit Details
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

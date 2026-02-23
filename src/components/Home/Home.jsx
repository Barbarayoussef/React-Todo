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
      ;
      <div
        tabIndex={-1}
        className={` overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full ${isOpen ? "flex" : "hidden"}`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-neutral-primary-soft border border-default rounded-base shadow-sm p-4 md:p-6">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-default pb-4 md:pb-5">
              <h3 className="text-lg font-medium text-heading">Update TODO</h3>
              <button
                type="button"
                className="text-body bg-transparent hover:bg-neutral-tertiary hover:text-heading rounded-base text-sm w-9 h-9 ms-auto inline-flex justify-center items-center"
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width={24}
                  height={24}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18 17.94 6M18 18 6.06 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <form
              onSubmit={updateForm.handleSubmit(updateTodo)}
              className="mt-4 md:mt-6"
            >
              <div className="grid gap-4 grid-cols-2 py-4 md:py-6">
                <div className="col-span-2">
                  <label
                    htmlFor="name"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    {...updateForm.register("title")}
                    className="bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    placeholder="Type TODO title"
                  />
                  {updateForm.formState.errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.title.message}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label
                    htmlFor="description"
                    className="block mb-2.5 text-sm font-medium text-heading"
                  >
                    TODO Description
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    {...updateForm.register("description")}
                    className="block bg-neutral-secondary-medium border border-default-medium text-heading text-sm rounded-base focus:ring-brand focus:border-brand block w-full p-3.5 shadow-xs placeholder:text-body"
                    placeholder="Write TODO description here"
                  />
                  {updateForm.formState.errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {updateForm.formState.errors.description.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 border-t border-default pt-4 md:pt-6">
                <button
                  type="submit"
                  onClick={() => {
                    setIsOpen(false);
                  }}
                  className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  <i className="fa-regular fa-pen-to-square mr-2"></i>
                  Update TODO
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <section className="bg-white dark:bg-gray-900 min-h-screen  ">
        <div className=" mx-auto max-w-2xl lg:py-16 border border-default-medium rounded-base m-10 p-6 shadow-xs">
          <h2 className=" text-xl font-bold text-gray-900 dark:text-white text-center">
            Add new TODO
          </h2>
          <form onSubmit={createForm.handleSubmit(createTodo)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  TODO Title
                </label>
                <input
                  {...createForm.register("title")}
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type TODO title"
                />
                {createForm.formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {createForm.formState.errors.title.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="description"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  {...createForm.register("description")}
                  id="description"
                  rows="8"
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                ></textarea>
                {createForm.formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {createForm.formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              className="block px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium  text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-700  w-full disabled:opacity-50 disabled:cursor-not-allowed "
              disabled={isLoading}
            >
              {isLoading ? (
                <span>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>Creating..
                </span>
              ) : (
                "Create TODO"
              )}
            </button>
          </form>
        </div>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {todos.map((todo) => (
          <div
            key={todo._id}
            className="bg-neutral-primary-soft block w-full p-6 border border-default rounded-base shadow-xs flex flex-col justify-between"
          >
            <div>
              <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">
                {todo.title}
              </h5>
              <p className="text-body mb-6">{todo.description}</p>
            </div>

            <div className=" btns flex gap-2 mt-4 pt-4">
              <button
                onClick={() => {
                  setupUpdate(todo);
                }}
                className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <i className="fa-regular fa-pen-to-square mr-2"></i>
                Edit
              </button>

              <button
                onClick={() => {
                  deleteTodo(todo._id);
                }}
                className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                <i className="fa-solid fa-trash-can mr-2"></i>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

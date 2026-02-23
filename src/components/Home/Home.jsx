import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import Swal from "sweetalert2";

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

  //create todo
  let createForm = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    resolver: zodResolver(schema),
  });

  let { register, handleSubmit, formState } = createForm;
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
            // 2. ONLY show success if the API call worked
            Swal.fire({
              title: "Deleted!",
              text: "Your task has been removed.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });

            // 3. Refresh the list
            getAllTodos();
          })
          .catch((error) => {
            // 4. Show an error alert if something goes wrong
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

  return (
    <>
      <section className="bg-white dark:bg-gray-900 min-h-screen  ">
        <div className=" mx-auto max-w-2xl lg:py-16 border border-default-medium rounded-base m-10 p-6 shadow-xs">
          <h2 className=" text-xl font-bold text-gray-900 dark:text-white text-center">
            Add new TODO
          </h2>
          <form onSubmit={handleSubmit(createTodo)}>
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <div className="sm:col-span-2">
                <label
                  for="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  TODO Title
                </label>
                <input
                  {...register("title")}
                  type="text"
                  name="title"
                  id="title"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Type TODO title"
                />
                {formState.errors.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.title.message}
                  </p>
                )}
              </div>
              <div class="sm:col-span-2">
                <label
                  for="description"
                  class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Description
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  rows="8"
                  class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                  placeholder="Your description here"
                ></textarea>
                {formState.errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {formState.errors.description.message}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              class="block px-5 py-2.5 mt-4 sm:mt-6 text-sm font-medium  text-white bg-blue-600 rounded-lg focus:ring-4 focus:ring-blue-200 hover:bg-blue-700  w-full disabled:opacity-50 disabled:cursor-not-allowed "
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
              <button className="flex-1 inline-flex justify-center items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
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

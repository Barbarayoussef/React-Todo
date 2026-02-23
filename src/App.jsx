import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Layout from "./../src/components/Layout/Layout";
import Login from "./../src/components/Login/Login";
import Register from "./../src/components/Register/Register";
import Profile from "./../src/components/Profile/Profile";
import NotFound from "./../src/components/NotFound/NotFound";
import Home from "./../src/components/Home/Home";
import UserContextProvider from "./components/Contexts/UserContext/UserContext";
import { Toaster } from "react-hot-toast";
import UserRoutes from "./../src/components/UserRoutes/UserRoutes";
import GuestRoutes from "./../src/components/GuestRoutes/GuestRoutes";

let routes = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <UserRoutes>
            <Home />
          </UserRoutes>
        ),
      },
      {
        path: "login",
        element: (
          <GuestRoutes>
            <Login />
          </GuestRoutes>
        ),
      },
      {
        path: "register",
        element: (
          <GuestRoutes>
            <Register />
          </GuestRoutes>
        ),
      },
      {
        path: "profile",
        element: (
          <UserRoutes>
            <Profile />
          </UserRoutes>
        ),
      },
      {
        path: "*",
        element: (
          <UserRoutes>
            <NotFound />
          </UserRoutes>
        ),
      },
    ],
  },
]);
function App() {
  return (
    <>
      <UserContextProvider>
        <RouterProvider router={routes}></RouterProvider>
      </UserContextProvider>
      <Toaster position="top-center" />
    </>
  );
}

export default App;

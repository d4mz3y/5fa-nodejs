import type { RouteObject } from "react-router-dom";
import Layout from "../components/Layout";
import HomePage from "../pages/home.page";
import LoginPage from "../pages/login.page";
import ProfilePage from "../pages/profile.page";
import RegisterPage from "../pages/register.page";
import Validate5faPage from "../pages/validate5fa.page";
import OtpAuth from "../pages/otp.page"; 
import React from "react";

const authRoutes: RouteObject = {
  path: "auth",
  children: [
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "validate5fa",
      element: <Validate5faPage />,
    },
    {
      path: "register",
      element: <RegisterPage />,
    },
    {
      path: "otp", 
      element: <OtpAuth />,
    },
  ],
};

const normalRoutes: RouteObject = {
  path: "/",
  element: <Layout />,
  children: [
    {
      index: true,
      element: <HomePage />,
    },
    {
      path: "profile",
      element: <ProfilePage />,
    },
  ],
};

const routes: RouteObject[] = [authRoutes, normalRoutes];

export default routes;

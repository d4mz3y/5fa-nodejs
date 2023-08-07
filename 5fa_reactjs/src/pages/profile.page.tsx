import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";
import { IUser } from "../api/types";
import TwoFactorAuth from "../components/TwoFactorAuth";
import useStore from "../store";
import React from "react";

const ProfilePage = () => {
  const [secret, setSecret] = useState({
    otpauth_url: "",
    base32: "",
  });
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const store = useStore();
  const user = store.authUser;

  const generateQrCode = async ({ user_id, email }: { user_id: string; email: string }) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.post<{
        otpauth_url: string;
        base32: string;
      }>("/auth/otp/generate", { user_id, email });
      store.setRequestLoading(false);

      if (response.status === 200) {
        setOpenModal(true);
        setSecret({
          base32: response.data.base32,
          otpauth_url: response.data.otpauth_url,
        });
      }
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const disableTwoFactorAuth = async (user_id: string) => {
    try {
      store.setRequestLoading(true);
      const {
        data: { user },
      } = await authApi.post<{
        otp_disabled: boolean;
        user: IUser;
      }>("/auth/otp/disable", { user_id });
      store.setRequestLoading(false);
      store.setAuthUser(user);
      toast.warning("Five Factor Authentication Disabled", {
        position: "top-right",
      });
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const enableLocationAuth = async (user_id: string) => {
    try {
      store.setRequestLoading(true);
      // Implement the server-side logic to enable location-based authentication
      // for the user with the given user_id
      // Set appropriate response handling and state updates
      store.setRequestLoading(false);
      toast.success("Location-Based Authentication Enabled", {
        position: "top-right",
      });
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const enableOTP = async (user_id: string) => {
    try {
      store.setRequestLoading(true);
      const response = await authApi.post<{
        otpauth_url: string;
        base32: string;
      }>("/auth/otp/enable", { user_id });
      store.setRequestLoading(false);

      if (response.status === 200) {
        setOpenModal(true);
        setSecret({
          base32: response.data.base32,
          otpauth_url: response.data.otpauth_url,
        });
      }
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const enablePushNotification = async (user_id: string) => {
    try {
      store.setRequestLoading(true);
      // Implement the server-side logic to enable push notification authentication
      // for the user with the given user_id
      // Set appropriate response handling and state updates
      store.setRequestLoading(false);
      toast.success("Push Notification Authentication Enabled", {
        position: "top-right",
      });
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (!store.authUser) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <section className="bg-ct-blue-600  min-h-screen pt-10">
        <div className="max-w-4xl p-12 mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex gap-20 justify-center items-start">
          <div className="flex-grow-2">
            <h1 className="text-2xl font-semibold">Profile Page</h1>
            <div className="mt-8">
              <p className="mb-4">ID: {user?.id}</p>
              <p className="mb-4">Name: {user?.name}</p>
              <p className="mb-4">Email: {user?.email}</p>
            </div>
          </div>
          <div>
            <h3 className="text-2xl font-semibold">
              Web App Authentication (5FA)
            </h3>
            <p className="mb-4">
              Secure your account with TOTP, Location Based Auth, Email-OTP and Push Notification Auth five-factor authentication.
            </p>
            {store.authUser?.otp_enabled ? (
              <button
                type="button"
                className="focus:outline-none text-yellow bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                onClick={() => disableTwoFactorAuth(user?.id!)}
              >
                Disable TOTP
              </button>
            ) : (
              <button
                type="button"
                className="text-yellow bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                onClick={() =>
                  generateQrCode({ user_id: user?.id!, email: user?.email! })
                }
              >
                Setup TOTP
              </button>
            )}

            {/* Location-Based Authentication */}
            {store.authUser?.location_enabled ? (
              <button
                type="button"
                className="focus:outline-none text-yellow bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                onClick={() => enableLocationAuth(user?.id!)}
              >
                Disable Location Auth
              </button>
            ) : (
              <button
                type="button"
                className="text-yellow bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none"
                onClick={() => enableLocationAuth(user?.id!)}
              >
                Enable Location Auth
              </button>

            )}

            {/* OTP */}
            {!store.authUser?.otp_enabled && (
              <button
                type="button"
                className="text-yellow bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
                onClick={() => enableOTP(user?.id!)}
              >
                Setup OTP
              </button>
            )}

            {/* Push Notification Authentication */}
            {store.authUser?.push_notification_enabled ? (
              <button
                type="button"
                className="focus:outline-none text-yellow bg-orange-700 hover:bg-orange-800 focus:ring-4 focus:ring-orange-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2"
                onClick={() => enablePushNotification(user?.id!)}
              >
                Disable Push Notification
              </button>
            ) : (
              <button
                type="button"
                className="text-yellow bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none"
                onClick={() => enablePushNotification(user?.id!)}
              >
                Enable Push Notification
              </button>
            )}
          </div>
        </div>
      </section>
      {openModal && (
        <TwoFactorAuth
          base32={secret.base32}
          otpauth_url={secret.otpauth_url}
          closeModal={() => setOpenModal(false)} user_id={""}        />
      )}
    </>
  );
};

export default ProfilePage;
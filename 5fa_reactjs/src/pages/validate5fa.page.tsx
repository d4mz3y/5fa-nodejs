import { object, string, TypeOf } from "zod";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "../components/LoadingButton";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import useStore from "../store";
import { authApi } from "../api/authApi";
import OtpAuth from "./otp.page";
import React from "react";

const styles = {
  inputField: `form-control block w-full px-4 py-4 text-sm text-gray-700 bg-yellow bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-yellow focus:border-blue-600 focus:outline-none`,
};

const validate5faSchema = object({
  token: string().min(1, "Authentication code is required"),
});

export type Validate5faInput = TypeOf<typeof validate5faSchema>;

const Validate5faPage = () => {
  const navigate = useNavigate();
  const store = useStore();
  const [currentLocation, setCurrentLocation] = useState("");
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);

  const {
    handleSubmit,
    setFocus,
    register,
    formState: { errors },
  } = useForm<Validate5faInput>({
    resolver: zodResolver(validate5faSchema),
  });

  const validate5fa = async (token: string) => {
    try {
      store.setRequestLoading(true);
      const {
        data: { otp_valid },
      } = await authApi.post<{ otp_valid: boolean }>("/auth/otp/validate", {
        token,
        user_id: store.authUser?.id,
      });
      store.setRequestLoading(false);
      if (otp_valid) {
        navigate("/profile");
      } else {
        navigate("/login");
      }
    } catch (error: any) {
      store.setRequestLoading(false);
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.response.data.detail ||
        error.message ||
        error.toString();
      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const performLocationAuthentication = () => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "granted") {
            setLocationPermissionGranted(true);
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation(`${latitude},${longitude}`);
                handleLocationAuthentication(`${latitude},${longitude}`);
              },
              (error) => {
                toast.error("Failed to retrieve current location", {
                  position: "top-right",
                });
              }
            );
          } else if (permissionStatus.state === "prompt") {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const { latitude, longitude } = position.coords;
                setCurrentLocation(`${latitude},${longitude}`);
                setLocationPermissionGranted(true);
                handleLocationAuthentication(`${latitude},${longitude}`);
              },
              (error) => {
                toast.error("Failed to retrieve current location", {
                  position: "top-right",
                });
              }
            );
          } else {
            setLocationPermissionGranted(false);
            toast.error("Location permission denied", {
              position: "top-right",
            });
          }
        });
    } else {
      toast.error("Geolocation permissions API not supported", {
        position: "top-right",
      });
    }
  };

  const performOTPAuthentication = () => {
    // Implement OTP authentication logic here
    // Handle OTP verification with the entered token
  };

  const performPushNotificationAuthentication = () => {
    // Implement push notification authentication logic here
    // Handle the push notification response from the user's device
  };

  const handleLocationAuthentication = (currentLocation: string) => {
    if (store.authUser?.location === currentLocation) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const onSubmitHandler: SubmitHandler<Validate5faInput> = (values) => {
    if (locationPermissionGranted && store.authUser?.location_enabled) {
      handleLocationAuthentication(currentLocation);
    } else if (store.authUser?.otp_enabled) {
      performOTPAuthentication();
    } else if (store.authUser?.push_notification_enabled) {
      performPushNotificationAuthentication();
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    setFocus("token");
  }, [setFocus]);

  useEffect(() => {
    if (!store.authUser) {
      navigate("/login");
    }
  }, []);
  
  return (
    <section className="bg-ct-blue-600 min-h-screen grid place-items-center">
      <div className="w-full">
        <h1 className="text-4xl lg:text-6xl text-center font-[600] text-ct-yellow-600 mb-4">
          Welcome Back
        </h1>
        <h2 className="text-lg text-center mb-4 text-ct-dark-200">
          Verify the Authentication Code
        </h2>
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="max-w-md w-full mx-auto overflow-hidden shadow-lg bg-ct-dark-200 rounded-2xl p-8 space-y-5"
        >
          <h2 className="text-center text-3xl font-semibold text-[#142149]">
            Five-Factor Authentication
          </h2>
          <p className="text-center text-sm">
            Open the verification app on your mobile device to get your
            verification code.
          </p>
          {store.authUser?.location_enabled && (
            <>
              <button
                type="button"
                className="text-yellow bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 focus:outline-none"
                onClick={performLocationAuthentication}
              >
                Location Authentication
              </button>
              {currentLocation && (
                <p className="text-center text-sm text-ct-dark-200">
                  Current Location: {currentLocation}
                </p>
              )}
            </>
          )}

          {store.authUser?.otp_enabled && (
            <>
              <input
                {...register("token")}
                className={styles.inputField}
                placeholder="Authentication Code"
              />
              <p className="mt-2 text-xs text-red-600">
                {errors.token ? errors.token.message : null}
              </p>
              <button
                type="submit"
                className="text-yellow bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
              >
                OTP Authentication
              </button>

              {/* Integrate the OtpAuth component here */}
              <OtpAuth />
            </>
          )}

          {store.authUser?.push_notification_enabled && (
            <button
              type="button"
              className="text-yellow bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 focus:outline-none"
              onClick={performPushNotificationAuthentication}
            >
              Push Notification Authentication
            </button>
          )}

          <span className="block text-center">
            <Link to="/login" className="text-ct-blue-600">
              Back to basic login
            </Link>
          </span>
        </form>
      </div>
    </section>
  );
};

export default Validate5faPage;
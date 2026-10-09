import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm();

  const navigateTo = useNavigate();

  async function collectFormData(formData) {
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: formData.username.trim(),
            password: formData.password
          })
        }
      );

      // Read the response safely
      const responseText = await response.text();

      let responseObject = {};

      try {
        responseObject = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        responseObject = {
          message: responseText
        };
      }

      // Debugging information
      console.log("Login status:", response.status);
      console.log("Login response:", responseObject);

      // Handle failed login
      if (!response.ok) {
        const message =
          responseObject.message ||
          (response.status === 401
            ? "Invalid username or password."
            : `Login failed (${response.status}). Please try again.`);

        toast.error(message);
        return;
      }

      // Validate successful response
      if (!responseObject.data) {
        toast.error("Invalid response received from server.");
        return;
      }

      const user = responseObject.data;

      if (!user.role) {
        toast.error("User role is missing from the server response.");
        return;
      }

      // Save logged-in user details and JWT
      localStorage.setItem("user", JSON.stringify(user));

      toast.success(responseObject.message || "Login successful!");

      // Navigate according to role
      if (user.role === "ADMIN") {
        navigateTo("/admin", { replace: true });
      } else if (user.role === "COACH") {
        navigateTo("/coach", { replace: true });
      } else if (user.role === "PLAYER") {
        navigateTo("/player", { replace: true });
      } else {
        localStorage.removeItem("user");
        toast.error("Invalid user role.");
      }

    } catch (error) {
      console.error("Login fetch error:", error);
      toast.error(
        "Unable to connect to the server. Please check your backend."
      );
    }
  }

  return (
    <div className="d-flex justify-content-center mt-5">
      <form
        className="w-25 border border-2 p-4 rounded-5 bg-white shadow"
        onSubmit={handleSubmit(collectFormData)}
      >
        <h2 className="text-center fw-bold">Login</h2>
        <hr />

        {/* Username */}
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>

          <input
            type="text"
            className={`form-control ${
              errors.username ? "is-invalid" : ""
            }`}
            id="username"
            autoComplete="username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Minimum 3 characters required"
              },
              maxLength: {
                value: 10,
                message: "Maximum 10 characters allowed"
              }
            })}
          />

          {errors.username && (
            <div className="invalid-feedback">
              {errors.username.message}
            </div>
          )}
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>

          <input
            type="password"
            className={`form-control ${
              errors.password ? "is-invalid" : ""
            }`}
            id="password"
            autoComplete="current-password"
            {...register("password", {
              required: "Password is required",
              pattern: {
                value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*]).+$/,
                message:
                  "Include letters, numbers and a special character"
              }
            })}
          />

          {errors.password && (
            <div className="invalid-feedback">
              {errors.password.message}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="btn btn-primary w-100 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion"; // For animations
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Register = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm();
  const router = useRouter();
  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      // Remove tandemID field if it exists in the form data
      const { tandemID, ...registrationData } = data;
      
      console.log('Attempting registration with:', { ...registrationData, password: '[REDACTED]' });
      
      // Call the register API with credentials option to allow cookies
      const response = await axios.post(`${apiUrl}/auth/register`, registrationData, {
        withCredentials: true // Important for cookies to be sent/received
      });
      
      console.log('Registration response:', { ...response.data, password: '[REDACTED]' });

      // If registration is successful
      if (response.data.token) {
        const token = response.data.token;
        console.log('Token received:', token.substring(0, 10) + '...');
        
        // The server already sets the HTTP-only cookie, but we can also store it in js-cookie for frontend use
        Cookies.set("token", token, { 
          expires: 30, // 30 days to match server setting
          path: '/',
          sameSite: 'lax',
          secure: window.location.protocol === 'https:' // Only use secure flag in production
        });
        
        // Store user data AND token in localStorage for quick access
        const userData = {
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role || 'user',
          token: token // Store token in localStorage too
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data saved to localStorage:', { ...userData, token: token.substring(0, 10) + '...' });
        
        toast.success("Registration successful!");

        // Set a flag in sessionStorage to prevent redirect loops
        sessionStorage.setItem('isLoggingIn', 'true');
        
        // Use direct window location change for more reliable navigation
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000); // Shorter delay to improve user experience
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Registration failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Registration error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-screen py-8 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50/30"
    >
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-gray-100"
      >
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent">
          Create Account
        </h1>
        <p className="text-gray-500 text-center mb-6">Join our language learning community</p>

        {/* Social Media Buttons */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-between space-x-2 sm:space-x-3 mb-6"
        >
          {/* Social buttons (Facebook, Apple, Google) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-2 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FaFacebook className="text-blue-600 text-lg sm:text-xl" />
            <span className="ml-1.5 text-gray-700 font-medium text-sm hidden sm:inline">Facebook</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-2 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FaApple className="text-black text-lg sm:text-xl" />
            <span className="ml-1.5 text-gray-700 font-medium text-sm hidden sm:inline">Apple</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 px-2 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FcGoogle className="text-lg sm:text-xl" />
            <span className="ml-1.5 text-gray-700 font-medium text-sm hidden sm:inline">Google</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center my-5"
        >
          <hr className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-sm font-medium">or sign up with email</span>
          <hr className="flex-grow border-t border-gray-200" />
        </motion.div>

        {/* Form for Registration Fields */}
        <motion.form
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3"
        >
          {/* Full Name Field */}
          <Controller
            name="name"
            control={control}
            defaultValue=""
            rules={{
              required: "Full Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your full name"
                className={`w-full border-2 ${
                  errors.name ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.name && (
            <p className="text-red-500 text-sm ml-1">{errors.name.message}</p>
          )}

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Your email"
                className={`w-full border-2 ${
                  errors.email ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.email && (
            <p className="text-red-500 text-sm ml-1">{errors.email.message}</p>
          )}

          {/* Password Field */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Your password"
                className={`w-full border-2 ${
                  errors.password ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm ml-1">{errors.password.message}</p>
          )}

          {/* Confirm Password Field */}
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: "Confirm Password is required",
              validate: (value) =>
                value === password || "Passwords do not match",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="password"
                placeholder="Confirm password"
                className={`w-full border-2 ${
                  errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm ml-1">
              {errors.confirmPassword.message}
            </p>
          )}

          {/* Country Field */}
          <Controller
            name="country"
            control={control}
            defaultValue=""
            rules={{ required: "Country is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Country"
                className={`w-full border-2 ${
                  errors.country ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.country && (
            <p className="text-red-500 text-sm ml-1">{errors.country.message}</p>
          )}

          {/* Date of Birth Field */}
          <Controller
            name="dateOfBirth"
            control={control}
            defaultValue=""
            rules={{ required: "Date of Birth is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="date"
                placeholder="Date of Birth"
                className={`w-full border-2 ${
                  errors.dateOfBirth ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-sm ml-1">{errors.dateOfBirth.message}</p>
          )}

          {/* Location Field */}
          <Controller
            name="location"
            control={control}
            defaultValue=""
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your city/location"
                className={`w-full border-2 ${
                  errors.location ? "border-red-400 bg-red-50" : "border-gray-200 bg-gray-50"
                } rounded-xl p-3.5 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.location && (
            <p className="text-red-500 text-sm ml-1">{errors.location.message}</p>
          )}

          {/* No Tandem ID field - removed */}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary py-4 text-lg font-semibold mt-4"
          >
            Create Account
          </motion.button>
        </motion.form>

        {/* Already have an account? */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#074C77] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Register;

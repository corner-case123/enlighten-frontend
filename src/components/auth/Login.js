"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { FaApple, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { motion } from "framer-motion";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    try {
      console.log('Attempting login with:', { email: data.email });
      
      // Call the login API with credentials option to allow cookies
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email: data.email,
        password: data.password,
      }, {
        withCredentials: true // Important for cookies to be sent/received
      });
      
      console.log('Login response:', { ...response.data, password: '[REDACTED]' });

      // If login is successful
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
          role: response.data.role,
          token: token // Store token in localStorage too
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data saved to localStorage:', { ...userData, token: token.substring(0, 10) + '...' });
        
        toast.success("Login successful!");

        // Set a flag in sessionStorage to prevent redirect loops
        sessionStorage.setItem('isLoggingIn', 'true');
        
        // Use direct window location change for more reliable navigation
        setTimeout(() => {
          window.location.href = '/profile';
        }, 1000); // Shorter delay to improve user experience
      } else {
        toast.error("Login failed. Please try again.");
      }
    } catch (error) {
      // Handle errors
      if (error.response) {
        toast.error(
          error.response.data.message || "Login failed. Please try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Login error:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex justify-center items-center min-h-[80vh] px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="bg-white/80 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100"
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-bold text-center mb-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] bg-clip-text text-transparent"
        >
          Welcome Back
        </motion.h1>
        <p className="text-gray-500 text-center mb-8">Sign in to continue learning</p>

        {/* Social Media Buttons */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="space-y-3 mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FaFacebook className="text-blue-600 mr-3 text-xl" />
            <span className="text-gray-700 font-medium">Continue with Facebook</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FaApple className="text-black mr-3 text-xl" />
            <span className="text-gray-700 font-medium">Continue with Apple</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center bg-white border border-gray-200 rounded-xl py-3 hover:border-[#074c77] hover:shadow-md active:opacity-40 transition-all duration-200"
          >
            <FcGoogle className="text-red-500 mr-3 text-xl" />
            <span className="text-gray-700 font-medium">Continue with Google</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center my-6"
        >
          <hr className="flex-grow border-t border-gray-200" />
          <span className="mx-4 text-gray-400 text-sm font-medium">or continue with email</span>
          <hr className="flex-grow border-t border-gray-200" />
        </motion.div>

        {/* Form for Email and Password */}
        <motion.form
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
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
                } rounded-xl p-4 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
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
                } rounded-xl p-4 focus:outline-none focus:border-[#074C77] focus:bg-white transition-all duration-200`}
              />
            )}
          />
          {errors.password && (
            <p className="text-red-500 text-sm ml-1">{errors.password.message}</p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full btn-primary py-4 text-lg font-semibold mt-2"
          >
            Log in
          </motion.button>
        </motion.form>
      </motion.div>
    </motion.div>
  );
};

export default Login;

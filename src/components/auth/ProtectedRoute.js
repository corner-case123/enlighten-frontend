"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchLoggedInUser } from "@/features/user/userSlice";
import Loading from "@/components/ui/Loading";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Check if we're in the process of logging in (to prevent redirect loops)
        const isLoggingIn = sessionStorage.getItem('isLoggingIn');
        if (isLoggingIn === 'true') {
          console.log('Login in progress, skipping verification');
          sessionStorage.removeItem('isLoggingIn');
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check for token in both js-cookie and localStorage as fallback
        const token = Cookies.get("token") || 
                     (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
        
        console.log('Token found:', !!token); // Log if token exists
        
        if (!token) {
          console.log("No token found in cookies or localStorage");
          throw new Error("No token found");
        }

        // Verify token with the server
        // First, validate that the token is properly formatted to avoid malformed JWT errors
        if (!token || token === 'undefined' || token === 'null') {
          console.log('Invalid token format detected, skipping server verification');
          throw new Error('Invalid token format');
        }
        
        console.log('Verifying token with server...');
        const response = await axios.get(`${apiUrl}/auth/verify/login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Important for cookies
        });

        if (response.data.success) {
          console.log("Authentication successful");
          setIsAuthenticated(true);
          // Load user data into Redux store
          await dispatch(fetchLoggedInUser());
        } else {
          console.log("Authentication failed: server returned unsuccessful response");
          throw new Error("Authentication failed");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        
        // Clear any invalid tokens with proper settings
        Cookies.remove("token", { 
          path: "/",
          domain: window.location.hostname === 'localhost' ? 'localhost' : undefined,
          sameSite: 'lax'
        });
        
        // Clear localStorage
        localStorage.removeItem("user");
        
        // Set loading to false before redirect
        setIsLoading(false);
        setIsAuthenticated(false);
        
        // Use a small delay before redirect to ensure state is updated
        setTimeout(() => {
          // Redirect to login using direct window location for more reliable navigation
          window.location.href = "/login";
        }, 100);
        
        return; // Stop execution after redirect
      } finally {
        // Only set loading to false if we haven't already in the catch block
        if (isLoading) {
          setIsLoading(false);
        }
      }
    };

    verifyAuth();
  }, [dispatch, router]);

  if (isLoading) {
    return <Loading />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;

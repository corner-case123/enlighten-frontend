"use client";
import UserMenu from "@/components/ui/UserMenu";
import { useLanguage } from "@/context/LanguageContext";
import { fetchLoggedInUser } from "@/features/user/userSlice";
import { fetchProfile } from "@/features/user/profileSlice";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import getToken from "./getToken";
import { resetProfile } from "@/features/user/profileSlice";
import { logout } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";

const privet = ["/login", "/sign-up", "/forgot-password", "/reset-password"];

const Navbar = () => {
  const { t } = useLanguage();
  const pathName = usePathname();
  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const fetchData = async () => {
        try {
          const userResult = await dispatch(fetchLoggedInUser()).unwrap();
          console.log("User data fetched:", userResult);
          const profileResult = await dispatch(fetchProfile()).unwrap();
          console.log("Profile data fetched:", profileResult);
        } catch (err) {
          console.error("Error fetching user data:", err);
          // Remove the token if it's invalid, expired, or user is deleted
          Cookies.remove("token");
          // Clear Redux state
          dispatch(resetProfile());
          dispatch(logout());
          // Redirect to login if not already there
          if (!privet.some((privetPath) => pathName.includes(privetPath))) {
            router.replace("/login");
          }
        }
      };
      fetchData();
    }
  }, [dispatch, pathName]); // Add pathName as a dependency

  const navList = [
    { name: t("nav.findPartner"), url: "community" },
    { name: t("nav.chat"), url: "chat" },
    { name: t("nav.blog"), url: "blog" },
    { name: "Learn", url: "learning" },
  ];

  const [isSticky, setIsSticky] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 8);
      setIsScrolled(window.scrollY > 8);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathName]);

  const isPrivatePath = privet.some((privetPath) =>
    pathName.includes(privetPath)
  );

  const textColorClass =
    pathName === "/blog" && !isScrolled ? "text-white" : "text-gray-100";

  if (loading) {
    return (
      <div className="w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
        <div className="max-w-[1440px] mx-auto flex justify-center items-center px-4 py-4">
          <div className="animate-shimmer h-8 w-32 rounded-lg bg-gray-700"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`w-full z-50 transition-all duration-200 ${
        pathName === "/blog" ? "fixed my-0" : "sticky"
      } ${isSticky 
        ? "bg-gray-900/90 backdrop-blur-xl shadow-2xl shadow-black/20 border-b border-gray-700/30" 
        : "bg-gray-900/50 backdrop-blur-lg"
      } ${
        pathName === "/dashboard" && "hidden"
      }`}
      style={{ top: pathName === "/blog" ? "-16px" : "0px" }}
    >
      <div className="max-w-[1440px] mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8 py-3">
        {/* Logo */}
        <Link href={"/"}>
          <div className="flex items-center space-x-3 z-20 group cursor-pointer">
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100&h=40&fit=crop&auto=format&q=80"
                width={50}
                height={50}
                alt="Enlighten Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3"
                priority
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#074C77]/20 to-[#0a6ba8]/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className={`${textColorClass} font-bold text-xl sm:text-2xl tracking-tight transition-all duration-200 group-hover:text-white`}>
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent group-hover:from-[#074C77] group-hover:to-[#0a6ba8]">
                Enlighten
              </span>
            </h2>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isPrivatePath && (
          <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
            {navList.map((item, index) => (
              <Link
                href={`/${item.url}`}
                key={item.name}
                className="group relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <p className={`nav-link text-base font-medium transition-all duration-200 hover:scale-105 ${
                  pathName.includes(item.url) ? 'text-[#074C77]' : 'text-gray-300 hover:text-white'
                }`}>
                  {item.name}
                </p>
                {pathName.includes(item.url) && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] rounded-full animate-fade-in-scale"></span>
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden z-20 p-2.5 rounded-xl hover:bg-gray-800/50 transition-all duration-150 active:scale-95 group"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-200 group-hover:bg-[#074C77] ${mobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white mb-1.5 transition-all duration-200 group-hover:bg-[#074C77] ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-6 h-0.5 bg-white transition-all duration-200 group-hover:bg-[#074C77] ${mobileMenuOpen ? 'transform -rotate-45' : ''}`}></div>
        </button>

        {/* Auth Buttons or User Menu (Desktop) */}
        {!loading && (
          <div className="hidden md:block">
            {!currentUser ? (
              <div className="flex items-center space-x-4">
                {pathName !== "/login" && (
                  <Link href={"/login"}>
                    <button className="btn-ghost text-sm lg:text-base py-2.5 px-6 lg:px-8 transition-all duration-150 active:scale-95">
                      {t("loginButton")}
                    </button>
                  </Link>
                )}
                {pathName !== "/sign-up" && (
                  <Link href={"/sign-up"}>
                    <button className="btn-primary text-sm lg:text-base py-2.5 px-6 lg:px-8 transition-all duration-150 active:scale-95">
                      {t("signupButton")}
                    </button>
                  </Link>
                )}
              </div>
            ) : (
              <UserMenu />
            )}
          </div>
        )}

        {/* Mobile Menu (Slide-in) */}
        <div 
          ref={menuRef}
          className={`fixed top-0 right-0 h-screen w-[80%] sm:w-[70%] bg-gray-900/95 backdrop-blur-xl shadow-2xl border-l border-gray-700/50 transform transition-all duration-200 ease-out z-10 ${mobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
        >
          <div className="flex flex-col h-full pt-24 px-8 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#074C77]/10 to-[#0a6ba8]/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-[#407023]/10 to-[#5a9e32]/10 rounded-full blur-2xl"></div>
            
            {/* Mobile Navigation Links */}
            {!isPrivatePath && (
              <div className="flex flex-col space-y-6 border-b border-gray-700/50 pb-8 relative z-10">
                {navList.map((item, index) => (
                  <Link
                    href={`/${item.url}`}
                    key={item.name}
                    className="text-gray-300 text-lg font-medium hover:text-white transition-all duration-200 flex items-center group animate-slide-in-left"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#074C77] to-[#0a6ba8] mr-4 opacity-0 group-hover:opacity-100 transition-all duration-200 group-hover:scale-150"></span>
                    <span className="group-hover:translate-x-2 transition-transform duration-200">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}

            {/* Mobile Auth Buttons */}
            {!loading && (
              <div className="mt-8 relative z-10">
                {!currentUser ? (
                  <div className="flex flex-col space-y-4">
                    {pathName !== "/login" && (
                      <Link href={"/login"} className="w-full animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <button className="w-full text-gray-300 border-2 border-gray-600 hover:border-[#074C77] py-3 px-4 rounded-xl font-medium hover:bg-[#074C77]/10 hover:text-white transition-all duration-200">
                          {t("loginButton")}
                        </button>
                      </Link>
                    )}
                    {pathName !== "/sign-up" && (
                      <Link href={"/sign-up"} className="w-full animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                        <button className="w-full btn-primary">
                          {t("signupButton")}
                        </button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="mt-4 border-t border-gray-700/50 pt-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                    <p className="text-gray-400 mb-4 text-sm">Logged in as:</p>
                    <div className="md:hidden">
                      <UserMenu isMobile={true} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0 transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;

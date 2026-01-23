import React from "react";
import {
  FaInstagram,
  FaFacebookF,
  FaTwitter,
  FaTiktok,
  FaYoutube,
  FaVk,
} from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <footer className="bg-gradient-to-br from-[#1a1a1a] to-[#2d2d2d] text-gray-300 py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 sm:gap-10 text-sm">
            {/* Useful Information */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 sm:mb-5 relative inline-block">
                Useful Information
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#074C77] to-[#0a6ba8]"></span>
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Language Certificates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Become an Ambassador
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Press
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Language Exchange
                  </a>
                </li>
              </ul>
            </div>

            {/* Local Tandems */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 sm:mb-5 relative inline-block">
                Local Enlighten
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#074C77] to-[#0a6ba8]"></span>
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Berkeley
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Brisbane
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Chicago
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Edinburgh
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Houston
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Melbourne
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    New York
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    San Diego
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Seattle
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Toronto
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4 sm:mb-5">&nbsp;</h3>{" "}
              {/* Placeholder for alignment */}
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Birmingham
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Cambridge
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Dublin
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Glasgow
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    London
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Montreal
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Nottingham
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    San Francisco
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Sydney
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Vancouver
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 sm:mb-5 relative inline-block">
                Legal
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#074C77] to-[#0a6ba8]"></span>
              </h3>
              <ul className="space-y-2.5 sm:space-y-3">
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Legal Information
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white hover:pl-1 transition-all duration-200">
                    Privacy
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <h3 className="text-white text-sm font-semibold mb-2">Gazipur Office</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  North Str. 310
                  <br />
                  Gazipur
                  <br />
                  Bangladesh
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-white text-sm font-semibold mb-2">Dhanmondi Office</h3>
                <p className="text-sm leading-relaxed text-gray-400">
                  24/25, Green Rd
                  <br />
                  Dhanmondi
                  <br />
                  Bangladesh
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-white text-lg font-bold mb-4 sm:mb-5 relative inline-block">
                Social Media
                <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-gradient-to-r from-[#074C77] to-[#0a6ba8]"></span>
              </h3>
              <div className="flex space-x-3 text-lg">
                <a href="https://instagram.com" target="_blank" className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#074C77] hover:to-[#0a6ba8] hover:text-white transition-all duration-300">
                  <FaInstagram />
                </a>
                <a href="https://facebook.com" target="_blank" className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#074C77] hover:to-[#0a6ba8] hover:text-white transition-all duration-300">
                  <FaFacebookF />
                </a>
                <a href="https://twitter.com" target="_blank" className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#074C77] hover:to-[#0a6ba8] hover:text-white transition-all duration-300">
                  <FaTwitter />
                </a>
                <a href="https://tiktok.com" target="_blank" className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#074C77] hover:to-[#0a6ba8] hover:text-white transition-all duration-300">
                  <FaTiktok />
                </a>
                <a href="https://youtube.com" target="_blank" className="w-10 h-10 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 hover:bg-gradient-to-r hover:from-[#074C77] hover:to-[#0a6ba8] hover:text-white transition-all duration-300">
                  <FaYoutube />
                </a>
              </div>
              <div className="mt-6 flex space-x-3">
                <img
                  src="/google.webp"
                  alt="Google Play"
                  className="h-10 rounded-lg hover:opacity-80 transition-opacity duration-200"
                />
                <img
                  src="/apple.webp"
                  alt="App Store"
                  className="h-10 rounded-lg hover:opacity-80 transition-opacity duration-200"
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="text-center py-5 px-4 bg-gradient-to-r from-[#111] via-[#1a1a1a] to-[#111] border-t border-gray-800">
        <p className="text-sm text-gray-400">© 2025 Enlighten - Speak Any Language.</p>
        <p className="text-xs mt-1 text-gray-500">Enlighten - Mobile Language Exchange is licensed by Enlighten Foundation</p>
      </div>
    </>
  );
};

export default Footer;

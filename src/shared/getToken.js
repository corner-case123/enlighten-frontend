import Cookies from "js-cookie";

// Helper function to get token from both cookies and localStorage
const getToken = () => {
  const token = Cookies.get("token") || 
              (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
  return token;
};

export default getToken;

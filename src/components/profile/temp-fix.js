// Replace this in the handlePhotoUpload function:

// Use the getToken helper function to get the token from both sources
const token = getToken();
console.log('Photo upload - token found:', !!token);

if (!token) {
  throw new Error("No token found. Please log in again.");
}

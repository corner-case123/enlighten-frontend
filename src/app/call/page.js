"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const CallPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get URL parameters
    const roomID = searchParams.get("roomID");
    const userID = searchParams.get("userID");
    const userName = searchParams.get("userName") || "User";
    const isVideoCall = searchParams.get("isVideoCall") === "true";

    if (!roomID || !userID) {
      setError("Missing required call parameters");
      setTimeout(() => router.push("/chat"), 2000);
      return;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      setError("No internet connection. Please check your network and try again.");
      setTimeout(() => router.push("/chat"), 2000);
      return;
    }

    // Set loading to false after a short delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);

    // Handle user leaving the call
    const handleBeforeUnload = () => {
      router.push("/chat");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [searchParams, router]);

  // Handle call end
  const handleEndCall = () => {
    router.push("/chat");
  };

  if (error) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <p className="text-xl mb-4">{error}</p>
        <p>Redirecting to chat...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        <p className="text-xl mb-2">Preparing video call...</p>
        <p className="text-sm text-gray-400">This may take a moment</p>
      </div>
    );
  }

  // Get URL parameters for the iframe
  const roomID = searchParams.get("roomID");
  const userName = searchParams.get("userName") || "User";
  
  // Create a unique room name based on the roomID
  const roomName = `language-exchange-${roomID.replace(/[^a-zA-Z0-9]/g, "-")}`;
  
  // Build the Jitsi Meet URL with parameters
  const jitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName="${encodeURIComponent(userName)}"&config.prejoinPageEnabled=false&config.startWithVideoMuted=false&config.startWithAudioMuted=false`;

  return (
    <div className="h-screen flex flex-col bg-black">
      <div className="flex justify-between items-center p-3 bg-gray-800 text-white">
        <div className="text-lg font-semibold">Enlighten Call</div>
        <button 
          onClick={handleEndCall}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          End Call
        </button>
      </div>
      
      <div className="flex-grow">
        <iframe
          src={jitsiUrl}
          allow="camera; microphone; fullscreen; display-capture; autoplay"
          className="w-full h-full border-none"
          style={{ height: 'calc(100vh - 56px)' }}
        ></iframe>
      </div>
    </div>
  );
};

export default CallPage;

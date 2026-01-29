"use client";
import React, { useState, useEffect, useMemo, useCallback, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AiTwotoneEdit } from "react-icons/ai";
import Cookies from "js-cookie";
import {
  fetchProfile,
  updateProfile,
  resetProfile,
} from "@/features/user/profileSlice";
import { fetchLoggedInUser, logout } from "@/features/user/userSlice";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import Image from "next/image";

// Define API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

// Configure axios for this component
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = getToken();
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Helper function to get token from both cookies and localStorage
const getToken = () => {
  const token = Cookies.get("token") || 
              (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null);
  return token;
};

// Add the default avatar URL at the top with other constants
const defaultAvatar =
  "https://imgs.search.brave.com/m12gFeEaYTH9TW9JHo1E4K4UFZBIAGpFdv-O_jdbty0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzQ2LzgzLzk2/LzM2MF9GXzM0Njgz/OTY4M182bkFQemJo/cFNrSXBiOHBtQXd1/ZmtDN2M1ZUQ3d1l3/cy5qcGc";

const ProfileForm = () => {
  const dispatch = useDispatch();
  const { profile, status, error } = useSelector((state) => state.profile);
  const { currentUser } = useSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("About me");
  const [formData, setFormData] = useState({
    // About Me
    name: "",
    dateOfBirth: "",
    location: "",
    description: "",
    about: "",
    partnerPreference: "",
    learningGoals: "",

    // Languages
    nativeLanguage: "",
    fluentLanguage: "",
    learningLanguage: "",
    translateLanguage: "",

    // Learning Preferences
    communication: "Not set",
    timeCommitment: "Not set",
    learningSchedule: "Not set",
    correctionPreference: "Not set",

    // Topics
    topics: ["Life"],
    newTopic: "",

    // Settings
    showLocation: true,
    notifications: true,

    // Following
    followingTab: "Following",

    // Profile Picture
    profilePicture: "",

    // Photos
    photos: [],
  });

  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [blocked, setBlocked] = useState([]);
  const [unblockLoading, setUnblockLoading] = useState({});
  const [socialDataLoading, setSocialDataLoading] = useState(false);
  const [socialDataLoaded, setSocialDataLoaded] = useState(false);

  // Fetch profile and user data on component mount with parallel loading
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load critical data in parallel for better performance
        await Promise.all([
          dispatch(fetchLoggedInUser()).unwrap(),
          dispatch(fetchProfile()).unwrap()
        ]);
      } catch (err) {
        console.error("Error fetching data:", err);
        toast.error("Failed to load profile data");
      }
    };
    fetchData();
  }, [dispatch]);

  // Populate form data with fetched profile and user data
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        dateOfBirth: profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        location: profile.location || "",
        description: profile.description || "",
        about: profile.about || "",
        partnerPreference: profile.partnerPreference || "",
        learningGoals: profile.learningGoals || "",
        nativeLanguage: profile.nativeLanguage || "",
        fluentLanguage: profile.fluentLanguage || "",
        learningLanguage: profile.learningLanguage || "",
        translateLanguage: profile.translateLanguage || "",
        communication: profile.communication || "Not set",
        timeCommitment: profile.timeCommitment || "Not set",
        learningSchedule: profile.learningSchedule || "Not set",
        correctionPreference: profile.correctionPreference || "Not set",
        topics: profile.topics || ["Life"],
        showLocation: profile.showLocation ?? true,
        showTandemID: profile.showTandemID ?? true,
        notifications: profile.notifications ?? true,
        profilePicture: profile.profilePicture || defaultAvatar,
        photos: profile.photos || [],
      }));
    }
  }, [profile]);

  // Lazy load social data only when needed
  const fetchSocialData = useCallback(async () => {
    if (socialDataLoaded || socialDataLoading) return;
    
    setSocialDataLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No authentication token');

      // Load all social data in parallel for better performance
      const [myProfileResponse, followersResponse, blockedResponse] = await Promise.all([
        axiosInstance.get("/profile/me"),
        axiosInstance.get("/profile/followers"),
        axiosInstance.get("/profile/blocked")
      ]);

      const myProfileData = myProfileResponse.data;

      // Process following users - batch request instead of individual calls
      if (myProfileData?.following && Array.isArray(myProfileData.following) && myProfileData.following.length > 0) {
        try {
          // Use batch endpoint if available, otherwise limit to first 10 for performance
          const limitedFollowing = myProfileData.following.slice(0, 10);
          const followingPromises = limitedFollowing.map(async (userId) => {
            try {
              const response = await axiosInstance.get(`/profile/${userId}`);
              if (response.data?.profile) {
                const profileData = response.data.profile;
                return {
                  userId: profileData.userId,
                  name: profileData.name,
                  location: profileData.location,
                  profilePicture: profileData.profilePicture,
                  _id: profileData._id,
                };
              }
              return null;
            } catch (error) {
              console.warn(`Failed to fetch profile for user ${userId}`);
              return null;
            }
          });

          const followingProfiles = (await Promise.allSettled(followingPromises))
            .filter(result => result.status === 'fulfilled' && result.value)
            .map(result => result.value);
          
          setFollowing(followingProfiles);
        } catch (error) {
          console.error('Error processing following data:', error);
          setFollowing([]);
        }
      }

      // Process followers
      if (Array.isArray(followersResponse.data)) {
        const validFollowers = followersResponse.data
          .filter(follower => follower && follower.userId)
          .map(follower => ({
            userId: follower.userId,
            name: follower.name || "Anonymous User",
            location: follower.location || "unknown",
            profilePicture: follower.profilePicture,
            _id: follower._id || follower.userId,
          }));
        setFollowers(validFollowers);
      }

      // Process blocked users
      if (Array.isArray(blockedResponse.data)) {
        const validBlockedUsers = blockedResponse.data
          .filter(user => user && user.userId)
          .map(user => ({
            userId: user.userId,
            name: user.name || "Anonymous User",
            location: user.location || "unknown",
            profilePicture: user.profilePicture,
            _id: user._id || user.userId,
          }));
        setBlocked(validBlockedUsers);
      }

      setSocialDataLoaded(true);
    } catch (error) {
      console.error("Error fetching social data:", error);
      toast.error("Failed to load social connections");
      setFollowing([]);
      setFollowers([]);
      setBlocked([]);
    } finally {
      setSocialDataLoading(false);
    }
  }, [socialDataLoaded, socialDataLoading]);

  // Only load social data when user switches to Following tab
  useEffect(() => {
    if (activeTab === "Following" && !socialDataLoaded) {
      fetchSocialData();
    }
  }, [activeTab, fetchSocialData, socialDataLoaded]);

  // Add the fetchBlockedUsers function
  const fetchBlockedUsers = async () => {
    try {
      const response = await axiosInstance.get("/profile/blocked");
      // Add debugging for blocked users
      console.log("Blocked users response:", response.data);
      if (response.data && response.data.length > 0) {
        console.log("First blocked user data structure:", JSON.stringify(response.data[0], null, 2));
      }
      
      if (Array.isArray(response.data)) {
        const validBlockedUsers = response.data
          .filter((user) => user && user.userId)
          .map((user) => {
            // Create a new object with the desired structure
            const transformedUser = {
              userId: user.userId,
              name: user.name || "Anonymous User",
              // If location exists, use it; otherwise use tandemID; if neither exists, use "unknown"
              location: user.location || "unknown",
              profilePicture: user.profilePicture,
              _id: user._id || user.userId,
            };
            
            // Remove tandemID property if it exists to ensure it's not used elsewhere
            delete user.tandemID;
            
            return transformedUser;
          });
        console.log("Setting blocked users:", validBlockedUsers);
        setBlocked(validBlockedUsers);
      } else {
        setBlocked([]);
      }
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      toast.error("Failed to fetch blocked users");
      setBlocked([]);
    }
  };

  const handleUnblock = async (userId) => {
    setUnblockLoading((prev) => ({ ...prev, [userId]: true }));
    try {
      await axiosInstance.post(`/profile/unblock/${userId}`);
      toast.success("User unblocked successfully");
      // Refresh the blocked users list
      await fetchBlockedUsers();
      // Also refresh the profile data to ensure all lists are up to date
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Error unblocking user:", error);
      toast.error("Failed to unblock user");
    } finally {
      setUnblockLoading((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const menuItems = [
    { label: "About me" },
    { label: "Languages" },
    { label: "Learning Preferences" },
    { label: "Topics" },
    { label: "Following" },
    { label: "Settings" },
    { label: "Visitors" },
    { label: "Log out" },
  ];

  const handleSave = async () => {
    setIsLoading(true);
    setSaveError(null);
    setSuccessMessage("");

    try {
      const token = getToken();
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      await dispatch(updateProfile(formData)).unwrap();
      setSuccessMessage("Profile saved successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveError(
        error.message || "An error occurred while saving the profile."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize expensive computations and callbacks for better performance
  const displayTabs = useMemo(() => [
    "About me",
    "Languages", 
    "Learning Preferences",
    "Topics",
    "Settings",
    "Following"
  ], []);

  const isFormValid = useMemo(() => {
    return formData.name.trim().length > 0;
  }, [formData.name]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const ToggleSwitch = ({ isOn, handleToggle }) => (
    <div
      className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
        isOn ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] shadow-lg shadow-[#074C77]/30" : "bg-gray-600"
      }`}
      onClick={handleToggle}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
          isOn ? "transform translate-x-6" : ""
        }`}
      />
    </div>
  );

  const handleAddTopic = () => {
    if (formData.newTopic.trim()) {
      setFormData((prev) => ({
        ...prev,
        topics: [...prev.topics, prev.newTopic.trim()],
        newTopic: "",
      }));
    }
  };

  const handleRemoveTopic = (topicToRemove) => {
    setFormData((prev) => ({
      ...prev,
      topics: prev.topics.filter((topic) => topic !== topicToRemove),
    }));
  };

  const handleMenuItemClick = async (label) => {
    if (label === "Log out") {
      try {
        await dispatch(logout()).unwrap();
        toast.success("Logged out successfully");
        router.push("/login");
      } catch (error) {
        toast.error(error.message || "Failed to logout");
      }
    } else {
      setActiveTab(label);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch(
        "http://localhost:8080/api/auth/delete-account",
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete account");
      }

      // Clear Redux state
      dispatch(resetProfile());
      dispatch(logout());

      // Clear token and other local storage/cookies
      Cookies.remove("token");
      localStorage.clear();

      toast.success("Account deleted successfully");

      // Use replace instead of push to prevent going back to the profile
      router.replace("/login");
    } catch (error) {
      console.error("Delete account error:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "About me":
        return (
          <div className="space-y-6">
            <div className="flex items-end mb-10">
              <div className="relative">
                <Image
                  src={
                    formData.profilePicture && formData.profilePicture.trim() !== ''
                      ? formData.profilePicture.startsWith('http')
                        ? formData.profilePicture
                        : `http://localhost:8080${formData.profilePicture}`
                      : defaultAvatar
                  }
                  alt="Profile"
                  width={176}
                  height={176}
                  className="rounded-full w-44 h-44 object-cover border-4 border-[#074C77]/50 shadow-2xl shadow-black/20"
                  priority
                  unoptimized
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <label
                  htmlFor="profile-picture-input"
                  className="absolute bottom-2 right-2 bg-gradient-to-r from-[#074C77] to-[#0a6ba8] p-3 rounded-full shadow-lg cursor-pointer hover:from-[#0a6ba8] hover:to-[#074C77] transition-all duration-300 hover:scale-110"
                >
                  <AiTwotoneEdit size={20} className="text-white" />
                </label>
                <input
                  id="profile-picture-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePictureChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {saveError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl relative backdrop-blur-sm">
                {saveError}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl relative backdrop-blur-sm">
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <FormField
                label="Name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
              <FormField
                label="Date of Birth"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  handleInputChange("dateOfBirth", e.target.value)
                }
                required
              />
              <FormField
                label="Location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
              <TextAreaField
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe yourself"
              />
            </div>

            <div className="space-y-6 mt-8">
              <TextAreaField
                label="What do you like to talk about?"
                value={formData.about}
                onChange={(e) => handleInputChange("about", e.target.value)}
              />
              <TextAreaField
                label="What's your ideal language exchange partner like?"
                value={formData.partnerPreference}
                onChange={(e) =>
                  handleInputChange("partnerPreference", e.target.value)
                }
              />
              <TextAreaField
                label="What are your language learning goals?"
                value={formData.learningGoals}
                onChange={(e) =>
                  handleInputChange("learningGoals", e.target.value)
                }
              />
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Photos</h3>
              <div className="grid grid-cols-5 gap-4">
                {formData.photos &&
                  formData.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square">
                      <div className="absolute inset-0 rounded-lg overflow-hidden">
                        <Image
                          src={photo && photo.trim() !== ''
                            ? photo.startsWith('http')
                              ? photo
                              : `http://localhost:8080${photo}`
                            : defaultAvatar
                          }
                          alt={`Photo ${index + 1}`}
                          width={120}
                          height={120}
                          className="w-full h-full object-contain bg-gray-100"
                          loading={index > 2 ? "lazy" : "eager"}
                          unoptimized
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                        <button
                          onClick={() => handleDeletePhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                {(!formData.photos || formData.photos.length < 5) && (
                  <div className="aspect-square relative">
                    <label className="absolute inset-0 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                        multiple={true}
                        disabled={isLoading}
                      />
                      <span className="text-gray-400 text-xl">+</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "Languages":
        return (
          <div className="space-y-6">
            <LanguageFormSection
              title="I am native in"
              value={formData.nativeLanguage}
              onChange={(e) =>
                handleInputChange("nativeLanguage", e.target.value)
              }
            />
            <LanguageFormSection
              title="I am fluent in"
              value={formData.fluentLanguage}
              onChange={(e) =>
                handleInputChange("fluentLanguage", e.target.value)
              }
            />
            <LanguageFormSection
              title="I am learning"
              value={formData.learningLanguage}
              onChange={(e) =>
                handleInputChange("learningLanguage", e.target.value)
              }
            />
            <div className="border-b py-4">
              <h3 className="font-semibold text-lg mb-4">
                Translate incoming messages to
              </h3>
              <select
                value={formData.translateLanguage}
                onChange={(e) =>
                  handleInputChange("translateLanguage", e.target.value)
                }
                className="w-full p-2 border rounded-lg"
              >
                <option value="">No languages selected</option>
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Chinese">Chinese</option>
              </select>
            </div>
          </div>
        );

      case "Learning Preferences":
        return (
          <div className="space-y-6">
            <PreferenceField
              title="Communication"
              value={formData.communication}
              onChange={(e) =>
                handleInputChange("communication", e.target.value)
              }
              options={["Text Chat", "Voice Messages", "Video Calls"]}
            />
            <PreferenceField
              title="Time Commitment"
              value={formData.timeCommitment}
              onChange={(e) =>
                handleInputChange("timeCommitment", e.target.value)
              }
              options={["1-2 hours/week", "3-5 hours/week", "5+ hours/week"]}
            />
            <PreferenceField
              title="Learning Schedule"
              value={formData.learningSchedule}
              onChange={(e) =>
                handleInputChange("learningSchedule", e.target.value)
              }
              options={["Morning", "Afternoon", "Evening", "Flexible"]}
            />
            <PreferenceField
              title="Correction Preference"
              value={formData.correctionPreference}
              onChange={(e) =>
                handleInputChange("correctionPreference", e.target.value)
              }
              options={[
                "Correct me immediately",
                "Correct me after conversation",
                "Only when asked",
              ]}
            />
          </div>
        );

      case "Topics":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg">Topics</h3>
              <div className="flex items-center gap-2">
                <input
                  value={formData.newTopic}
                  onChange={(e) =>
                    handleInputChange("newTopic", e.target.value)
                  }
                  className="border rounded-lg px-3 py-1 w-48"
                  placeholder="New topic"
                />
                <button
                  onClick={handleAddTopic}
                  className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Add
                </button>
              </div>
            </div>
            <div className="border-t pt-4">
              {formData.topics.map((topic) => (
                <div
                  key={topic}
                  className="flex justify-between items-center py-2 border-b"
                >
                  <span className="text-gray-700">{topic}</span>
                  <button
                    onClick={() => handleRemoveTopic(topic)}
                    className="text-red-500 hover:text-red-700 text-xl"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case "Following":
        return (
          <div className="space-y-6">
            <div className="flex border-b border-gray-700/50 bg-gray-800/30 rounded-t-2xl">
              {["Following", "Followers", "Blocked"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleInputChange("followingTab", tab)}
                  className={`px-6 py-4 font-medium rounded-t-2xl transition-all duration-300 ${
                    formData.followingTab === tab
                      ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white shadow-lg shadow-[#074C77]/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="py-6">
              {formData.followingTab === "Following" &&
                renderFollowList(following)}
              {formData.followingTab === "Followers" &&
                renderFollowList(followers)}
              {formData.followingTab === "Blocked" && renderFollowList(blocked)}
            </div>
          </div>
        );

      case "Settings":
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Privacy</h3>
              <ToggleSection
                label="Show my location"
                checked={formData.showLocation}
                onChange={() =>
                  handleInputChange("showLocation", !formData.showLocation)
                }
              />
              {/* Show Tandem ID toggle removed */}
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Notifications</h3>
              <ToggleSection
                label="Receive notifications for messages or calls"
                checked={formData.notifications}
                onChange={() =>
                  handleInputChange("notifications", !formData.notifications)
                }
              />
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Download your data</h3>
              <p className="text-gray-300 mb-4 leading-relaxed">
                You can download your Enlighten personal data here.
              </p>
              <a
                href="mailto:enlighten@gmail.com?subject=Request for Enlighten personal data"
                className="inline-block bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white px-6 py-3 rounded-2xl hover:from-[#0a6ba8] hover:to-[#074C77] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#074C77]/30"
              >
                Request data
              </a>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-red-500">
                Account Actions
              </h3>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => handleMenuItemClick("Log out")}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 w-full"
                >
                  Log Out
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="border border-red-500 text-red-500 px-4 py-2 rounded-lg hover:bg-red-50 w-full"
                >
                  Delete Account
                </button>
              </div>
            </div>

            {/* Delete Account Confirmation Dialog */}
            {showDeleteConfirm && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="glass-card p-8 rounded-3xl max-w-md w-full mx-4 shadow-2xl shadow-black/40">
                  <h3 className="text-2xl font-bold mb-4 text-white">Delete Account</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Are you sure you want to delete your account? This action
                    cannot be undone and will permanently delete all your data.
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-2xl hover:bg-gray-700/50 hover:text-white transition-all duration-300"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDeleteAccount}
                      className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl hover:from-red-600 hover:to-red-700 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
                      disabled={isLoading}
                    >
                      {isLoading ? "Deleting..." : "Delete Account"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case "Visitors":
        return (
          <div className="space-y-4">
            <p className="text-gray-600">
              You had 1 new visitor to your profile last week. Upgrade to Enlighten
              Pro to connect with them.
            </p>
            <button
              onClick={() => router.push("/subscription")}
              className="bg-pink-500 text-white px-6 py-2 rounded-full hover:bg-pink-600"
            >
              SEE YOUR VISITORS
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const handleProfilePictureChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSaveError("Please upload an image file");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setSaveError("Image size should be less than 5MB");
      return;
    }

    try {
      setIsLoading(true);
      setSaveError(null);
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Use the getToken helper function to get the token from both sources
      const token = getToken();
      console.log('Profile picture upload - token found:', !!token);
      
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      // Note: Don't set Content-Type header, let the browser set it with the boundary
      const response = await fetch(
        "http://localhost:8080/api/profile/upload-picture",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();

      // Update the form data with the new image URL
      setFormData((prev) => ({
        ...prev,
        profilePicture: data.imageUrl,
      }));

      setSuccessMessage("Profile picture updated successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Profile picture upload error:", error);
      setSaveError(error.message || "Failed to upload profile picture");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - (formData.photos?.length || 0);

    if (files.length > remainingSlots) {
      setSaveError(
        `You can only upload ${remainingSlots} more photo${
          remainingSlots === 1 ? "" : "s"
        }`
      );
      return;
    }

    // Validate each file
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setSaveError("Please upload only image files");
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setSaveError("Each image size should be less than 5MB");
        return;
      }
    }

    try {
      setIsLoading(true);
      setSaveError(null);
      const uploadData = new FormData();
      files.forEach((file) => {
        uploadData.append("photos", file);
      });

      // Use the getToken helper function to get the token from both sources
      const token = getToken();
      console.log('Photo upload - token found:', !!token);
      
      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch(
        "http://localhost:8080/api/profile/upload-photos",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: uploadData,
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload photos");
      }

      const data = await response.json();

      // Update the form data with the new photos
      setFormData((prev) => ({
        ...prev,
        photos: data.photos,
      }));

      setSuccessMessage("Photos uploaded successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Photos upload error:", error);
      setSaveError(error.message || "Failed to upload photos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePhoto = async (photoIndex) => {
    try {
      setIsLoading(true);
      setSaveError(null);

      // Use the getToken helper function to get the token from both sources
      const token = getToken();
      console.log('Photo deletion - token found:', !!token);

      if (!token) {
        throw new Error("No token found. Please log in again.");
      }

      const response = await fetch(
        `http://localhost:8080/api/profile/photos/${photoIndex}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete photo");
      }

      const data = await response.json();

      // Update the form data with the updated photos array
      setFormData((prev) => ({
        ...prev,
        photos: data.photos,
      }));

      setSuccessMessage("Photo deleted successfully!");

      // Refresh profile data
      await dispatch(fetchProfile()).unwrap();
    } catch (error) {
      console.error("Photo deletion error:", error);
      setSaveError(error.message || "Failed to delete photo");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFollowList = (users) => {
    // Show loading state when social data is being loaded
    if (socialDataLoading) {
      return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 p-4 glass-card rounded-2xl animate-pulse">
              <div className="w-12 h-12 bg-gray-600 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!Array.isArray(users) || users.length === 0) {
      return <div className="text-gray-300 text-center py-8">No users to display</div>;
    }

    return (
      <div className="space-y-4">
        {users.map((user, index) => {
          if (!user) return null;

          // Get profile picture URL with proper validation
          const profilePicture = user.profilePicture && user.profilePicture.trim() !== ''
            ? user.profilePicture.startsWith("http")
              ? user.profilePicture
              : `http://localhost:8080${user.profilePicture}`
            : defaultAvatar;

          return (
            <div
              key={user.userId || user._id}
              className="flex items-center justify-between p-4 glass-card rounded-2xl hover:bg-gray-700/50 transition-all duration-300"
            >
              <div className="flex items-center space-x-4">
                <Image
                  src={profilePicture}
                  alt={user.name || "User"}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#074C77]/50"
                  loading={index > 2 ? "lazy" : "eager"}
                  unoptimized
                  onError={(e) => {
                    e.target.src = defaultAvatar;
                  }}
                />
                <div>
                  <h3 className="font-medium text-white">
                    {user.name || "Anonymous User"}
                  </h3>
                  <p className="text-sm text-gray-300">
                    {user.location && user.location !== "unknown" 
                      ? `📍 ${user.location}` 
                      : "📍 Location not specified"}
                  </p>
                </div>
              </div>
              {formData.followingTab === "Blocked" ? (
                <button
                  onClick={() => handleUnblock(user.userId)}
                  disabled={unblockLoading[user.userId]}
                  className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-2xl hover:from-red-600 hover:to-red-700 disabled:opacity-50 transition-all duration-300 hover:scale-105 shadow-lg shadow-red-500/20"
                >
                  {unblockLoading[user.userId] ? "Loading..." : "Unblock"}
                </button>
              ) : (
                <button
                  onClick={() =>
                    router.push(`/community/${user.userId || user._id}`)
                  }
                  className="text-[#074C77] hover:text-[#0a6ba8] transition-colors font-medium"
                >
                  View Profile
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center py-12">
      <div className="w-full max-w-[1300px] mx-auto px-4">
        <div className="glass-card rounded-3xl border border-gray-700/50 flex md:flex-row flex-col p-8 shadow-2xl shadow-black/20">
          {/* Sidebar */}
          <div className="md:w-1/4 border-r border-gray-700/50 pr-8">
            <ul className="flex md:flex-col flex-row items-start gap-3 text-base">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`${
                    activeTab === item.label
                      ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] text-white shadow-lg shadow-[#074C77]/30"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  } rounded-2xl px-6 py-3 cursor-pointer transition-all duration-300 hover:scale-105 font-medium`}
                  onClick={() => handleMenuItemClick(item.label)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4 md:pl-8">
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-4xl font-bold gradient-text">Edit Profile</h1>
              <button
                onClick={handleSave}
                disabled={isLoading}
                className="btn-accent hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>

            {status === "loading" && <p className="text-gray-300">Loading...</p>}
            {status === "failed" && (
              <p className="text-red-400 bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                {typeof error === "object" ? JSON.stringify(error) : error}
              </p>
            )}

            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Components
const FormField = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div className="border-b border-gray-700/30 py-6">
    <label className="block text-lg font-semibold mb-3 text-white">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      className="glass-input w-full p-4 rounded-2xl text-white placeholder-gray-400 focus:ring-2 focus:ring-[#074C77]/50 focus:border-[#074C77]/50"
      required={required}
    />
  </div>
);

const TextAreaField = ({ label, value, onChange }) => (
  <div className="border-b border-gray-700/30 py-6">
    <label className="block text-lg font-semibold mb-3 text-white">{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      className="glass-input w-full p-4 rounded-2xl h-32 text-white placeholder-gray-400 focus:ring-2 focus:ring-[#074C77]/50 focus:border-[#074C77]/50 resize-none"
    />
  </div>
);

const LanguageFormSection = ({ title, value, onChange }) => (
  <div className="border-b border-gray-700/30 py-6">
    <h3 className="font-semibold text-lg mb-4 text-white">{title}</h3>
    <select
      value={value || ""}
      onChange={onChange}
      className="glass-input w-full p-4 rounded-2xl text-white focus:ring-2 focus:ring-[#074C77]/50"
    >
      <option value="" className="bg-gray-800 text-gray-300">Select a language</option>
      <option value="English" className="bg-gray-800 text-white">English (English)</option>
      <option value="French" className="bg-gray-800 text-white">French (Français)</option>
      <option value="Chinese" className="bg-gray-800 text-white">Chinese (Traditional) (中文 (繁體))</option>
    </select>
  </div>
);

const PreferenceField = ({ title, value, onChange, options }) => (
  <div className="border-b border-gray-700/30 py-6">
    <h3 className="font-semibold text-lg mb-3 text-white">{title}</h3>
    <select
      value={value}
      onChange={onChange}
      className="glass-input w-full p-4 rounded-2xl text-white focus:ring-2 focus:ring-[#074C77]/50"
    >
      <option value="Not set" className="bg-gray-800 text-gray-300">Not set</option>
      {options.map((option) => (
        <option key={option} value={option} className="bg-gray-800 text-white">
          {option}
        </option>
      ))}
    </select>
  </div>
);
const ToggleSection = ({ label, checked, onChange }) => (
  <div className="flex justify-between items-center p-4 bg-gray-800/30 rounded-2xl border border-gray-700/30 mb-4">
    <span className="text-white font-medium">{label}</span>
    <div
      className={`relative inline-block w-12 h-6 rounded-full cursor-pointer transition-all duration-300 ${
        checked ? "bg-gradient-to-r from-[#074C77] to-[#0a6ba8] shadow-lg shadow-[#074C77]/30" : "bg-gray-600"
      }`}
      onClick={onChange}
    >
      <div
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md ${
          checked ? "translate-x-6" : ""
        }`}
      />
    </div>
  </div>
);

export default ProfileForm;

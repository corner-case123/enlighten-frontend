"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-hot-toast";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const defaultImage =
  "https://imgs.search.brave.com/m12gFeEaYTH9TW9JHo1E4K4UFZBIAGpFdv-O_jdbty0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAzLzQ2LzgzLzk2/LzM2MF9GXzM0Njgz/OTY4M182bkFQemJo/cFNrSXBiOHBtQXd1/ZmtDN2M1ZUQ3d1l3/cy5qcGc";

const HighlightedProfiles = () => {
  const [premiumProfiles, setPremiumProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPremiumProfiles = async () => {
      try {
        const response = await axios.get(`${apiUrl}/profile/premium-users`, {
          withCredentials: true,
        });
        setPremiumProfiles(response.data);
      } catch (error) {
        console.error("Error fetching premium profiles:", error);
        toast.error("Failed to fetch premium profiles");
      } finally {
        setLoading(false);
      }
    };

    fetchPremiumProfiles();
  }, []);

  const getLanguageFlag = (language) => {
    const flags = {
      English: "🇬🇧",
      French: "🇫🇷",
      Spanish: "🇪🇸",
      German: "🇩🇪",
      Chinese: "🇨🇳",
      Japanese: "🇯🇵",
      Korean: "🇰🇷",
    };
    return flags[language] || "🌐";
  };

  if (loading) {
    return (
      <section className="py-6">
        <h2 className="text-md font-[500] mb-4 text-pink-500">
          Highlighted Profiles{" "}
          <span className="px-2 text-xs rounded-tr-md rounded-br-md rounded-tl-lg rounded-bl-sm text-white bg-pink-500">
            PRO
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-lg p-4 animate-pulse border border-gray-700/50"
            >
              <div className="w-16 h-16 rounded-full bg-gray-600/50 mx-auto mb-3" />
              <div className="h-4 bg-gray-600/50 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3 bg-gray-600/50 rounded w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (premiumProfiles.length === 0) {
    return null;
  }

  return (
    <section className="py-6">
      <h2 className="text-md font-[500] mb-4 text-pink-500">
        Highlighted Profiles{" "}
        <span className="px-2 text-xs rounded-tr-md rounded-br-md rounded-tl-lg rounded-bl-sm text-white bg-pink-500">
          PRO
        </span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {premiumProfiles.map((profile) => (
          <ProfileCard
            key={profile._id}
            profile={profile}
            isPro={true}
            getLanguageFlag={getLanguageFlag}
          />
        ))}
      </div>
    </section>
  );
};

const ProfileCard = ({ profile, isPro, getLanguageFlag }) => {
  const truncateBio = (bio, maxLength = 50) => {
    if (!bio) return "";
    return bio.length > maxLength ? bio.substring(0, maxLength) + "..." : bio;
  };

  return (
    <Link
      href={`/community/${profile.userId}`}
      className="bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-5 text-center hover:shadow-2xl transition-all duration-300 border border-gray-700/50 hover:border-pink-500/30 hover:scale-105 hover:bg-gray-700/90 group"
    >
      <div className="relative">
        <img
          src={
            profile.profilePicture
              ? `${baseUrl}${profile.profilePicture}`
              : defaultImage
          }
          alt={profile.name}
          className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-4 border-pink-500 group-hover:border-pink-400 transition-colors"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
        <div className="absolute -top-1 -right-8 w-4 h-4 bg-pink-500 rounded-full animate-pulse" />
      </div>
      <h3 className="font-semibold text-md text-white group-hover:text-pink-300 transition-colors">
        {profile.name}
      </h3>
      <p className="text-sm text-gray-300 mb-3 min-h-[2.5rem]">
        {truncateBio(profile.description)}
      </p>
      <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
        {profile.speaks?.map((lang, index) => (
          <div
            key={index}
            className="flex items-center bg-emerald-500/20 text-emerald-300 rounded-full px-3 py-1 text-xs font-medium border border-emerald-500/30"
          >
            <span className="mr-1">{getLanguageFlag(lang)}</span>
            <span>{lang}</span>
          </div>
        ))}
        {profile.learns?.map((lang, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-500/20 text-blue-300 rounded-full px-3 py-1 text-xs font-medium border border-blue-500/30"
          >
            <span className="mr-1">{getLanguageFlag(lang)}</span>
            <span>{lang}</span>
          </div>
        ))}
      </div>
      <button className="bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full px-5 py-2 text-sm font-semibold hover:from-pink-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
        Try Tandem Pro
      </button>
    </Link>
  );
};

export default HighlightedProfiles;

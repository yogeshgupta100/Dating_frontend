import React from "react";

const ProfileHero: React.FC<{ banner_img: any }> = ({ banner_img }) => {
  return (
    <div className="w-full mb-10">
      <div className="relative w-full h-64 md:h-96 flex items-center justify-center bg-gray-300">
        <img
          src={banner_img}
          alt="Video section background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
      </div>
    </div>
  );
};

export default ProfileHero;

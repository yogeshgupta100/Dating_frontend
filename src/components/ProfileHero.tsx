import React from 'react';
import image from "../assets/images/banner_image.jpg";

const ProfileHero: React.FC<{ profile_img: any, banner_img: any, name: any }> = ({ profile_img, banner_img, name }) => {

  return (
    <div className="relative w-full mb-10">
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center bg-gray-300">
        <img
          src={banner_img as any || image}
          alt="Video section background"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-80"
        />
        <h1 className="relative z-10 text-white text-3xl md:text-5xl font-bold text-center drop-shadow-lg">
          Video section
        </h1>
        <div className="w-45 h-40 absolute left-[20%] bottom-0 translate-x-[-50%] translate-y-1/2 z-20">
          <img
            src={profile_img as any}
            alt={name}
            className="w-45 h-40 md:w-48 md:h-48 rounded-full object-cover shadow-md bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileHero; 
import React from "react";

export const Banner = () => {
  return (
    <section className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="mx-auto">
        <img
          src="/banner_img.jpeg"
          alt="Banner background"
          className="w-full h-full object-cover"
        />
      </div>
    </section>
  );
};

import image from "../assets/images/banner_image.jpg";

export const Banner = () => {
  return (
    <section className="relative bg-gradient-to-br from-red-500 via-pink-500 to-purple-600 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="mx-auto">
        <img src={image.src} alt="Banner" className="w-full h-full object-cover" />
      </div>
    </section>
  );
};
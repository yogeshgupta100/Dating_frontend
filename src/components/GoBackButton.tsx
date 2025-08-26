"use client";

export default function GoBackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition-colors w-full sm:w-auto"
    >
      Go Back
    </button>
  );
}

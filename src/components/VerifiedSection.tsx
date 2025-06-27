import { Users, Shield, MapPin } from "lucide-react";

export const VerifiedSection = () => {
  return (
    <section id="about" className="mb-20">
      <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">
              Verified Call Girls
            </h3>
            <p className="text-gray-600">Verified profiles across India</p>
          </div>
          <div className="text-center">
            <Shield className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">
              100% Secure
            </h3>
            <p className="text-gray-600">Privacy and safety guaranteed</p>
          </div>
          <div className="text-center">
            <MapPin className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2">Pan India</h3>
            <p className="text-gray-600">Coverage across all states</p>
          </div>
        </div>
      </div>
    </section>
  );
};

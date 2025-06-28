const peopleImages = [
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751049871/dating-app/profiles/mbe9jv6ihlv5fgjptprp.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751049872/dating-app/banners/wm287wzsdiggyr0xtkba.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751049989/dating-app/profiles/dojb5cqr52mk3ga3vpml.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751049990/dating-app/banners/ykqumosukus28xrwxvwg.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050049/dating-app/profiles/iqqwqwwcxcr2r7bbzi0q.jpg",
    "https://res.cloudinary.com/dpmknwklm/image/upload/v1751050049/dating-app/profiles/iqqwqwwcxcr2r7bbzi0q.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050111/dating-app/profiles/g3xrm1lrfh29ewmjmlpy.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050112/dating-app/banners/oyalqpnjkkujluuyijqw.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050173/dating-app/profiles/kxvsxbcpeff2feu6tzbu.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050174/dating-app/banners/zjkxwf4bmuvctck69xcn.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050250/dating-app/profiles/g2oaayk7kmygvohl2gio.jpg",
    "http://res.cloudinary.com/dpmknwklm/image/upload/v1751050251/dating-app/banners/s24fxawbtejuuxgr54fc.jpg",
  ];

export default function Gallery({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <section id="gallery" className="mb-20">
      {showHeading && <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Meet Amazing People
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with genuine individuals who are ready for meaningful
          relationships.
        </p>
      </div>}
      <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ${!showHeading ? "pt-8" : ""}`}>
        {peopleImages.map((src, idx) => (
          <div
            key={idx}
            className="aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <img
              src={src}
              alt={`Person ${idx + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

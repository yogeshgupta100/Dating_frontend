import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Heart, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react';
import CarCarousel from '../components/CarCarousel';
import ProfileCard from '../components/ProfileCard';
import Disclaimer from '../components/Disclaimer';
import WhatsAppIcon from '../components/WhatsAppIcon';
import PhoneIcon from '../components/PhoneIcon';
import { getModels } from '../services/models';
import { LocationResponse, Model } from '../services';
import { getLocationBySlug, getLocations, getLocationById } from '../services/Locations';
import { Banner } from '../components/Banner';
import SEO from '../components/SEO';
import { api } from '../services/api';
import { slugToText, generatePageTitle, generateMetaDescription, generateKeywords, generateSlug, generateProfileSlug } from '../utils/slug';

// const profiles = [
//   {
//     img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
//     heading: 'Priya Sharma',
//     age: 28,
//     location: 'Delhi',
//     profession: 'Software Engineer',
//     desc: 'A passionate professional who believes in meaningful connections and shared values. I enjoy exploring new places, reading books, and spending quality time with loved ones. Looking for someone who appreciates life\'s simple pleasures and is ready for a genuine relationship built on trust and understanding.'
//   },
//   {
//     img: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400',
//     heading: 'Ananya Gupta',
//     age: 26,
//     location: 'Mumbai',
//     profession: 'Marketing Manager',
//     desc: 'Creative soul with a love for art, music, and adventure. I believe in living life to the fullest while maintaining strong family values. Seeking a partner who shares my enthusiasm for life and is ready to build beautiful memories together through life\'s journey.'
//   },
//   {
//     img: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=400',
//     heading: 'Kavya Patel',
//     age: 30,
//     location: 'Bangalore',
//     profession: 'Doctor',
//     desc: 'Dedicated healthcare professional who values compassion, integrity, and personal growth. I enjoy yoga, cooking traditional recipes, and volunteering in my free time. Looking for a life partner who appreciates both modern aspirations and traditional values.'
//   },
//   {
//     img: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=400',
//     heading: 'Riya Singh',
//     age: 25,
//     location: 'Pune',
//     profession: 'Teacher',
//     desc: 'Educator with a passion for nurturing young minds and making a positive impact. I love traveling, photography, and exploring different cultures. Seeking someone who values education, family, and is ready to embark on life\'s adventures together.'
//   }
// ];

const galleryImages = [
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1382734/pexels-photo-1382734.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1820770/pexels-photo-1820770.jpeg?auto=compress&cs=tinysrgb&w=400',
  'https://images.pexels.com/photos/1559486/pexels-photo-1559486.jpeg?auto=compress&cs=tinysrgb&w=400',
];

const DatingP2 = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<Model[]>([]);
  const [location, setLocation] = useState<LocationResponse | null>(null);
  const [faqData, setFaqData] = useState<string>('');
  const { locationSlug } = useParams();
  const { id } = useLocation()?.state;
  const navigate = useNavigate();

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First try to get location by slug
        let locationData = await getLocationBySlug(locationSlug || '');
        
        // If not found by slug, try to get by ID (fallback)
        if (!locationData && id) {
          locationData = await getLocationById(id);
        }
        
        if (locationData) {
          setLocation(locationData);
          
          // Fetch profiles for this location
          const profilesData = await getModels(locationData.id.toString());
          setProfiles(profilesData);
        }
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    
    fetchData();
    
    // Fetch FAQ data
    const fetchFaqData = async () => {
      try {
        const faqs = await api.getFaqs();
        if (Array.isArray(faqs) && faqs.length > 0) {
          setFaqData(faqs[0].name);
        }
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };
    fetchFaqData();
  }, [locationSlug, id]);

  const formatLocationName = (locationName: string | undefined) => {
    if (!locationName) return 'Featured Profiles';
    return locationName.charAt(0).toUpperCase() + locationName.slice(1);
  };

  const locationName = formatLocationName(location?.name || slugToText(locationSlug || ''));
  const pageTitle = generatePageTitle(locationSlug || '');
  const pageDescription = generateMetaDescription(locationSlug || '', location?.content || '');
  const pageKeywords = generateKeywords(locationSlug || '');

  const profilesPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "description": pageDescription,
    "url": `https://pro.abellarora.com/${locationSlug}/profiles`,
    "mainEntity": {
      "@type": "ItemList",
      "name": `${locationName} Escort Profiles`,
      "description": `Verified escort profiles in ${locationName}`,
      "numberOfItems": profiles.length,
      "itemListElement": profiles.map((profile, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Person",
          "name": profile.name || profile.heading,
          "description": profile.description,
          "image": profile.profile_img,
          "url": `https://pro.abellarora.com/${locationSlug}/profiles/${profile.slug || generateProfileSlug(profile.name || profile.heading || 'profile', locationSlug || 'location', profiles.map(p => p.slug).filter(Boolean))}`
        }
      }))
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://pro.abellarora.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": locationName,
          "item": `https://pro.abellarora.com/${locationSlug}/profiles`
        }
      ]
    }
  };

  // Dynamic FAQ content using location name from API
  const faqs = [
    {
      question: `How does the matching process work in ${faqData || locationName}?`,
      answer: `Our advanced algorithm considers your preferences, interests, values, and lifestyle to suggest compatible matches in ${faqData || locationName}. We also factor in location, education, and family background to ensure meaningful connections.`
    },
    {
      question: `Is my personal information secure with ${faqData || locationName} escorts?`,
      answer: `Absolutely! We use industry-standard encryption and security measures to protect your data in ${faqData || locationName}. Your privacy is our top priority, and we never share your information with third parties without your consent.`
    },
    {
      question: `What makes your ${faqData || locationName} platform different?`,
      answer: `We focus on quality over quantity in ${faqData || locationName}, with verified profiles and personalized matchmaking. Our team manually reviews each profile to ensure authenticity and provides ongoing support throughout your journey.`
    },
    {
      question: `How can I increase my chances of finding a match in ${faqData || locationName}?`,
      answer: `Complete your profile with genuine information, upload recent photos, and be active on the ${faqData || locationName} platform. Be clear about your expectations and remain open to meaningful conversations with potential matches.`
    }
  ];

  return (
    <>
      <SEO 
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        url={`https://pro.abellarora.com/${locationSlug}/profiles`}
        type="profile"
        structuredData={profilesPageStructuredData}
        canonical={`https://pro.abellarora.com/${locationSlug}/profiles`}
      />
      <div className="min-h-screen bg-gray-50">
        <Banner />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {location?.heading} Escorts
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {location?.sub_heading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 mb-16">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                img={profile.profile_img || ''}
                heading={profile.name || profile.heading}
                desc={profile.description}
                location={location?.name}
                services={profile.services}
                onClick={() => navigate(`/${locationSlug}/${profile.slug || generateProfileSlug(profile.name || profile.heading || 'profile', locationSlug || 'location', profiles.map(p => p.slug).filter(Boolean))}`, { state: { number: location?.phone_number } })}
              />
            ))}
          </div>

          <div className="max-w-6xl mx-auto w-32 h-full md:w-48 md:h-full overflow-hidden rounded-2xl border border-gray-200">
            {location?.content}
          </div>



          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Get answers to common questions about our {faqData || locationName} platform and services.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mb-20">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Success Stories Gallery
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Celebrating the beautiful connections made through our {faqData || locationName} platform.
              </p>
            </div>
            <CarCarousel images={galleryImages} />
          </section>

          <div className="max-w-6xl mx-auto">
            <Disclaimer />
          </div>
        </div>

        <section>
          <PhoneIcon number={location?.phone_number || ''}/>
        </section>
        
        <section>
          <WhatsAppIcon number={location?.phone_number || ''}/>
        </section>
      </div>
    </>
  );
};

export default DatingP2;
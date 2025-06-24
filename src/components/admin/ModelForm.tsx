import React, { useState, useEffect } from 'react';
import { ModelFormProps, Model } from '../../services';
import { STATIC_SERVICES, SERVICE_CATEGORIES } from '../../constants/services';
import imageCompression from 'browser-image-compression';

const ModelForm: React.FC<ModelFormProps> = ({ model, locations, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Model, 'id'>>({
    name: '',
    heading: '',
    phone_number: '',
    state_id: '',
    description: '',
    profile_img: undefined,
    banner_img: undefined,
    services: [],
  });
  const [profilePreview, setProfilePreview] = useState<string | undefined>(undefined);
  const [bannerPreview, setBannerPreview] = useState<string | undefined>(undefined);
  const [imageProcessing, setImageProcessing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Services");

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (profilePreview && profilePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profilePreview);
      }
      if (bannerPreview && bannerPreview.startsWith('blob:')) {
        URL.revokeObjectURL(bannerPreview);
      }
    };
  }, [profilePreview, bannerPreview]);

  useEffect(() => {
    if (model) {
      const { id, ...modelData } = model;
      setFormData(modelData);
      
      // Handle existing images (now Cloudinary URLs)
      if (modelData.profile_img && typeof modelData.profile_img === 'string') {
        setProfilePreview(modelData.profile_img);
      }
      if (modelData.banner_img && typeof modelData.banner_img === 'string') {
        setBannerPreview(modelData.banner_img);
      }
    }
  }, [model]);

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, type } = e.target;
    if (type === 'file') {
      setImageProcessing(true);
      const fileInput = e.target as HTMLInputElement;
      const file = fileInput.files?.[0];
      if (file) {
        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };
        try {
          const compressedFile = await imageCompression(file, options);
          const fileFromBlob = new File([compressedFile], file.name, {
            type: compressedFile.type,
            lastModified: Date.now(),
          });
          if (name === 'profile_img') {
            setProfilePreview(URL.createObjectURL(fileFromBlob));
          } else if (name === 'banner_img') {
            setBannerPreview(URL.createObjectURL(fileFromBlob));
          }
          setFormData(prev => ({
            ...prev,
            [name]: fileFromBlob,
          }));
          setImageProcessing(false);
        } catch (error) {
          console.error('Image compression error:', error);
          setImageProcessing(false);
        }
      } else {
        setImageProcessing(false);
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: (e.target as any).value,
      }));
    }
  };

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleSelectAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: STATIC_SERVICES
    }));
  };

  const handleClearAllServices = () => {
    setFormData(prev => ({
      ...prev,
      services: []
    }));
  };

  const getFilteredServices = () => {
    if (selectedCategory === "All Services") {
      return STATIC_SERVICES;
    }
    return SERVICE_CATEGORIES[selectedCategory as keyof typeof SERVICE_CATEGORIES] || STATIC_SERVICES;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting formData:', formData);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </span>
          <input
            type="text"
            name="heading"
            value={formData.heading}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter heading"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3.08 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.68 2.34a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.74.32 1.53.55 2.34.68A2 2 0 0 1 22 16.92z"/></svg>
          </span>
          <input
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter phone number"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </span>
          <select
            name="state_id"
            value={formData.state_id}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            required
          >
            <option value="">Select location</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 17h16M4 12h16M4 7h16"/></svg>
          </span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter bio"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Services</label>
        
        {/* Service Management Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={handleSelectAllServices}
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition"
          >
            Select All
          </button>
          <button
            type="button"
            onClick={handleClearAllServices}
            className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition"
          >
            Clear All
          </button>
          <span className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-md">
            {formData.services.length} selected
          </span>
        </div>

        {/* Category Filter */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {["All Services", ...Object.keys(SERVICE_CATEGORIES)].map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 border border-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4">
          {getFilteredServices().map((service) => (
            <label
              key={service}
              className="flex items-center p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={formData.services.includes(service)}
                onChange={() => handleServiceToggle(service)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-3"
              />
              <span className="text-sm text-gray-700">{service}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
        <input
          type="file"
          name="profile_img"
          onChange={handleChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
        {profilePreview && (
          <div className="mt-2">
            <img src={profilePreview} alt="Profile Preview" className="h-24 w-24 object-cover rounded-full border" />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Banner Image</label>
        <input
          type="file"
          name="banner_img"
          onChange={handleChange}
          accept="image/*"
          className="mt-1 block w-full"
        />
        {bannerPreview && (
          <div className="mt-2">
            <img src={bannerPreview} alt="Banner Preview" className="h-24 w-full object-cover rounded-lg border" />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
          disabled={imageProcessing}
        >
          {model ? 'Update Model' : 'Add Model'}
        </button>
      </div>
    </form>
  );
};

export default ModelForm; 
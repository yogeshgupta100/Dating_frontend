import React from 'react';
import { LocationResponse } from '../../services';
import { getLocationById } from '../../services/Locations';

interface LocationFormData {
  name: string;
  phone_number: string;
  heading: string;
  sub_heading: string;
  content: string;
  slug: string;
  seo_title: string;
  seo_desc: string;
  seo_keywords: string[];
  faq: string;
  selected_location_id?: string;
}

interface LocationFormProps {
  location?: LocationResponse;
  onSubmit: (location: LocationFormData) => void;
  onCancel: () => void;
  existingSlugs?: string[];
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onSubmit, onCancel, existingSlugs = [] }) => {
  const [formData, setFormData] = React.useState<LocationFormData>({
    name: '',
    phone_number: '',
    heading: '',
    sub_heading: '',
    content: '',
    slug: '',
    seo_title: '',
    seo_desc: '',
    seo_keywords: [],
    faq: '',
  });
  const [slugSuggestions, setSlugSuggestions] = React.useState<string[]>([]);
  const [showSlugSuggestions, setShowSlugSuggestions] = React.useState(false);
  const [slugError, setSlugError] = React.useState<string>('');

  React.useEffect(() => {
    if (location?.id) {
      fetchLocationById();
    }
  }, [location?.id]);

  const fetchLocationById = async () => {
    const data = await getLocationById(location?.id.toString() || '');
    setFormData({
      name: data.name,
      phone_number: data.phone_number,
      heading: data.heading || '',
      sub_heading: data.sub_heading || '',
      content: data.content || '',
      slug: data.slug || '',
      seo_title: data.seo_title || '',
      seo_desc: data.seo_desc || '',
      seo_keywords: data.seo_keywords || [],
      faq: data.faq || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ 
      name: formData.name, 
      phone_number: formData.phone_number,
      heading: formData.heading,
      sub_heading: formData.sub_heading,
      content: formData.content,
      slug: formData.slug,
      seo_title: formData.seo_title,
      seo_desc: formData.seo_desc,
      seo_keywords: formData.seo_keywords,
      faq: formData.faq,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-black">
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
            placeholder="Enter location name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          SEO Slug
          <span className="text-xs text-gray-500 ml-1">(URL-friendly version)</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔗
          </span>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter SEO slug"
          />
        </div>
        <p className="mt-1 text-xs text-gray-500">
          This will create URLs like: https://yourdomain.com/{formData.slug || 'location-name'}
        </p>
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
        <label className="block text-sm font-medium text-gray-700 mb-1">Sub Heading</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
          </span>
          <input
            type="text"
            name="sub_heading"
            value={formData.sub_heading}
            onChange={handleChange}
            className="pl-10 pr-4 py-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition"
            placeholder="Enter sub heading"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Content
        </label>
        <div className="relative">
          <span className="absolute left-3 top-3 text-gray-400">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </span>
          <div className="pl-10">
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition px-3 py-2 resize-none font-mono text-sm"
              placeholder="Enter content with HTML tags. Example: &lt;p&gt;This is a paragraph with a &lt;a href='https://example.com'&gt;link&lt;/a&gt;&lt;/p&gt;"
            />
          </div>
        </div>
        <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-200">
          <p className="text-xs text-blue-800 font-medium mb-2">💡 HTML Content Examples:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Paragraph:</strong> <code>&lt;p&gt;This is a paragraph text.&lt;/p&gt;</code></p>
            <p><strong>Bold text:</strong> <code>&lt;strong&gt;Bold text here&lt;/strong&gt;</code></p>
            <p><strong>Link:</strong> <code>&lt;a href="https://example.com"&gt;Click here&lt;/a&gt;</code></p>
            <p><strong>Heading:</strong> <code>&lt;h2&gt;Section Heading&lt;/h2&gt;</code></p>
            <p><strong>Combined:</strong> <code>&lt;p&gt;Text with &lt;strong&gt;bold&lt;/strong&gt; and &lt;a href="#"&gt;link&lt;/a&gt;&lt;/p&gt;</code></p>
          </div>
          <p className="text-xs text-blue-600 mt-2 font-medium">⚠️ Important: Don't wrap your content in extra &lt;p&gt; tags - the system will handle that automatically.</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
        <input
          type="text"
          name="seo_title"
          value={formData.seo_title}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition px-3 py-2"
          placeholder="Enter SEO title"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Description</label>
        <textarea
          name="seo_desc"
          value={formData.seo_desc}
          onChange={handleChange}
          rows={3}
          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition px-3 py-2 resize-none"
          placeholder="Enter SEO description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords <span className="text-xs text-gray-500">(comma separated)</span></label>
        <input
          type="text"
          name="seo_keywords"
          value={formData.seo_keywords}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition px-3 py-2"
          placeholder="Enter keywords, separated by commas"
        />
        <p className="mt-1 text-xs text-gray-500">Example: escort, call girl, premium, safe, discreet</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">FAQ</label>
        <input
          type="text"
          name="faq"
          value={formData.faq}
          onChange={handleChange}
          className="block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition px-3 py-2"
          placeholder="Enter FAQ or related info"
        />
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
        >
          {location ? 'Update Location' : 'Add Location'}
        </button>
      </div>
    </form>
  );
};

export default LocationForm; 
import React, { useState, useEffect } from 'react';
import Header from '../../components/admin/Header';
import LocationForm from '../../components/admin/LocationForm';
import { LocationResponse } from '../../services/index';
import { createLocation, deleteLocation, getLocations, updateLocation } from '../../services/Locations';

const Locations: React.FC = () => {
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: {name: string, phone_number: string, heading: string, sub_heading: string, content: string, slug: string, seo_title: string, seo_desc: string, seo_keywords: string[], faq: string}) => {
    try {
      if (selectedLocation) {
        await updateLocation(selectedLocation.id.toString(), formData.name, formData.phone_number, formData.heading, formData.sub_heading, formData.content, formData.slug, formData.seo_title, formData.seo_desc, formData.seo_keywords, formData.faq);
      } else {
        await createLocation(formData.name, formData.phone_number, formData.heading, formData.sub_heading, formData.content, formData.slug, formData.seo_title, formData.seo_desc, formData.seo_keywords, formData.faq);
      }
      fetchLocations();
      setIsFormOpen(false);
      setSelectedLocation(undefined);
    } catch (error) {
      console.error('Error saving location:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await deleteLocation(id);
        fetchLocations();
      } catch (error) {
        console.error('Error deleting location:', error);
      }
    }
  };

  const handleEdit = (location: LocationResponse) => {
    setSelectedLocation(location);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Locations" />
        <main className="pt-20 pl-64">
          <div className="p-6">
            <div className="text-center">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header title="Locations" />
      
      <main className="pt-20 pl-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Locations</h1>
            <button
              onClick={() => {
                setSelectedLocation(undefined);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Location
            </button>
          </div>

          {isFormOpen ? (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <LocationForm
                location={selectedLocation}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedLocation(undefined);
                }}
                existingSlugs={locations.map(loc => loc.slug).filter(Boolean)}
              />
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations.map((location) => (
                    <tr key={location.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {location.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">
                          {location.slug || 'No slug'}
                        </div>
                        {location.slug && (
                          <div className="text-xs text-blue-600">
                            /{location.slug}/profiles
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{location.phone_number}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(location)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(location.id.toString())}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Locations; 
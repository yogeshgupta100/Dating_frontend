import React, { useState, useEffect, useMemo } from 'react';
import Header from '../../components/admin/Header';
import ModelForm from '../../components/admin/ModelForm';
import { Model, LocationResponse } from '../../services';
import { createModel, deleteModel , updateModel } from '../../services/models';
import { fetchLocations, fetchModels } from '../../../utils/FetchAll';

const Models: React.FC = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to safely get image source
  const getImageSrc = (image: string | File | undefined): string => {
    if (!image) return '';
    if (typeof image === 'string') {
      // Cloudinary URLs are short and safe to use directly
      return image;
    }
    if (image instanceof File) return URL.createObjectURL(image);
    return '';
  };

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      models.forEach(model => {
        if (model.profile_img instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(model.profile_img));
        }
        if (model.banner_img instanceof File) {
          URL.revokeObjectURL(URL.createObjectURL(model.banner_img));
        }
      });
    };
  }, [models]);

  useEffect(() => {
    fetchLocations().then((data) => {
      setLocations(data || []);
    });
    fetchModels().then((data) => {
        setIsLoading(false);
        setModels(data || []);
      });
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      fetchModels(selectedLocation);
    }
  }, [selectedLocation]);

  const handleSubmit = async (formData: Omit<Model, 'id'>) => {
    try {
      if (selectedModel) {
        await updateModel(selectedModel.id.toString(), formData);
      } else {
        await createModel(formData);
      }
      fetchModels(selectedLocation);
      setIsFormOpen(false);
      setSelectedModel(undefined);
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this model?')) {
      try {
        await deleteModel(id);
        fetchModels(selectedLocation);
      } catch (error) {
        console.error('Error deleting model:', error);
      }
    }
  };

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header title="Models" />
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
      <Header title="Models" />
      
      <main className="pt-20 pl-64">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Models</h1>
            <button
              onClick={() => {
                setSelectedModel(undefined);
                setIsFormOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Add Model
            </button>
          </div>

          <div className="mb-6">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {isFormOpen ? (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <ModelForm
                model={selectedModel}
                locations={locations}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedModel(undefined);
                }}
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
                      Location
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {models.map((model) => (
                    <tr key={model.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {model.profile_img ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={getImageSrc(model.profile_img)}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">👤</span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {model.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {locations.find(loc => String(loc.id) === String(model.state_id))?.name || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(model)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(model.id.toString())}
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

export default Models; 
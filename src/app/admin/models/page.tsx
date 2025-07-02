"use client";

import React, { useState, useEffect } from "react";
import Header from "../../../components/admin/Header";
import ModelForm from "../../../components/admin/ModelForm";
import { Model, LocationResponse } from "../../../services/index";
import {
  createModel,
  deleteModel,
  getModels,
  updateModel,
} from "../../../services/models";
import { getLocations } from "../../../services/Locations";

export default function AdminModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [locations, setLocations] = useState<LocationResponse[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [modelsData, locationsData] = await Promise.all([
        getModels(),
        getLocations(),
      ]);
      setModels(modelsData);
      setLocations(locationsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: Omit<Model, "id">) => {
    try {
      if (selectedModel) {
        await updateModel(selectedModel.id.toString(), formData);
      } else {
        await createModel(formData);
      }
      fetchData();
      setIsFormOpen(false);
      setSelectedModel(undefined);
    } catch (error) {
      console.error("Error saving model:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this model?")) {
      try {
        await deleteModel(id);
        fetchData();
      } catch (error) {
        console.error("Error deleting model:", error);
      }
    }
  };

  const handleEdit = (model: Model) => {
    setSelectedModel(model);
    setIsFormOpen(true);
  };

  const getLocationName = (stateId: string) => {
    const location = locations.find((loc) => loc.id.toString() === stateId);
    return location ? location.name : "Unknown";
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
            <div className="text-2xl font-semibold text-gray-900">Models</div>
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
                      Slug
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone
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
                        <div className="text-sm font-medium text-gray-900">
                          {model.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 font-mono">
                          {model.slug || "No slug"}
                        </div>
                        {model.slug && (
                          <div className="text-xs text-blue-600">
                            /{model.slug}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {model.phone_number}
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
}

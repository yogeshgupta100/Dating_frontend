"use client";

import { useEffect, useState } from "react";
import {
  getLocationBySlug,
  clearLocationCache,
} from "../../services/Locations";

export default function TestApiPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApiCall = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing API call for: call-girl-gurgaon");

      // Clear cache first
      clearLocationCache("call-girl-gurgaon");

      // Test the API call
      const data = await getLocationBySlug("call-girl-gurgaon", true);

      console.log("API call result:", data);
      setResult(data);
    } catch (err) {
      console.error("API call failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Testing direct fetch...");

      const response = await fetch(
        "https://api.pokkoo.in/states/slug/call-girl-gurgaon",
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Direct fetch status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("Direct fetch data:", data);
        setResult(data);
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (err) {
      console.error("Direct fetch failed:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-y-4">
        <button
          onClick={testApiCall}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test API Call"}
        </button>

        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 ml-4"
        >
          {loading ? "Testing..." : "Test Direct Fetch"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <strong>Success!</strong>
          <pre className="mt-2 text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

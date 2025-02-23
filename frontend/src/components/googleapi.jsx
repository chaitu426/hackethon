import React, { useState } from 'react';
import axios from 'axios';
import { Sprout, Loader2 } from 'lucide-react';

const GEMINI_API_KEY = "AIzaSyAGI9HWzIpXu0no8QO1e7A2PPuicXywvc0";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const CropAnalysis = ({ crops }) => {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('Maharashtra');

  const statesByCountry = {
    India: [
      "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
      "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
      "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
      "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
      "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
      "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
      "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep",
      "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
    ],
    
  };

  const fetchCropAnalysis = async () => {
    if (!GEMINI_API_KEY) {
      setError("API Key is missing!");
      return;
    }

    setLoading(true);
    setError(null);

    const cropDetails = crops.map(crop => 
      `🌱 Crop: ${crop.nameOfCrop}, Description: ${crop.description}, Sown: ${crop.sowingDate}, Harvest: ${crop.expectedHarvestDate}, Category: ${crop.category}, Water Needs: As per crop, Revenue: $${crop.revenue}, Expenses: $${crop.expenses}`
    ).join("\n");

    const prompt = `
      You are an expert agricultural scientist. Analyze the given crop data and provide detailed insights for ${state}, ${country} in its native language.
      - Best sowing and harvesting times based on climate.
      - Common diseases and preventive measures.
      - Soil and water requirements for optimal growth.
      - Ideal climate conditions.
      - Pest control methods and risk management.
      - Profitability analysis and financial planning.
      
      Crop Data:
      ${cropDetails}

      give detailed insights according to the climatic conditions, temperature, rainfall, soil type from ${country}, ${state}.
    `;

    try {
      const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 2000, temperature: 0.7 },
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available.";
      setAnalysis(generatedText);
    } catch (err) {
      setError("Failed to fetch analysis. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Sprout className="w-6 h-6 text-emerald-600" />
        <h2 className="text-2xl font-medium text-gray-900">Crop Analysis</h2>
      </div>

      <div className="flex space-x-4">
        <select
          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {Object.keys(statesByCountry).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 outline-none"
          value={state}
          onChange={(e) => setState(e.target.value)}
        >
          {statesByCountry[country].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <button 
        className="w-full px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
        onClick={fetchCropAnalysis}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <span>Generate Analysis</span>
        )}
      </button>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {analysis && (
        <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>
          <div className="prose prose-emerald max-w-none">
            <p className="text-gray-600 whitespace-pre-wrap">{analysis}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAnalysis;
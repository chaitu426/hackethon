import React, { useState } from 'react';
import { BarChart2, Users, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";
import { useEffect } from 'react';
import CropDashboard from './graph';
import CropAnalysis from './googleapi';
import IBMMLComponent from'./ibmcropname';

export function DashboardContent({ activeTab }) {

    const [crops, setCrops] = useState([]);
    const [error, setError] = useState(null);
    const { isSignedIn, user } = useUser();
    const [isUserLoaded, setIsUserLoaded] = useState(false);
    const [cropData, setCropData] = useState({
        nameOfCrop: "",
        description: "",
        category: "",
        sowingDate: "",
        expectedHarvestDate: "",
        revenue: 0,
        expenses: 0,
        fertilizersUsed: "",
        pesticidesUsed: "",
    });

    useEffect(() => {
        if (isSignedIn && user && !isUserLoaded) {
            setIsUserLoaded(true); // Prevent multiple API calls

            const fetchCrops = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/api/get-crops?userId=${user.id}`);
                    if (!response.ok) throw new Error("Failed to fetch crops");

                    const data = await response.json();
                    setCrops(data);
                } catch (err) {
                    setError(err.message);
                }
            };

            fetchCrops();
        }
    }, [isSignedIn, user, isUserLoaded]);

    const handleChange = (e) => {
        setCropData({ ...cropData, [e.target.name]: e.target.value });
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert("User not signed in.");
            return;
        }

        fetch("http://localhost:3000/api/add-crop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...cropData, userId: user.id }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log("Crop saved:", data);
                alert("Crop data added successfully!");
                setCropData({
                    nameOfCrop: "",
                    description: "",
                    category: "",
                    sowingDate: "",
                    expectedHarvestDate: "",
                    revenue: 0,
                    expenses: 0,
                    fertilizersUsed: "",
                    pesticidesUsed: "",
                })
            })
            .catch((err) => console.error("Error adding crop:", err));
    };

    const handleDeleteCrop = async (cropId) => {
        try {
            const response = await fetch(`/api/delete-crop?cropId=${cropId}`, {
                method: "GET",
            });

            if (response.ok) {
                setCrops(prevCrops => prevCrops.filter(crop => crop._id !== cropId)); // Update UI
            } else {
                console.error("Failed to delete crop:", await response.json());
            }
        } catch (error) {
            console.error("Error deleting crop:", error);
        }
    };


    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                            <StatCard
                                title="Total Crops"
                                value={crops.length}
                                change=""
                                isPositive={true}
                                icon={<BarChart2 size={24} className="text-blue-600" />}
                            />
                            <StatCard
                                title="Total Revenue"
                                value={`RS.${crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0)}`}
                                change=""
                                isPositive={true}
                                icon={<Users size={24} className="text-green-600" />}
                            />
                            <StatCard
                                title="Total Expenses"
                                value={`RS.${crops.reduce((sum, crop) => sum + (crop.expenses || 0), 0)}`}
                                change=""
                                isPositive={false}
                                icon={<BarChart2 size={24} className="text-purple-600" />}
                            />
                        </div>

                        <div className="mt-6">
                            <h2 className="text-xl font-bold mb-4">Your Crops</h2>
                            {crops.length === 0 ? (
                                <p>No crops found</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {crops.map((crop) => (
                                        <div
                                            key={crop._id}
                                            className="p-6 border rounded-xl shadow-lg bg-white dark:bg-gray-900 relative overflow-hidden transition-transform transform hover:scale-105"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 opacity-20 rounded-xl"></div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{crop.nameOfCrop}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 mt-2">{crop.description}</p>
                                            <div className="mt-4 space-y-2">
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                                    <span className="font-bold text-green-600 dark:text-green-400">Category:</span> {crop.category}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                                    <span className="font-bold text-green-600 dark:text-green-400">Sowing Date:</span> {crop.sowingDate}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                                    <span className="font-bold text-green-600 dark:text-green-400">Expected Harvest:</span> {crop.expectedHarvestDate}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                                    <span className="font-bold text-green-600 dark:text-green-400">Revenue:</span> Rs.{crop.revenue}
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-400">
                                                    <span className="font-bold text-red-500 dark:text-red-400">Expenses:</span> RS.{crop.expenses}
                                                </p>
                                            </div>
                                            <div className="absolute top-2 right-2">
                                                <button onClick={() => handleDeleteCrop(crop._id)} className="text-red-500 hover:text-red-700">
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            )}
                        </div>
                    </>

                );
            case 'add info':
                return (
                    <div className="mt-5 p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-xl border border-gray-300 dark:border-gray-700">
    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
        🌱 Add Crop Information
    </h2>
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {/* Crop Name & Category */}
        <div className="grid grid-cols-2 gap-6">
            <input
                type="text"
                name="nameOfCrop"
                placeholder="🌾 Crop Name"
                value={cropData.nameOfCrop}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
                required
            />
            <input
                type="text"
                name="category"
                placeholder="📋 Crop Category"
                value={cropData.category}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
                required
            />
        </div>

        {/* Crop Description */}
        <textarea
            name="description"
            placeholder="📝 Crop Description"
            value={cropData.description}
            onChange={handleChange}
            className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
        ></textarea>

        {/* Dates & Fertilizer/Pesticide Info */}
        <div className="grid grid-cols-2 gap-6">
            <input
                type="date"
                name="sowingDate"
                value={cropData.sowingDate}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
                required
            />
            <input
                type="date"
                name="expectedHarvestDate"
                value={cropData.expectedHarvestDate}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
            />
        </div>

        <div className="grid grid-cols-2 gap-6">
            <input
                type="text"
                name="fertilizersUsed"
                placeholder="🌿 Fertilizers Used"
                value={cropData.fertilizersUsed}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
            />
            <input
                type="text"
                name="pesticidesUsed"
                placeholder="🐜 Pesticides Used"
                value={cropData.pesticidesUsed}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
            />
        </div>

        {/* Financial Tracking */}
        <label className="text-xl font-bold text-gray-800 dark:text-gray-300">💰 Financial Tracking</label>
        <div className="grid grid-cols-2 gap-6">
            <input
                type="number"
                name="expenses"
                placeholder="📉 Expenses (RS.)"
                value={cropData.expenses}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
            />
            <input
                type="number"
                label=""
                name="revenue"
                placeholder="📈 Revenue (RS.)"
                value={cropData.revenue}
                onChange={handleChange}
                className="w-full p-4 border rounded-xl bg-gray-50 dark:bg-gray-800 dark:text-white focus:ring-4 focus:ring-green-500 outline-none shadow-sm"
            />
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            className="w-full bg-green-600 text-white py-4 rounded-xl text-lg font-bold hover:bg-green-700 transition-all shadow-md"
        >
            ✅ Save Crop Data
        </button>
    </form>
</div>


                );

            case 'analytics':
                return <CropDashboard crops={crops} />;


            case 'Ask AI':
               
            return <div className="p-6">
                    
                    <CropAnalysis crops={crops} />
                </div>

            case 'ibmcrop':
            default:
                return <IBMMLComponent />;
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            {renderContent()}
        </div>
    );
}

function StatCard({ title, value, change, isPositive, icon }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>{icon}</div>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
            <div className="flex items-baseline space-x-4">
                <span className="text-2xl font-bold">{value}</span>
                <span className={`flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                    {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    {change}
                </span>
            </div>
        </div>
    );
}

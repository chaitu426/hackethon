import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/clerk-react";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();
  const [cropData, setCropData] = useState({
    name: "",
    description: "",
    category: "",
    sowingDate: "",
    expectedHarvestDate: "",
    fertilizersUsed: "",
    expenses: "",
    revenue: "",
  });

  // Send user data to backend on login
  useEffect(() => {
    if (isSignedIn && user) {
      const userData = {
        id: user.id,
        name: user.firstName,
        email: user.primaryEmailAddress?.emailAddress,
      };

      fetch("http://localhost:3000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
        .then((res) => res.json())
        .then((data) => console.log("User saved:", data))
        .catch((err) => console.error("Error saving user:", err));
    }
  }, [isSignedIn, user]);

  // Handle form input changes
  const handleChange = (e) => {
    setCropData({ ...cropData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:3000/api/add-crop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cropData),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Crop saved:", data);
        alert("Crop data added successfully!");
      })
      .catch((err) => console.error("Error adding crop:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <UserButton afterSignOutUrl="/login" />
      </div>

      {/* User Info Section */}
      {isSignedIn && user && (
        <div className="mt-5 p-5 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700">User Info</h2>
          <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
          <p><strong>Clerk ID:</strong> {user.id}</p>
        </div>
      )}

      {/* Crop Entry Form */}
      <div className="mt-5 p-5 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-700">Add Crop Information</h2>
        <form onSubmit={handleSubmit} className="mt-3 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Crop Name"
              value={cropData.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="category"
              placeholder="Crop Category"
              value={cropData.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <textarea
            name="description"
            placeholder="Crop Description"
            value={cropData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
            required
          ></textarea>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="sowingDate"
              value={cropData.sowingDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
            <input
              type="date"
              name="expectedHarvestDate"
              value={cropData.expectedHarvestDate}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
              required
            />
          </div>
          <input
            type="text"
            name="fertilizersUsed"
            placeholder="Fertilizers Used (comma separated)"
            value={cropData.fertilizersUsed}
            onChange={handleChange}
            className="w-full p-2 border rounded-lg"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              name="expenses"
              placeholder="Total Expenses (₹)"
              value={cropData.expenses}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
            <input
              type="number"
              name="revenue"
              placeholder="Total Revenue (₹)"
              value={cropData.revenue}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Save Crop Data
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;

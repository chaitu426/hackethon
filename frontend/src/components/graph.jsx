import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { IndianRupee, Leaf, TrendingUp, TrendingDown, Calendar, Bell, FileMinus } from "lucide-react";

const Card = ({ children, className }) => (
    <div className={`p-4 bg-white dark:bg-gray-900 rounded-xl shadow flex items-center gap-4 ${className}`}>
        {children}
    </div>
);

const CardContent = ({ title, value, className }) => (
    <div className={className}>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
        <p className="text-xl font-semibold text-gray-800 dark:text-white">{value}</p>
    </div>
);

const calculateDaysLeft = (harvestDate) => {
    if (!harvestDate) return "N/A";
    const today = new Date();
    const harvest = new Date(harvestDate);
    const timeDiff = harvest - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft >= 0 ? daysLeft : 0;
};

const CropDashboard = ({ crops }) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (crops) {
            const alerts = crops
                .filter(crop => calculateDaysLeft(crop.expectedHarvestDate) <= 3)
                .map(crop => `${crop.nameOfCrop} is ready for harvest in ${calculateDaysLeft(crop.expectedHarvestDate)} days!`);
            setNotifications(alerts);
        }
    }, [crops]);

    if (!crops || crops.length === 0) {
        return <p className="text-center text-gray-500">No crop data available.</p>;
    }

    // Statistics Calculation
    const totalCrops = crops.length;
    const totalRevenue = crops.reduce((sum, crop) => sum + (crop.revenue || 0), 0);
    const totalExpenses = crops.reduce((sum, crop) => sum + (crop.expenses || 0), 0);
    const avgExpenses = totalCrops > 0 ? (totalExpenses / totalCrops).toFixed(2) : 0;

    // Expense Analysis
    const highestExpenseCrop = crops.reduce((max, crop) => (crop.expenses > max.expenses ? crop : max), crops[0]);
    const lowestExpenseCrop = crops.reduce((min, crop) => (crop.expenses < min.expenses ? crop : min), crops[0]);

    // Harvest Analysis
    const harvestData = crops.map(crop => ({
        name: crop.nameOfCrop,
        daysLeft: calculateDaysLeft(crop.expectedHarvestDate),
        expenses: crop.expenses || 0
    }));

    // Data for Charts
    const revenueData = crops.map(crop => ({
        name: crop.nameOfCrop,
        Revenue: crop.revenue || 0,
        Expenses: crop.expenses || 0,
    }));

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-5">
            {/* Notifications */}
            {notifications.length > 0 && (
                <div className="col-span-3 bg-red-100 dark:bg-red-900 p-3 rounded-lg shadow-md">
                    <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                        <Bell size={20} />
                        <h3 className="font-semibold">Harvest Alerts</h3>
                    </div>
                    <ul className="text-sm mt-2">
                        {notifications.map((alert, index) => (
                            <li key={index} className="text-red-600 dark:text-red-400">⚠️ {alert}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Stat Cards */}
            <Card>
                <IndianRupee size={24} className="text-green-600" />
                <CardContent title="Total Revenue" value={`RS.${totalRevenue}`} />
            </Card>

            <Card>
                <Leaf size={24} className="text-blue-600" />
                <CardContent title="Total Crops" value={totalCrops} />
            </Card>

            <Card>
                {avgExpenses > 0 ? (
                    <TrendingDown size={24} className="text-red-600" />
                ) : (
                    <TrendingUp size={24} className="text-green-600" />
                )}
                <CardContent title="Avg. Expenses" value={`RS.${avgExpenses}`} />
            </Card>

            {/* Expense Analysis */}
            <Card className="col-span-2">
                <FileMinus size={24} className="text-purple-600" />
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Expense Analysis</h3>
                    <ul className="text-gray-800 dark:text-white text-sm">
                        <li>💸 <strong>Highest Expense Crop:</strong> {highestExpenseCrop.nameOfCrop} - RS.{highestExpenseCrop.expenses}</li>
                        <li>💰 <strong>Lowest Expense Crop:</strong> {lowestExpenseCrop.nameOfCrop} - RS.{lowestExpenseCrop.expenses}</li>
                        <li>📉 <strong>Total Expenses:</strong> RS.{totalExpenses}</li>
                    </ul>
                </div>
            </Card>

            {/* Harvest Analysis */}
            <Card className="col-span-2">
                <Calendar size={24} className="text-yellow-600" />
                <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Harvest Analysis</h3>
                    <ul className="text-gray-800 dark:text-white text-sm">
                        {harvestData.map((crop, index) => (
                            <li key={index} className={`py-1 ${crop.daysLeft === 0 ? "text-red-500 font-bold" : ""}`}>
                                🌱 {crop.name}: <span>{crop.daysLeft > 0 ? `${crop.daysLeft} days left` : "Ready for harvest"}</span> | 💰 Expenses: RS.{crop.expenses}
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>

            {/* Bar Chart - Revenue vs Expenses */}
            <div className="col-span-2 bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">📊 Revenue vs. Expenses</h3>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={revenueData}>
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="Revenue" fill="#4CAF50" radius={[5, 5, 0, 0]} />
                        <Bar dataKey="Expenses" fill="#F44336" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default CropDashboard;

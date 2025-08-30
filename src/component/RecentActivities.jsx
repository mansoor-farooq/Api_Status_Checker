import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { Link } from "react-router-dom"; // 👈 Add this import

const COLORS = ["#4CAF50", "#F44336", "#2196F3"]; // Green, Red, Blue

const Dashboard = ({ globalServicesData }) => {
    const safeData = Array.isArray(globalServicesData) ? globalServicesData : [];

    const chartData = useMemo(() => {
        const total = safeData.length;
        const working = safeData.filter(api => api.status_code === 200).length;
        const errors = safeData.filter(
            api =>
                api.status_code >= 400 ||
                api.status_code === "ERROR" ||
                api.status_code === "UNSUPPORTED"
        ).length;
        const successRate = total > 0 ? Math.round((working / total) * 100) : 0;

        return [
            { name: "Working APIs", value: working, link: "/fruntend_youngbazer" },
            { name: "Error APIs", value: errors, link: "/fruntend_youngbazer" },
            { name: "Success Rate (%)", value: successRate, link: "/fruntend_youngbazer" },
        ];
    }, [safeData]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Services Dashboard</h2>

            {/* Stats Boxes with Links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {chartData.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className="p-4 bg-white rounded shadow font-semibold transition-transform hover:scale-105 cursor-pointer"
                    >
                        <span
                            className={
                                index === 0
                                    ? "text-green-600"
                                    : index === 1
                                        ? "text-red-600"
                                        : "text-blue-600"
                            }
                        >
                            {stat.name}: {stat.value}
                            {stat.name.includes("Rate") && "%"}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Donut Chart */}
            <div className="bg-white p-4 rounded shadow mb-6">
                <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={3}
                            label
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;

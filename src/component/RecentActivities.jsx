import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";
import { Link } from "react-router-dom";
import { IoBarChart, IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";

const COLORS = ["#22c55e", "#ef4444", "#3b82f6"]; // green, red, blue

const Dashboard = ({ globalServicesData }) => {
    const safeData = Array.isArray(globalServicesData) ? globalServicesData : [];

    const chartData = useMemo(() => {
        const total = safeData.length;
        const working = safeData.filter((api) => api.status_code === 200).length;
        const errors = safeData.filter(
            (api) =>
                api.status_code >= 400 ||
                api.status_code === "ERROR" ||
                api.status_code === "UNSUPPORTED"
        ).length;
        const successRate = total > 0 ? Math.round((working / total) * 100) : 0;

        return [
            {
                name: "Working APIs",
                value: working,
                link: "/services_status",
                color: "green",
                icon: IoCheckmarkCircle,
            },
            {
                name: "Error APIs",
                value: errors,
                link: "/services_status",
                color: "red",
                icon: IoCloseCircle,
            },
            {
                name: "Success Rate",
                value: successRate,
                link: "/services_status",
                color: "blue",
                icon: IoBarChart,
                isPercentage: true,
            },
        ];
    }, [safeData]);

    return (
        <div className="p-4 bg-gray-100 min-h-screen">
            <h2 className="text-xl font-bold mb-4">📊 Services Dashboard</h2>

            {/* Compact Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {chartData.map((stat, index) => (
                    <Link
                        key={index}
                        to={stat.link}
                        className={`p-3 rounded-lg shadow-sm border bg-gradient-to-br 
              from-${stat.color}-50 to-${stat.color}-100 
              hover:scale-105 hover:shadow-md transition-transform`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`p-2 bg-${stat.color}-200 rounded-full`}>
                                <stat.icon className={`text-${stat.color}-700`} size={20} />
                            </div>
                            <div>
                                <h3 className="text-xs text-gray-500">{stat.name}</h3>
                                <p className={`text-lg font-bold text-${stat.color}-800`}>
                                    {stat.value}
                                    {stat.isPercentage && "%"}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Compact Donut Chart */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="text-base font-semibold mb-3">API Status Overview</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
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

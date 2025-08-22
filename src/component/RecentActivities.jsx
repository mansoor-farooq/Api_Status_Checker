
// import React, { useEffect, useMemo, useState } from "react";
// import {
//     ResponsiveContainer,
//     PieChart,
//     Pie,
//     Cell,
//     Tooltip,
//     Legend,
// } from "recharts";

// // Utility to show "time ago"
// const timeAgo = (dateString) => {
//     if (!dateString) return "N/A";
//     const diffMs = Date.now() - new Date(dateString).getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     if (diffMins < 1) return "Just now";
//     if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
//     const diffHrs = Math.floor(diffMins / 60);
//     if (diffHrs < 24) return `${diffHrs} hr${diffHrs > 1 ? "s" : ""} ago`;
//     const diffDays = Math.floor(diffHrs / 24);
//     return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
// };

// const Dashboard = ({ globalServicesData, servicesData }) => {
//     const safeData = Array.isArray(globalServicesData) ? globalServicesData : [];
//     const [myChartData, setmyChartData] = useState([]);
//     console.log('in chart page', servicesData)
//     // Count status types for chart
//     const serviceStatusData = useMemo(() => {
//         return safeData.reduce(
//             (acc, service) => {
//                 if (service.status === "Operational") acc.operational++;
//                 else if (service.status === "Degraded") acc.degraded++;
//                 else if (service.status === "Down") acc.down++;
//                 return acc;
//             },
//             { operational: 0, degraded: 0, down: 0 }
//         );
//     }, [safeData]);
//     const prepareDataforChart = (data) => {
//         let temp = [];
//         servicesData.map((item) => {
//             const { services_name, status } = item
//             temp.push({ name: services_name, value: status ? 200 : 500 })
//         })
//         setmyChartData(temp)

//         console.log("graph-data", temp)
//     }
//     // Sort & limit for recent activity
//     const recentActivity = useMemo(() => {
//         return [...safeData]
//             .sort((a, b) => new Date(b.lastChecked) - new Date(a.lastChecked))
//             .slice(0, 5);
//     }, [safeData]);
//     useEffect(() => {
//         prepareDataforChart(servicesData)
//     }, [safeData])
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h2 className="text-2xl font-bold mb-6">Services Dashboard</h2>

//             {/* Status Summary */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//                 <div className="p-4 bg-white rounded shadow text-green-600 font-semibold">
//                     Operational: {serviceStatusData.operational}
//                 </div>
//                 <div className="p-4 bg-white rounded shadow text-yellow-600 font-semibold">
//                     Degraded: {serviceStatusData.degraded}
//                 </div>
//                 <div className="p-4 bg-white rounded shadow text-red-600 font-semibold">
//                     Down: {serviceStatusData.down}
//                 </div>
//             </div>

//             {/* Chart */}
//             <div className="bg-white p-4 rounded shadow mb-6">
//                 <ResponsiveContainer width="100%" height={500}>
//                     {/* <PieChart>
//                         <Pie
//                             dataKey="value"
//                             data={[
//                                 { name: "Operational", value: serviceStatusData.operational },
//                                 { name: "Degraded", value: serviceStatusData.degraded },
//                                 { name: "Down", value: serviceStatusData.down },
//                             ]}
//                             // data={myChartData}
//                             cx="50%"
//                             cy="50%"
//                             innerRadius={60}
//                             outerRadius={100}
//                             label
//                         >
//                             <Cell fill="#4caf50" />
//                             <Cell fill="#ff9800" />
//                             <Cell fill="#f44336" />
//                         </Pie>
//                         <Tooltip />
//                         <Legend />
//                     </PieChart> */}
//                     <PieChart width={730} height={250}>
//                         <Pie data={myChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={50} fill="#8884d8" />
//                         <Pie data={myChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={80} fill="#82ca9d" label />
//                     </PieChart>
//                 </ResponsiveContainer>
//             </div>

//             {/* Recent Activity */}
//             <div className="bg-white p-4 rounded shadow">
//                 <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
//                 {servicesData.length === 0 ? (
//                     <p>No recent activity available</p>
//                 ) : (
//                     <ul className="divide-y divide-gray-200">
//                         {servicesData.map((item, idx) => (
//                             <li key={idx} className="py-2 flex justify-between">
//                                 <span>{item.services_name} — {item.status ? "OK API HEALTH" : 'BAD'}</span>
//                                 <span className="text-gray-500 text-sm">{timeAgo(item.creted_at)}</span>
//                             </li>
//                         ))}
//                     </ul>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default Dashboard;



import React, { useMemo } from "react";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
} from "recharts";

// Colors for the chart
const COLORS = ["#4CAF50", "#F44336", "#2196F3"]; // Green, Red, Blue

const Dashboard = ({ globalServicesData }) => {
    const safeData = Array.isArray(globalServicesData) ? globalServicesData : [];

    // Compute stats for chart
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
            { name: "Working APIs", value: working },
            { name: "Error APIs", value: errors },
            { name: "Success Rate (%)", value: successRate },
        ];
    }, [safeData]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-6">Services Dashboard</h2>

            {/* Stats Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-white rounded shadow text-green-600 font-semibold">
                    Working APIs: {chartData[0]?.value}
                </div>
                <div className="p-4 bg-white rounded shadow text-red-600 font-semibold">
                    Error APIs: {chartData[1]?.value}
                </div>
                <div className="p-4 bg-white rounded shadow text-blue-600 font-semibold">
                    Success Rate: {chartData[2]?.value}%
                </div>
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
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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

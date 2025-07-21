// // RecentActivity.js
// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { ClockIcon } from '@heroicons/react/24/outline';
// import { Doughnut } from 'react-chartjs-2';

// const dummyActivities = [
//     { id: 1, type: 'youngs Bazer', name: 'Youngs Bazer Fruntend', time: '2 mins ago' },
//     { id: 2, type: 'Invertry Service', name: ' Karachi Center', time: '10 mins ago' },
//     { id: 3, type: 'Sap Services', name: 'Sap Services', time: '30 mins ago' },
//     { id: 1, type: 'SSCP', name: 'SSCP Service', time: '2 mins ago' },
//     { id: 2, type: 'Dynimic Services', name: ' Dynimic Services', time: '10 mins ago' },
//     { id: 3, type: 'Backend Young Bazer', name: 'Youngs Bazer Backend', time: '30 mins ago' },
// ];

// const RecentActivity = () => {
//     const [activities, setActivities] = useState([]);

//     useEffect(() => {
//         const timeout = setTimeout(() => {
//             setActivities(dummyActivities);
//         }, 500);
//         return () => clearTimeout(timeout);
//     }, []);


//     return (
//         <div className="w-full">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800 px-4 sm:px-6 lg:px-8">
//                 Recent Activity
//             </h2>
//           
//             <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ delay: 0.5, duration: 0.5 }}
//                 className="w-full px-4 sm:px-6 lg:px-8"
//             >
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
//                     {activities.map((activity, index) => (
//                         <motion.div
//                             key={activity.id}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: index * 0.1, duration: 0.5 }}
//                             className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all w-full"
//                         >
//                             <div className="flex items-start space-x-4">
//                                 <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
//                                     <ClockIcon className="h-5 w-5 text-blue-500" />
//                                 </div>
//                                 <div className="flex-1">
//                                     <p className="text-sm font-medium text-gray-900">{activity.type}</p>
//                                     <p className="text-sm text-gray-600 mt-1">{activity.name}</p>
//                                     <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     ))}
//                 </div>
//             </motion.div>
//         </div>
//     );
// };

// export default RecentActivity;


import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon } from '@heroicons/react/24/outline';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const dummyActivities = [
    { id: 1, type: 'youngs Bazer', name: 'Youngs Bazer Fruntend', time: '2 mins ago' },
    { id: 2, type: 'Invertry Service', name: ' Karachi Center', time: '10 mins ago' },
    { id: 3, type: 'Sap Services', name: 'Sap Services', time: '30 mins ago' },
    { id: 4, type: 'SSCP', name: 'SSCP Service', time: '2 mins ago' },
    { id: 5, type: 'Dynimic Services', name: ' Dynimic Services', time: '10 mins ago' },
    { id: 6, type: 'Backend Young Bazer', name: 'Youngs Bazer Backend', time: '30 mins ago' },
];

const RecentActivity = () => {
    const [activities, setActivities] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setActivities(dummyActivities);
        }, 500);
        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const activityCounts = activities.reduce((acc, activity) => {
        acc[activity.type] = (acc[activity.type] || 0) + 1;
        return acc;
    }, {});

    const chartData = {
        labels: Object.keys(activityCounts),
        datasets: [
            {
                label: 'Activity Count',
                data: Object.values(activityCounts),
                backgroundColor: [
                    '#6366F1',
                    '#F59E0B',
                    '#10B981',
                    '#EF4444',
                    '#3B82F6',
                    '#8B5CF6',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="w-full">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 px-4 sm:px-6 lg:px-8">
                Recent Activity
            </h2>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="w-full px-4 sm:px-6 lg:px-8"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                    {activities.map((activity, index) => (
                        <motion.div
                            key={activity.id} // Unique IDs ensure no key warnings
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-all w-full"
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
                                    <ClockIcon className="h-5 w-5 text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                                    <p className="text-sm text-gray-600 mt-1">{activity.name}</p>
                                    <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {activities.length > 0 && (
                <div className="h-64 w-full max-w-md mx-auto mb-6">
                    <Doughnut
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                            },
                        }}
                    />
                </div>
            )}



        </div>
    );
};

export default RecentActivity;
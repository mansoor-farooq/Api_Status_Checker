// import React, { useEffect, useLayoutEffect, useState } from 'react';
// import Layout from '../component/Layout';
// import axios from 'axios';

// const YoungBazerHealth = () => {
//     const [status, setStatus] = useState('');

//     // useEffect(() => {
//     const fetchYoungBazerHealth = async () => {
//         try {
//             await axios.get('http://202.143.125.148:9000/health')
//                 .then(response => {
//                     console.log("Young Bazer health response:", response);
//                     setStatus(response.data.status);
//                 })
//                 .catch(error => {
//                     console.error("Error fetching Young Bazer health data:", error);
//                     setStatus('ERROR');
//                 });
//         } catch (error) {
//             console.error("Error fetching Young Bazer health data:", error);
//             setStatus('ERROR');
//         }
//     };

//     fetchYoungBazerHealth();
//     // }, []);


//     return (
//         <Layout>
//             <div className="container mx-auto px-4 py-8">
//                 <h1 className="text-3xl font-bold mb-4">Young Bazer Health</h1>
//                 <p className="text-lg mb-4">A health monitoring system for backend service status.</p>

//                 <div className="overflow-x-auto mt-8">
//                     <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">
//                         <thead className="bg-gray-100">
//                             <tr>
//                                 <th className="px-4 py-3 border text-left">S.No</th>
//                                 <th className="px-4 py-3 border text-left">Service</th>
//                                 <th className="px-4 py-3 border text-left">Status</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             <tr className="hover:bg-gray-50">
//                                 <td className="px-4 py-3 border">1</td>
//                                 <td className="px-4 py-3 border">Young Bazer Backend</td>
//                                 <td className="px-4 py-3 border font-semibold">

//                                     <span
//                                         className={`h-3 w-3 rounded-full inline-block  ${status === 'ERROR'
//                                             ? 'bg-red-500'
//                                             : status === 'OK'
//                                                 ? 'bg-green-500'
//                                                 : 'bg-yellow-500'
//                                             }`}
//                                     ></span>


//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>
//                 </div>

//             </div>
//         </Layout>
//     );
// };

// export default YoungBazerHealth;
import React, { useEffect, useState } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';

const YoungBazerHealth = () => {
    const [status, setStatus] = useState('PENDING');

    useEffect(() => {
        const fetchYoungBazerHealth = async () => {
            try {
                const response = await axios.get('http://202.143.125.148:9000/health'); // Use '/api/health' if proxy is set up
                console.log('Young Bazer health response:', response.data);
                setStatus(response.data.status || 'OK');
            } catch (error) {
                console.error('Error fetching Young Bazer health data:', error);
                setStatus('ERROR');
            }
        };

        fetchYoungBazerHealth();
    }, []); // Empty dependency array to run once on mount

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">Young Bazer Health</h1>
                <p className="text-lg mb-4">A health monitoring system for backend service status.</p>

                <div className="overflow-x-auto mt-8">
                    <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 border text-left">S.No</th>
                                <th className="px-4 py-3 border text-left">Service</th>
                                <th className="px-4 py-3 border text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 border">1</td>
                                <td className="px-4 py-3 border">Young Bazer Backend</td>
                                <td className="px-4 py-3 border font-semibold">
                                    <span
                                        className={`h-3 w-3 rounded-full inline-block ${status === 'ERROR'
                                            ? 'bg-red-500'
                                            : status === 'OK'
                                                ? 'bg-green-500'
                                                : 'bg-yellow-500'
                                            }`}
                                    ></span>
                                    {/* {status} */}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default YoungBazerHealth;
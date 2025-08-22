// import React, { useEffect, useState, useMemo } from 'react';
// import Layout from '../component/Layout';
// import axios from 'axios';
// import { IoClose, IoEyeOff, IoRefresh } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const Youngbazerfruntend = () => {
//   const [loading, setLoading] = useState(true);
//   const [servicesData, setServicesData] = useState([]);
//   const [search, setSearch] = useState('');
//   const [services, setServices] = useState([]);
//   const [mathodsearch, setMethodSearch] = useState('');
//   const [statusSearch, setStatusSearch] = useState('');
//   const [errorSearch, setErrorSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setsearchTerm] = useState('');
//   const [globalServicesData, setGlobalServicesData] = useState([]);
//   const itemsPerPage = 8;
//   const navigate = useNavigate();

//   // CSS for loading animation
//   const loadingStyle = `
//     .loader {
//       width: 48px;
//       height: 48px;
//       border: 5px solid #FFF;
//       border-bottom-color: #6366F1;
//       border-radius: 50%;
//       display: inline-block;
//       box-sizing: border-box;
//       animation: rotation 1s linear infinite;
//     }
//     @keyframes rotation {
//       0% { transform: rotate(0deg); }
//       100% { transform: rotate(360deg); }
//     }
//     @media (max-width: 640px) {
//       .loader {
//         width: 36px;
//         height: 36px;
//         border-width: 4px;
//       }
//     }
//   `;
//   const fetchdata = () => {
//     axios.get('http://localhost:7070/get-services', { timeout: 10000 }) // 10-second timeout
//       .then((response) => {
//         console.log("get_serv", response.data.data);
//         setServices(response.data.data);
//       })
//       .catch((error) => {
//         console.log("error", error);
//         setLoading(false); // Stop loading on error
//       });
//   };
//   function mapingdata() {
//     setLoading(true);
//     setServicesData([]); // reset

//     const calls = services.map((dt) => {
//       const method = dt.method?.toUpperCase();
//       const url = dt.api_url;
//       const auth = dt.auth;
//       const payload = dt.request_payload || {};
//       const services_name = dt.services_name || dt.name || url;

//       const config = {
//         ...(auth ? { auth: { username: auth.Username, password: auth.password } } : {}),
//         timeout: 5000, // 5-second timeout per request
//       };

//       console.log("aut", auth);
//       let axiosCall;
//       if (method === 'GET' || method === 'DELETE') {
//         axiosCall = axios[method.toLowerCase()](url, config);
//       } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
//         axiosCall = axios[method.toLowerCase()](url, payload, config);
//       } else {
//         return Promise.resolve({
//           services_name,
//           method,
//           api_url: url,
//           status_code: 'UNSUPPORTED',
//           error: 'Unsupported method',
//           duration_ms: 0,
//         });
//       }

//       const started = Date.now();

//       return axiosCall
//         .then((response) => ({
//           services_name,
//           method,
//           api_url: url,
//           status_code: response.status,
//           error: null,
//           duration_ms: Date.now() - started,
//         }))
//         .catch((err) => ({
//           services_name,
//           method,
//           api_url: url,
//           status_code: err?.response?.status ?? 'ERROR',
//           error:
//             err?.response?.data?.message ||
//             err?.response?.data?.error ||
//             err?.code ||
//             err?.message ||
//             'Unknown error',
//           duration_ms: Date.now() - started,
//         }));
//     });

//     Promise.all(calls)
//       .then((rows) => {
//         const indexedRows = rows.map((row, index) => ({
//           ...row,
//           globalIndex: index + 1
//         }));
//         setGlobalServicesData(indexedRows);
//         setServicesData(indexedRows);
//       })
//       .finally(() => setLoading(false));
//   };
//   useEffect(() => {
//     fetchdata();
//   }, []);
//   useEffect(() => {
//     if (services.length > 0) {
//       mapingdata(); // Only run after services are fetched
//     }
//   }, [services]);
//   const filtered = globalServicesData.filter((service) => {
//     const matchesSNo = searchTerm ?
//       String(service.globalIndex).includes(searchTerm) :
//       true;
//     const matchesName = search ?
//       service.services_name?.toLowerCase().includes(search.toLowerCase()) :
//       true;
//     const matchesMethod = mathodsearch ?
//       service.method?.toLowerCase() === mathodsearch.toLowerCase() :
//       true;
//     const matchesStatus = statusSearch ?
//       String(service.status_code) === statusSearch :
//       true;
//     const matchesError = errorSearch ?
//       service.error?.toLowerCase().includes(errorSearch.toLowerCase()) :
//       true;

//     return matchesSNo && matchesName && matchesMethod && matchesStatus && matchesError;
//   });
//   const clearAllFilters = () => {
//     setSearch('');
//     setMethodSearch('');
//     setsearchTerm('');
//     setErrorSearch('');
//     setStatusSearch('');
//   };
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);
//   // Status dot color (circle indicator)
//   const statusDot = (code) => {
//     if (code === 200) return 'bg-green-500'; // Success - Green
//     if (code >= 200 && code < 300) return 'bg-yellow-500'; // Other 2xx -Yellow
//     if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'bg-red-500'; // Errors - Red
//     return 'bg-gray-500'; // Default - Gray
//   };
//   // Status text color
//   const statusColor = (code) => {
//     if (code === 200) return 'text-green-600'; // Success - Green
//     if (code >= 200 && code < 300) return 'text-yellow-600'; // Other 2xx - Yellow
//     if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'text-red-600'; // Errors - Red
//     return 'text-gray-600'; // Default - Gray
//   };
//   return (
//     <Layout>
//       <style>{loadingStyle}</style>
//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center max-w-sm mx-2 border border-gray-200">
//             <div className="loader mx-auto mb-3"></div>
//             <p className="text-gray-900 font-semibold text-sm">
//               Checking services status...
//             </p>
//             <p className="text-gray-600 text-xs mt-1">
//               Please wait while we verify all endpoints
//             </p>
//           </div>
//         </div>
//       )}
//       <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 mt-6 shadow-xl">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">
//             Services Dashboard
//           </h1>
//           <div className="flex gap-2 sm:gap-3">
//             <button
//               onClick={mapingdata}
//               disabled={loading}
//               className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-indigo-700"
//             >
//               <IoRefresh className="mr-1 sm:mr-2" size={14} />
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </button>
//             <button
//               onClick={() => navigate('/add_sevice')}
//               disabled={loading}
//               className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-indigo-700"
//             >
//               Add Service
//             </button>
//           </div>
//         </div>

//         <div className="w-full overflow-x-auto shadow-xl">
//           <div className="w-full overflow-x-auto rounded-lg shadow-md shadow-xl">
//             <table className="min-w-full text-[11px] text-sm text-left border">
//               <thead className="bg-indigo-600 text-white text-[10px] sm:text-xs uppercase">
//                 <tr>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">S.No</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Service</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Method</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Status</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Error</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-center">Actions</th>
//                 </tr>
//                 <tr className="bg-gray-100 text-[10px] sm:text-xs">
//                   {/* S.No Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="S.No"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={searchTerm}
//                         onChange={(e) => setsearchTerm(e.target.value)}
//                       />
//                       {searchTerm && (
//                         <button
//                           onClick={() => setsearchTerm('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Service Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Service"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                       />
//                       {search && (
//                         <button
//                           onClick={() => setSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                   {/* method */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Method"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={mathodsearch}
//                         onChange={(e) => setMethodSearch(e.target.value)}
//                       />
//                       {mathodsearch && (
//                         <button
//                           onClick={() => setMethodSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Status Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         title='ma anas bhi'
//                         type="text"
//                         placeholder="Status"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={statusSearch}
//                         onChange={(e) => setStatusSearch(e.target.value)}
//                       />
//                       {statusSearch && (
//                         <button
//                           onClick={() => setStatusSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Error Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Error"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={errorSearch}
//                         onChange={(e) => setErrorSearch(e.target.value)}
//                       />
//                       {errorSearch && (
//                         <button
//                           onClick={() => setErrorSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Clear All Button */}
//                   <td className="text-center border border-gray-200 p-[6px] sm:p-2">
//                     <button
//                       onClick={clearAllFilters}
//                       className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200"
//                     >
//                       Clear All
//                     </button>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((item) => (
//                   <tr key={item.globalIndex} className="border-t">
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
//                       {item.globalIndex}
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">{item.services_name}</td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">{item.method}</td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-gray-300">
//                       <div className="flex items-center justify-center gap-1 sm:gap-2 h-full">
//                         <span className={`w-3 h-3 rounded-full inline-block ${statusDot(item.status_code)}`} />
//                         <span className={`text-xs sm:text-sm font-medium ${statusColor(item.status_code)}`}>
//                           {item.status_code}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black text-center border-2 border-gray-300">
//                       {item.error || '—'}
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
//                       <button
//                         className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors"
//                         aria-label="View details"
//                         onClick={() => {
//                           Swal.fire({
//                             title: `<strong>${item.services_name || "Service"}</strong>`,
//                             html: `
//                               <div style="text-align: left; font-size: 14px;">
//                                 ${item.api_url ? `
//                                   <p><strong>API URL:</strong></p>
//                                   <div style="word-break: break-all; background-color:#f0f0f0; padding: 8px; border-radius: 4px;">
//                                     <a href="${item.api_url}" target="_blank">${item.api_url}</a>
//                                   </div>
//                                 ` : ''}
//                               </div>
//                             `,
//                             showCancelButton: true,
//                             cancelButtonText: 'Close',
//                             showConfirmButton: !!item.api_url,
//                             icon: 'info',
//                             customClass: {
//                               popup: 'rounded-lg',
//                             }
//                           });
//                         }}
//                       >
//                         <IoEyeOff className="text-sm" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="w-full bg-indigo-600 text-white px-2 py-1.5">
//             <div className="flex flex-col xs:flex-row items-center justify-between gap-1 w-full">
//               <div className="w-full xs:w-auto text-center xs:text-left text-xs">
//                 <span className="font-medium">
//                   Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, servicesData.length)} of {servicesData.length}
//                 </span>
//               </div>
//               <div className="w-full xs:w-auto flex items-center justify-between gap-1">
//                 <button
//                   className="flex-1 xs:flex-none flex items-center justify-center px-2 py-0.5 rounded border border-indigo-400 hover:bg-indigo-700 disabled:opacity-50 text-xs min-w-[60px]"
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1 || loading}
//                 >
//                   <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Prev
//                 </button>
//                 <div className="text-xs font-medium px-1 whitespace-nowrap">
//                   Page {currentPage} of {totalPages}
//                 </div>
//                 <button
//                   className="flex-1 xs:flex-none flex items-center justify-center px-2 py-0.5 rounded border border-indigo-400 hover:bg-indigo-700 disabled:opacity-50 text-xs min-w-[60px]"
//                   onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
//                   disabled={currentPage === totalPages || loading}
//                 >
//                   Next
//                   <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default Youngbazerfruntend;




// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import Layout from '../component/Layout';
// import axios from 'axios';
// import { IoClose, IoEyeOff, IoRefresh } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// const Youngbazerfruntend = () => {
//   const [loading, setLoading] = useState(true);
//   const [servicesData, setServicesData] = useState([]);
//   const [search, setSearch] = useState("");
//   const [services, setServices] = useState([]);
//   const [mathodsearch, setMethodSearch] = useState("");
//   const [statusSearch, setStatusSearch] = useState("");
//   const [errorSearch, setErrorSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setsearchTerm] = useState("");
//   const [globalServicesData, setGlobalServicesData] = useState([]);
//   const [refreshCount, setRefreshCount] = useState(0);
//   const [dataAdditionCount, setDataAdditionCount] = useState(0);

//   const itemsPerPage = 8;
//   const navigate = useNavigate();

//   // CSS loader
//   // CSS loader - Improved with better animation and accessibility
//   const loadingStyle = `
//   .loader {
//     width: 48px;
//     height: 48px;
//     border: 5px solid rgba(255, 255, 255, 0.3);
//     border-bottom-color: #6366F1;
//     border-radius: 50%;
//     display: inline-block;
//     animation: rotation 1s ease-in-out infinite;
//     will-change: transform;
//   }
//   @keyframes rotation {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
//   }
// `;

//   // Stats calculation - More accurate and optimized
//   const apiStats = useMemo(() => {
//     const totalApis = globalServicesData.length;
//     const workingApis = globalServicesData.reduce((count, api) =>
//       api.status_code === 200 ? count + 1 : count, 0);
//     const errorApis = globalServicesData.reduce((count, api) =>
//       (api.status_code >= 400 || api.status_code === "ERROR" || api.status_code === "UNSUPPORTED") ? count + 1 : count, 0);

//     return {
//       totalApis,
//       workingApis,
//       errorApis,
//       refreshCount,
//       dataAdditionCount,
//       successRate: totalApis > 0 ? Math.round((workingApis / totalApis) * 100) : 0,
//       avgResponseTime: totalApis > 0
//         ? Math.round(globalServicesData.reduce((sum, api) => sum + (api.duration_ms || 0), 0) / totalApis)
//         : 0
//     };
//   }, [globalServicesData, refreshCount, dataAdditionCount]);

//   // Fetch services with abort controller and retry logic
//   // const fetchdata = async () => {
//   //   setLoading(true);
//   //   try {
//   //     const response = await axios.get("http://localhost:7070/get-services", {
//   //       timeout: 10000,
//   //       signal: AbortSignal.timeout(10000) // Modern timeout handling
//   //     });
//   //     setServices(response.data.data);
//   //     setDataAdditionCount(prev => prev + 1);
//   //   } catch (error) {
//   //     if (!axios.isCancel(error)) {
//   //       Swal.fire({
//   //         title: "Error!",
//   //         text: error.response?.data?.message || "Failed to fetch services data",
//   //         icon: "error",
//   //         confirmButtonText: "OK"
//   //       });
//   //     }
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // API status checker with improved error handling
//   // API status checker with improved error handling

//   const mapingdata = async () => {
//     if (services.length === 0) return;

//     setLoading(true);
//     setServicesData([]);
//     setRefreshCount(prev => prev + 1);

//     try {
//       const results = await Promise.allSettled(
//         services.map(async (service, index) => {
//           const method = service.method?.toUpperCase();
//           let url = service.api_url;

//           // 🟢 Force all SAP API calls to use proxy (/sap)
//           if (url.includes("192.168.16.27:8000")) {
//             url = url.replace("http://192.168.16.27:8000", "/sap");
//           }

//           const auth = service.auth;
//           const payload = service.request_payload || {};
//           const serviceName = service.services_name || service.name || url;

//           const config = {
//             ...(auth ? { auth: { username: auth.Username, password: auth.password } } : {}),
//             timeout: 15000,
//             validateStatus: () => true
//           };
//           const started = Date.now();

//           try {
//             let response;
//             if (["GET", "DELETE"].includes(method)) {
//               response = await axios[method.toLowerCase()](url, config);
//             } else if (["POST", "PUT", "PATCH"].includes(method)) {
//               response = await axios[method.toLowerCase()](url, payload, config);
//             } else {
//               return {
//                 services_name: serviceName,
//                 method,
//                 api_url: url,
//                 status_code: "UNSUPPORTED",
//                 error: "Unsupported method",
//                 duration_ms: 0,
//                 globalIndex: index + 1
//               };
//             }

//             return {
//               services_name: serviceName,
//               method,
//               api_url: url,
//               status_code: response.status,
//               error: response.status >= 400 ? (response.data?.message || response.statusText) : null,
//               duration_ms: Date.now() - started,
//               globalIndex: index + 1
//             };
//           } catch (error) {
//             return {
//               services_name: serviceName,
//               method,
//               api_url: url,
//               status_code: error.response?.status || "ERROR",
//               error: getErrorMessage(error),
//               duration_ms: Date.now() - started,
//               globalIndex: index + 1
//             };
//           }
//         })
//       );

//       const successfulResults = results
//         .filter(result => result.status === 'fulfilled')
//         .map(result => result.value);

//       setGlobalServicesData(successfulResults);
//       setServicesData(successfulResults);

//       if (results.some(result => result.status === 'rejected')) {
//         Swal.fire({
//           title: "Partial Success",
//           text: "Some API checks failed but others succeeded",
//           icon: "warning",
//           confirmButtonText: "OK"
//         });
//       }
//     } catch (error) {
//       Swal.fire({
//         title: "Error!",
//         text: "Failed to check API statuses",
//         icon: "error",
//         confirmButtonText: "OK"
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Helper function for error messages
//   const getErrorMessage = (error) => {
//     if (error.response) {
//       return error.response.data?.message ||
//         error.response.data?.error ||
//         error.response.statusText;
//     }
//     return error.message || "Unknown error";
//   };

//   // Effect hooks with cleanup
//   useEffect(() => {
//     const controller = new AbortController();

//     // const fetchData = async () => {
//     //   try {
//     //     setLoading(true);
//     //     const response = await axios.get("http://localhost:7070/get-services", {
//     //       timeout: 10000,
//     //       signal: controller.signal
//     //     });
//     //     setServices(response.data.data);
//     //   } catch (error) {
//     //     if (!axios.isCancel(error)) {
//     //       // Handle error
//     //     }
//     //   } finally {
//     //     setLoading(false);
//     //   }
//     // };

//     // fetchData();

//     const fetchdata = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.get("http://localhost:7070/get-services", {
//           timeout: 10000,
//           signal: AbortSignal.timeout(10000) // Modern timeout handling
//         });
//         setServices(response.data.data);
//         setDataAdditionCount(prev => prev + 1);
//       } catch (error) {
//         if (!axios.isCancel(error)) {
//           Swal.fire({
//             title: "Error!",
//             text: error.response?.data?.message || "Failed to fetch services data",
//             icon: "error",
//             confirmButtonText: "OK"
//           });
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchdata();

//     return () => controller.abort();
//   }, []);

//   useEffect(() => {
//     if (services.length > 0) {
//       mapingdata();
//     }
//   }, [services]);

//   // Optimized filter function
//   const filtered = useMemo(() => {
//     return globalServicesData.filter(service => {
//       const searchLower = search.toLowerCase();
//       const errorSearchLower = errorSearch.toLowerCase();
//       const methodSearchLower = mathodsearch.toLowerCase();

//       return (
//         (!searchTerm || String(service.globalIndex).includes(searchTerm)) &&
//         (!search || service.services_name?.toLowerCase().includes(searchLower)) &&
//         (!mathodsearch || service.method?.toLowerCase() === methodSearchLower) &&
//         (!statusSearch || String(service.status_code) === statusSearch) &&
//         (!errorSearch || service.error?.toLowerCase().includes(errorSearchLower))
//       );
//     });
//   }, [globalServicesData, searchTerm, search, mathodsearch, statusSearch, errorSearch]);

//   const clearAllFilters = () => {
//     setSearch('');
//     setMethodSearch('');
//     setsearchTerm('');
//     setErrorSearch('');
//     setStatusSearch('');
//   };
//   // Status style helpers - now memoized
//   const statusDot = useCallback((code) => {
//     if (code === 200) return "bg-green-500";
//     if (code >= 200 && code < 300) return "bg-yellow-500";
//     if (code >= 400 || code === "ERROR" || code === "UNSUPPORTED") return "bg-red-500";
//     return "bg-gray-500";
//   }, []);

//   const statusColor = useCallback((code) => {
//     if (code === 200) return "text-green-600";
//     if (code >= 200 && code < 300) return "text-yellow-600";
//     if (code >= 400 || code === "ERROR" || code === "UNSUPPORTED") return "text-red-600";
//     return "text-gray-600";
//   }, []);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filtered.length / itemsPerPage);

//   return (
//     <Layout>
//       <style>{loadingStyle}</style>

//       {/* Loading Overlay */}
//       {loading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
//           <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center max-w-sm mx-2 border border-gray-200">
//             <div className="loader mx-auto mb-3"></div>
//             <p className="text-gray-900 font-semibold text-sm">
//               Checking services status...
//             </p>
//             <p className="text-gray-600 text-xs mt-1">
//               Please wait while we verify all endpoints
//             </p>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6 mt-6 shadow-xl">
//         {/* Statistics Dashboard */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
//           <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
//             <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total APIs</h3>
//             <p className="mt-1 text-2xl font-semibold text-gray-900">{apiStats.totalApis}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-green-200">
//             <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Working APIs</h3>
//             <p className="mt-1 text-2xl font-semibold text-green-600">{apiStats.workingApis}</p>
//             <p className="text-xs text-green-500">{apiStats.successRate}% success rate</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-red-200">
//             <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Error APIs</h3>
//             <p className="mt-1 text-2xl font-semibold text-red-600">{apiStats.errorApis}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-indigo-200">
//             <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Refresh Count</h3>
//             <p className="mt-1 text-2xl font-semibold text-indigo-600">{apiStats.refreshCount}</p>
//           </div>
//           <div className="bg-white p-4 rounded-lg shadow border border-indigo-200">
//             <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Data Added</h3>
//             <p className="mt-1 text-2xl font-semibold text-indigo-600">{apiStats.dataAdditionCount}</p>
//           </div>
//         </div>
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
//           <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">
//             API Services Dashboard
//           </h1>
//           <div className="flex gap-2 sm:gap-3">
//             <button
//               onClick={mapingdata}
//               disabled={loading}
//               className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black bg-[#9E9E9E] hover:bg-[#8E8E8E] rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-black"
//             >
//               <IoRefresh className="mr-1 sm:mr-2" size={14} />
//               {loading ? 'Refreshing...' : 'Refresh'}
//             </button>
//             <button
//               onClick={() => navigate('/add_sevice')}
//               disabled={loading}
//               className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-black bg-[#9E9E9E] hover:bg-[#8E8E8E]  rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-black"
//             >
//               Add Service
//             </button>
//           </div>
//         </div>
//         {/* Main Table */}
//         <div className="w-full overflow-x-auto shadow-xl">
//           <div className="w-full overflow-x-auto rounded-lg shadow-md shadow-xl">
//             <table className="min-w-full text-[11px] text-sm text-left border">
//               <thead className="bg-[#9E9E9E] text-black text-[10px] sm:text-xs uppercase">
//                 <tr>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">S.No</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Service</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Method</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Status</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2">Error</th>
//                   <th className="px-2 py-1 sm:px-3 sm:py-2 text-center">Actions</th>
//                 </tr>
//                 <tr className="bg-gray-100 text-[10px] sm:text-xs">
//                   {/* S.No Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="S.No"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={searchTerm}
//                         onChange={(e) => setsearchTerm(e.target.value)}
//                       />
//                       {searchTerm && (
//                         <button
//                           onClick={() => setsearchTerm('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Service Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Service"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                       />
//                       {search && (
//                         <button
//                           onClick={() => setSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Method Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Method"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={mathodsearch}
//                         onChange={(e) => setMethodSearch(e.target.value)}
//                       />
//                       {mathodsearch && (
//                         <button
//                           onClick={() => setMethodSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Status Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Status"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={statusSearch}
//                         onChange={(e) => setStatusSearch(e.target.value)}
//                       />
//                       {statusSearch && (
//                         <button
//                           onClick={() => setStatusSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Error Filter */}
//                   <td className="border border-gray-200 p-[6px] sm:p-2">
//                     <div className="relative group">
//                       <input
//                         type="text"
//                         placeholder="Error"
//                         className="w-full px-2 py-[6px] sm:py-1.5 text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
//                         value={errorSearch}
//                         onChange={(e) => setErrorSearch(e.target.value)}
//                       />
//                       {errorSearch && (
//                         <button
//                           onClick={() => setErrorSearch('')}
//                           className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
//                         >
//                           <IoClose size={14} />
//                         </button>
//                       )}
//                     </div>
//                   </td>

//                   {/* Clear All Button */}
//                   <td className="text-center border border-gray-200 p-[6px] sm:p-2">
//                     <button
//                       onClick={clearAllFilters}
//                       className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200"
//                     >
//                       Clear All
//                     </button>
//                   </td>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentItems.map((item) => (
//                   <tr key={item.globalIndex} className="border-t hover:bg-gray-50">
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
//                       {item.globalIndex}
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
//                       {item.services_name}
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
//                       {item.method}
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-gray-300">
//                       <div className="flex items-center justify-center gap-1 sm:gap-2 h-full">
//                         <span className={`w-3 h-3 rounded-full inline-block ${statusDot(item.status_code)}`} />
//                         <span className={`text-xs sm:text-sm font-medium ${statusColor(item.status_code)}`}>
//                           {item.status_code}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black text-center border-2 border-gray-300">
//                       <div className="max-w-[200px] truncate" title={item.error || ''}>
//                         {item.error || '—'}
//                       </div>
//                     </td>
//                     <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300 text-center">
//                       <button
//                         className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors"
//                         aria-label="View details"
//                         onClick={() => {
//                           Swal.fire({
//                             title: `<strong>${item.services_name || "Service"}</strong>`,
//                             html: `
//                               <div style="text-align: left; font-size: 14px;">
//                                 <p><strong>Method:</strong> ${item.method}</p>
//                                 <p><strong>Status:</strong> <span class="${statusColor(item.status_code)}">${item.status_code}</span></p>
//                                 ${item.error ? `<p><strong>Error:</strong> ${item.error}</p>` : ''}
//                                 ${item.api_url ? `
//                                   <p class="mt-2"><strong>API URL:</strong></p>
//                                   <div style="word-break: break-all; background-color:#f0f0f0; padding: 8px; border-radius: 4px;">
//                                     <a href="${item.api_url}" target="_blank" class="text-blue-600 hover:underline">${item.api_url}</a>
//                                   </div>
//                                 ` : ''}
//                                 ${item.duration_ms ? `<p class="mt-2"><strong>Response Time:</strong> ${item.duration_ms}ms</p>` : ''}
//                               </div>
//                             `,
//                             showCancelButton: true,
//                             cancelButtonText: 'Close',
//                             showConfirmButton: false,
//                             icon: item.status_code === 200 ? 'success' :
//                               (item.status_code >= 400 || item.status_code === 'ERROR') ? 'error' : 'info',
//                             customClass: {
//                               popup: 'rounded-lg',
//                             }
//                           });
//                         }}
//                       >
//                         <IoEyeOff className="text-sm" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>



//           <div className="w-full bg-[#9E9E9E] text-black px-3 py-2 rounded-md shadow-sm">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-2 w-full">
//               {/* Status Text */}
//               <div className="w-full sm:w-auto text-center sm:text-left text-sm">
//                 <span className="font-semibold">
//                   Showing {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, filtered.length)} of {filtered.length}
//                 </span>
//               </div>

//               {/* Pagination Controls */}
//               <div className="w-full sm:w-auto flex items-center justify-center gap-2">
//                 {/* Prev Button */}
//                 <button
//                   className="flex items-center justify-center px-3 py-1.5 rounded-md border border-black bg-white hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-medium w-full sm:w-auto"
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1 || loading}
//                 >
//                   <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//                   </svg>
//                   Prev
//                 </button>

//                 {/* Page Info */}
//                 <div className="text-sm font-semibold px-2 py-1 whitespace-nowrap bg-white border border-black rounded-md text-black">
//                   Page {currentPage} of {totalPages}
//                 </div>

//                 {/* Next Button */}
//                 <button
//                   className="flex items-center justify-center px-3 py-1.5 rounded-md border border-black bg-white hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-black text-sm font-medium w-full sm:w-auto"
//                   onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
//                   disabled={currentPage === totalPages || loading}
//                 >
//                   Next
//                   <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//                   </svg>
//                 </button>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>

//     </Layout>
//   );
// };

// export default Youngbazerfruntend; 


import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';
import { IoClose, IoEyeOff, IoRefresh, IoStatsChart, IoSearch } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Youngbazerfruntend = () => {
  const [loading, setLoading] = useState(true);
  const [servicesData, setServicesData] = useState([]);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [mathodsearch, setMethodSearch] = useState("");
  const [statusSearch, setStatusSearch] = useState("");
  const [errorSearch, setErrorSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setsearchTerm] = useState("");
  const [globalServicesData, setGlobalServicesData] = useState([]);
  const [refreshCount, setRefreshCount] = useState(0);
  const [dataAdditionCount, setDataAdditionCount] = useState(0);

  const itemsPerPage = 8;
  const navigate = useNavigate();

  // CSS loader with improved styling
  const loadingStyle = `
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid rgba(255, 255, 255, 0.3);
    border-bottom-color: #4F46E5;
    border-radius: 50%;
    display: inline-block;
    animation: rotation 1s ease-in-out infinite;
    will-change: transform;
  }
  @keyframes rotation {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

  // Stats calculation
  const apiStats = useMemo(() => {
    const totalApis = globalServicesData.length;
    const workingApis = globalServicesData.reduce((count, api) =>
      api.status_code === 200 ? count + 1 : count, 0);
    const errorApis = globalServicesData.reduce((count, api) =>
      (api.status_code >= 400 || api.status_code === "ERROR" || api.status_code === "UNSUPPORTED") ? count + 1 : count, 0);

    return {
      totalApis,
      workingApis,
      errorApis,
      refreshCount,
      dataAdditionCount,
      successRate: totalApis > 0 ? Math.round((workingApis / totalApis) * 100) : 0,
      avgResponseTime: totalApis > 0
        ? Math.round(globalServicesData.reduce((sum, api) => sum + (api.duration_ms || 0), 0) / totalApis)
        : 0
    };
  }, [globalServicesData, refreshCount, dataAdditionCount]);

  const fetchdata = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:7070/get-services", {
        timeout: 10000,
        signal: AbortSignal.timeout(10000)
      });
      setServices(response.data.data);
      setDataAdditionCount(prev => prev + 1);
    } catch (error) {
      if (!axios.isCancel(error)) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.message || "Failed to fetch services data",
          icon: "error",
          confirmButtonText: "OK"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const mapingdata = async () => {
    if (services.length === 0) return;

    setLoading(true);
    setServicesData([]);
    setRefreshCount(prev => prev + 1);

    try {
      const results = await Promise.allSettled(
        services.map(async (service, index) => {
          const method = service.method?.toUpperCase();
          let url = service.api_url;

          if (url.includes("192.168.16.27:8000")) {
            url = url.replace("http://192.168.16.27:8000", "/sap");
          }

          const auth = service.auth;
          const payload = service.request_payload || {};
          const serviceName = service.services_name || service.name || url;

          const config = {
            ...(auth ? { auth: { username: auth.Username, password: auth.password } } : {}),
            timeout: 15000,
            validateStatus: () => true
          };
          const started = Date.now();

          try {
            let response;
            if (["GET", "DELETE"].includes(method)) {
              response = await axios[method.toLowerCase()](url, config);
            } else if (["POST", "PUT", "PATCH"].includes(method)) {
              response = await axios[method.toLowerCase()](url, payload, config);
            } else {
              return {
                services_name: serviceName,
                method,
                api_url: url,
                status_code: "UNSUPPORTED",
                error: "Unsupported method",
                duration_ms: 0,
                globalIndex: index + 1
              };
            }

            return {
              services_name: serviceName,
              method,
              api_url: url,
              status_code: response.status,
              error: response.status >= 400 ? (response.data?.message || response.statusText) : null,
              duration_ms: Date.now() - started,
              globalIndex: index + 1
            };
          } catch (error) {
            return {
              services_name: serviceName,
              method,
              api_url: url,
              status_code: error.response?.status || "ERROR",
              error: getErrorMessage(error),
              duration_ms: Date.now() - started,
              globalIndex: index + 1
            };
          }
        })
      );

      const successfulResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value);

      setGlobalServicesData(successfulResults);
      setServicesData(successfulResults);

      if (results.some(result => result.status === 'rejected')) {
        Swal.fire({
          title: "Partial Success",
          text: "Some API checks failed but others succeeded",
          icon: "warning",
          confirmButtonText: "OK"
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Failed to check API statuses",
        icon: "error",
        confirmButtonText: "OK"
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error.response) {
      return error.response.data?.message ||
        error.response.data?.error ||
        error.response.statusText;
    }
    return error.message || "Unknown error";
  };

  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      mapingdata();
    }
  }, [services]);

  const filtered = useMemo(() => {
    return globalServicesData.filter(service => {
      const searchLower = search.toLowerCase();
      const errorSearchLower = errorSearch.toLowerCase();
      const methodSearchLower = mathodsearch.toLowerCase();

      return (
        (!searchTerm || String(service.globalIndex).includes(searchTerm)) &&
        (!search || service.services_name?.toLowerCase().includes(searchLower)) &&
        (!mathodsearch || service.method?.toLowerCase() === methodSearchLower) &&
        (!statusSearch || String(service.status_code) === statusSearch) &&
        (!errorSearch || service.error?.toLowerCase().includes(errorSearchLower))
      );
    });
  }, [globalServicesData, searchTerm, search, mathodsearch, statusSearch, errorSearch]);

  const clearAllFilters = () => {
    setSearch('');
    setMethodSearch('');
    setsearchTerm('');
    setErrorSearch('');
    setStatusSearch('');
  };

  const statusDot = useCallback((code) => {
    if (code === 200) return "bg-green-500";
    if (code >= 200 && code < 300) return "bg-yellow-500";
    if (code >= 400 || code === "ERROR" || code === "UNSUPPORTED") return "bg-red-500";
    return "bg-gray-500";
  }, []);

  const statusColor = useCallback((code) => {
    if (code === 200) return "text-green-600";
    if (code >= 200 && code < 300) return "text-yellow-600";
    if (code >= 400 || code === "ERROR" || code === "UNSUPPORTED") return "text-red-600";
    return "text-gray-600";
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <Layout>
      <style>{loadingStyle}</style>

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 border border-gray-200">
            <div className="loader mx-auto mb-4"></div>
            <p className="text-gray-900 font-semibold text-lg mb-1">
              Checking services status...
            </p>
            <p className="text-gray-600 text-sm">
              Please wait while we verify all endpoints
            </p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 mt-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Services Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all your API endpoints in one place</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={mapingdata}
              disabled={loading}
              className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              <IoRefresh className="mr-2" size={16} />
              {loading ? 'Refreshing...' : 'Refresh Status'}
            </button>
            <button
              onClick={() => navigate('/add_sevice')}
              disabled={loading}
              className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
            >
              Add New Service
            </button>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm border border-blue-100">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <IoStatsChart className="text-blue-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total APIs</h3>
                <p className="mt-1 text-2xl font-bold text-gray-900">{apiStats.totalApis}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl shadow-sm border border-green-100">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <IoStatsChart className="text-green-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Working APIs</h3>
                <p className="mt-1 text-2xl font-bold text-green-700">{apiStats.workingApis}</p>
                <p className="text-xs text-green-600">{apiStats.successRate}% success rate</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-50 to-orange-50 p-5 rounded-xl shadow-sm border border-red-100">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-lg">
                <IoStatsChart className="text-red-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Error APIs</h3>
                <p className="mt-1 text-2xl font-bold text-red-700">{apiStats.errorApis}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-xl shadow-sm border border-purple-100">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <IoRefresh className="text-purple-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Refresh Count</h3>
                <p className="mt-1 text-2xl font-bold text-purple-700">{apiStats.refreshCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-5 rounded-xl shadow-sm border border-cyan-100">
            <div className="flex items-center">
              <div className="p-3 bg-cyan-100 rounded-lg">
                <IoStatsChart className="text-cyan-600" size={20} />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Data Added</h3>
                <p className="mt-1 text-2xl font-bold text-cyan-700">{apiStats.dataAdditionCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900">API Services</h2>

            <div className="flex gap-2">
              <div className="relative">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search services..."
                  className="pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <button
                onClick={clearAllFilters}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">S.No Filter</label>
              <input
                type="text"
                placeholder="Filter by S.No"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchTerm}
                onChange={(e) => setsearchTerm(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method Filter</label>
              <input
                type="text"
                placeholder="Filter by method"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={mathodsearch}
                onChange={(e) => setMethodSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
              <input
                type="text"
                placeholder="Filter by status"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={statusSearch}
                onChange={(e) => setStatusSearch(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Error Filter</label>
              <input
                type="text"
                placeholder="Filter by error"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={errorSearch}
                onChange={(e) => setErrorSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.globalIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.globalIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.services_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                        {item.method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <span className={`w-3 h-3 rounded-full inline-block mr-2 ${statusDot(item.status_code)}`} />
                        <span className={`font-medium ${statusColor(item.status_code)}`}>
                          {item.status_code}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={item.error || ''}>
                      {item.error || '—'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                        onClick={() => {
                          Swal.fire({
                            title: `<strong>${item.services_name || "Service"}</strong>`,
                            html: `
                              <div style="text-align: left; font-size: 14px;">
                                <p><strong>Method:</strong> ${item.method}</p>
                                <p><strong>Status:</strong> <span class="${statusColor(item.status_code)}">${item.status_code}</span></p>
                                ${item.error ? `<p><strong>Error:</strong> ${item.error}</p>` : ''}
                                ${item.api_url ? `
                                  <p class="mt-2"><strong>API URL:</strong></p>
                                  <div style="word-break: break-all; background-color:#f0f0f0; padding: 8px; border-radius: 4px;">
                                    <a href="${item.api_url}" target="_blank" class="text-blue-600 hover:underline">${item.api_url}</a>
                                  </div>
                                ` : ''}
                                ${item.duration_ms ? `<p class="mt-2"><strong>Response Time:</strong> ${item.duration_ms}ms</p>` : ''}
                              </div>
                            `,
                            showCancelButton: true,
                            cancelButtonText: 'Close',
                            showConfirmButton: false,
                            icon: item.status_code === 200 ? 'success' :
                              (item.status_code >= 400 || item.status_code === 'ERROR') ? 'error' : 'info',
                            customClass: {
                              popup: 'rounded-lg',
                            }
                          });
                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to <span className="font-medium">{Math.min(indexOfLastItem, filtered.length)}</span> of <span className="font-medium">{filtered.length}</span> results
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>

                <span className="px-3 py-1.5 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Youngbazerfruntend;

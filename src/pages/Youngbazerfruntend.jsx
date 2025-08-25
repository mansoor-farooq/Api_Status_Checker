// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import { useDebounce } from 'use-debounce';
// import Layout from '../component/Layout';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';
// import { IoRefresh, IoSearch } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';

// // Configure axios retry for failed requests
// axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

// const YoungbazerFrontend = () => {
//   const [loading, setLoading] = useState(true);
//   const [services, setServices] = useState([]);
//   const [globalServicesData, setGlobalServicesData] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [refreshCount, setRefreshCount] = useState(0);

//   const itemsPerPage = 8;
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.239:7070';

//   // Calculate API stats
//   const apiStats = useMemo(() => {
//     const totalApis = globalServicesData.length;
//     const workingApis = globalServicesData.reduce((count, api) => (api.status_code === 200 ? count + 1 : count), 0);
//     const errorApis = globalServicesData.reduce(
//       (count, api) => (api.status_code >= 400 || api.status_code === 'ERROR' || api.status_code === 'UNSUPPORTED' ? count + 1 : count),
//       0
//     );

//     return {
//       totalApis,
//       workingApis,
//       errorApis,
//       refreshCount,
//       successRate: totalApis > 0 ? Math.round((workingApis / totalApis) * 100) : 0,
//       avgResponseTime: totalApis > 0 ? Math.round(globalServicesData.reduce((sum, api) => sum + (api.duration_ms || 0), 0) / totalApis) : 0,
//     };
//   }, [globalServicesData, refreshCount]);

//   // Fetch services from API
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`${API_BASE}/get-services`, {
//         timeout: 10000,
//         signal: AbortSignal.timeout(10000),
//         auth: {
//           username: 'your-username', // Replace with actual API username
//           password: 'your-password', // Replace with actual API password
//         },
//       });
//       console.log('Fetched services:', response.data.data);
//       setServices(response.data.data);
//       setRefreshCount((prev) => prev + 1);
//     } catch (error) {
//       if (!axios.isCancel(error)) {
//         console.error('Fetch error:', error);
//         Swal.fire({
//           title: 'Error!',
//           text: error.response?.data?.message || 'Failed to fetch services data',
//           icon: 'error',
//           confirmButtonText: 'OK',
//         });
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Map and check API statuses
//   const mapData = async () => {
//     if (services.length === 0) return;

//     setLoading(true);
//     try {
//       const results = await Promise.allSettled(
//         services.map(async (service, index) => {
//           const method = service.method?.toUpperCase();
//           let url = service.api_url;

//           if (url.includes('192.168.16.27:8000')) {
//             url = url.replace('http://192.168.16.27:8000', '/sap');
//           }

//           const auth = service.auth || {};
//           const payload = service.request_payload || {};
//           const serviceName = service.services_name || service.name || url;

//           const config = {
//             ...(auth.username && auth.password ? { auth: { username: auth.username, password: auth.password } } : {}),
//             timeout: 30000,
//             validateStatus: () => true,
//           };
//           const started = Date.now();

//           console.log(`Request for ${serviceName}: URL=${url}, Method=${method}, Auth=${JSON.stringify(config.auth)}`);

//           try {
//             let response;
//             if (['GET', 'DELETE'].includes(method)) {
//               response = await axios[method.toLowerCase()](url, config);
//             } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
//               response = await axios[method.toLowerCase()](url, payload, config);
//             } else {
//               return {
//                 services_name: serviceName,
//                 description: service.description || '-',
//                 request_payload: payload,
//                 auth: config,
//                 method,
//                 api_url: url,
//                 status_code: 'UNSUPPORTED',
//                 error: 'Unsupported method',
//                 duration_ms: 0,
//                 globalIndex: index + 1,
//                 response_data: response?.data || {},
//               };
//             }

//             return {
//               services_name: serviceName,
//               description: service.description || '-',
//               request_payload: payload,
//               auth: config,
//               method,
//               api_url: url,
//               status_code: response.status,
//               error: response.status >= 400 ? (response.data?.message || response.statusText) : null,
//               duration_ms: Date.now() - started,
//               globalIndex: index + 1,
//               response_data: response.data || {},
//             };
//           } catch (error) {
//             console.error(`Error for ${serviceName}:`, error);
//             if (error.code === 'ECONNABORTED') {
//               Swal.fire({
//                 title: 'Timeout Error!',
//                 text: 'Request timed out. Retry?',
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonText: 'Retry',
//                 cancelButtonText: 'Cancel',
//               }).then((result) => {
//                 if (result.isConfirmed) mapData();
//               });
//             }
//             return {
//               services_name: serviceName,
//               description: service.description || '-',
//               request_payload: payload,
//               auth: config,
//               method,
//               api_url: url,
//               status_code: error.response?.status || 'ERROR',
//               error: getErrorMessage(error),
//               duration_ms: Date.now() - started,
//               globalIndex: index + 1,
//             };
//           }
//         })
//       );

//       const successfulResults = results
//         .filter((result) => result.status === 'fulfilled')
//         .map((result) => result.value);

//       setGlobalServicesData(successfulResults);

//       if (results.some((result) => result.status === 'rejected')) {
//         Swal.fire({
//           title: 'Partial Success',
//           text: 'Some API checks failed but others succeeded',
//           icon: 'warning',
//           confirmButtonText: 'OK',
//         });
//       }
//     } catch (error) {
//       console.error('Map data error:', error);
//       Swal.fire({
//         title: 'Error!',
//         text: 'Failed to check API statuses',
//         icon: 'error',
//         confirmButtonText: 'OK',
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getErrorMessage = (error) => {
//     if (error.code === 'ECONNABORTED') return 'Request timed out. Check server or retry.';
//     if (error.response) return error.response.data?.message || error.response.statusText || 'Server error';
//     return error.message || 'Network error';
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (services.length > 0) mapData();
//   }, [services]);

//   // Enhanced search function with fuzzy matching
//   const enhancedSearch = useMemo(() => {
//     if (!debouncedSearchQuery) return globalServicesData;

//     const query = debouncedSearchQuery.toLowerCase();
//     return globalServicesData.filter((service) => {
//       const fieldsToSearch = [
//         service.services_name || '',
//         service.method || '',
//         String(service.status_code) || '',
//         service.error || '',
//         String(service.globalIndex) || '',
//       ].join(' ').toLowerCase();

//       // Fuzzy matching: check if query is contained in any field
//       return fieldsToSearch.includes(query) ||
//         (service.request_payload && JSON.stringify(service.request_payload).toLowerCase().includes(query));
//     }).sort((a, b) => {
//       // Sort by relevance (services with exact matches first)
//       const aMatch = fieldsToSearch(a).includes(query);
//       const bMatch = fieldsToSearch(b).includes(query);
//       return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
//     });
//   }, [globalServicesData, debouncedSearchQuery]);

//   const fieldsToSearch = (service) => [
//     service.services_name || '',
//     service.method || '',
//     String(service.status_code) || '',
//     service.error || '',
//     String(service.globalIndex) || '',
//   ].join(' ').toLowerCase();

//   const clearSearch = () => {
//     setSearchQuery('');
//   };

//   const statusDot = useCallback((code) => {
//     if (code === 200) return 'bg-green-500';
//     if (code >= 200 && code < 300) return 'bg-yellow-500';
//     if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'bg-red-500';
//     return 'bg-gray-500';
//   }, []);

//   const statusColor = useCallback((code) => {
//     if (code === 200) return 'text-green-600';
//     if (code >= 200 && code < 300) return 'text-yellow-600';
//     if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'text-red-600';
//     return 'text-gray-600';
//   }, []);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = enhancedSearch.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(enhancedSearch.length / itemsPerPage);

//   useEffect(() => {
//     console.log('Current items:', currentItems);
//   }, [currentItems]);

//   return (
//     <Layout>
//       {loading && (
//         <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 border border-gray-200">
//             <div className="loader mx-auto mb-4"></div>
//             <p className="text-gray-900 font-semibold text-lg mb-1">Checking services status...</p>
//             <p className="text-gray-600 text-sm">Please wait while we verify all endpoints</p>
//           </div>
//         </div>
//       )}

//       <div className="container mx-auto px-4 py-6 mt-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">API Services Dashboard</h1>
//             <p className="text-gray-600 mt-2">Monitor and manage all your API endpoints</p>
//           </div>
//           <div className="flex gap-3 mt-4 md:mt-0">
//             <button
//               onClick={mapData}
//               disabled={loading}
//               className="flex items-center px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
//             >
//               <IoRefresh className="mr-2" size={16} />
//               {loading ? 'Refreshing...' : 'Refresh Status'}
//             </button>
//             <button
//               onClick={() => navigate('/add_service')}
//               disabled={loading}
//               className="px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm"
//             >
//               Add New Service
//             </button>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
//           {/* Stats cards can be added here */}
//         </div>

//         <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
//             <h2 className="text-lg font-semibold text-gray-900">API Services</h2>
//             <div className="flex gap-2">
//               <div className="relative w-full md:w-80">
//                 <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
//                 <input
//                   type="text"
//                   placeholder="Search by name, method, status, error, or serial..."
//                   className="pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 {searchQuery && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                   >
//                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payload</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {currentItems.map((item) => (
//                   <tr key={item.globalIndex} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {item.globalIndex}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {item.services_name || '—'}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={item.request_payload ? JSON.stringify(item.request_payload) : '—'}>
//                       {item.request_payload && Object.keys(item.request_payload).length > 0
//                         ? `${JSON.stringify(item.request_payload).substring(0, 50)}...`
//                         : '—'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                         {item.method}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex items-center">
//                         <span className={`w-3 h-3 rounded-full inline-block mr-2 ${statusDot(item.status_code)}`} />
//                         <span className={`font-medium ${statusColor(item.status_code)}`}>
//                           {item.status_code}
//                         </span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={item.error || ''}>
//                       {item.error || '—'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         className="text-indigo-600 hover:text-indigo-900 transition-colors font-semibold"
//                         onClick={() => {
//                           Swal.fire({
//                             title: `<strong>${item.services_name || 'Service'}</strong>`,
//                             html: `
//                               <div style="text-align:left; font-size:14px; line-height:1.6;">
//                                 <p><strong>Method:</strong> ${item.method}</p>
//                                 <p><strong>Status:</strong> <span style="color: ${item.status_code === 200 ? '#16a34a' : '#dc2626'};">${item.status_code}</span></p>
//                                 ${item.error ? `<p><strong>Error:</strong> ${item.error}</p>` : ''}
//                                 <p><strong>API URL:</strong></p>
//                                 <div style="word-break: break-word; background-color:#f3f4f6; padding:8px; border-radius:6px;">
//                                   <a href="${item.api_url}" target="_blank" class="text-blue-600 hover:underline">${item.api_url}</a>
//                                 </div>
//                                 ${item.duration_ms ? `<p><strong>Response Time:</strong> ${item.duration_ms}ms</p>` : ''}
//                               </div>
//                             `,
//                             showCloseButton: true,
//                             showConfirmButton: false,
//                             icon: item.status_code === 200 ? 'success' : 'error',
//                             customClass: {
//                               popup: 'rounded-xl shadow-xl p-6',
//                               title: 'text-xl font-bold text-gray-900',
//                             },
//                           });
//                         }}
//                       >
//                         View Details
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//                 {currentItems.length === 0 && (
//                   <tr>
//                     <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
//                       No services found matching the search.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           <div className="bg-white px-6 py-4 border-t border-gray-200">
//             <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-700">
//                 Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
//                 <span className="font-medium">{Math.min(indexOfLastItem, enhancedSearch.length)}</span> of{' '}
//                 <span className="font-medium">{enhancedSearch.length}</span> results
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1 || loading}
//                 >
//                   Previous
//                 </button>
//                 <span className="px-3 py-1.5 text-sm text-gray-700">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
//                   disabled={currentPage === totalPages || loading}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default YoungbazerFrontend;

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import Layout from '../component/Layout';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { IoRefresh, IoSearch, IoBarChart } from 'react-icons/io5'; // Updated to use IoBarChart
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Configure axios retry for failed requests
axiosRetry(axios, { retries: 3, retryDelay: (retryCount) => retryCount * 1000 });

const YoungbazerFrontend = () => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [globalServicesData, setGlobalServicesData] = useState([]);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [methodSearch, setMethodSearch] = useState('');
  const [debouncedMethodSearch] = useDebounce(methodSearch, 300);
  const [serialNumberFilter, setSerialNumberFilter] = useState('');
  const [debouncedSerialNumberFilter] = useDebounce(serialNumberFilter, 300);
  const [statusSearch, setStatusSearch] = useState('');
  const [debouncedStatusSearch] = useDebounce(statusSearch, 300);
  const [errorSearch, setErrorSearch] = useState('');
  const [debouncedErrorSearch] = useDebounce(errorSearch, 300);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshCount, setRefreshCount] = useState(0);

  const itemsPerPage = 8;
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.239:7070';

  // Calculate API stats (added dataAdditionCount as a placeholder)
  const apiStats = useMemo(() => {
    const totalApis = globalServicesData.length;
    const workingApis = globalServicesData.reduce((count, api) => (api.status_code === 200 ? count + 1 : count), 0);
    const errorApis = globalServicesData.reduce(
      (count, api) => (api.status_code >= 400 || api.status_code === 'ERROR' || api.status_code === 'UNSUPPORTED' ? count + 1 : count),
      0
    );
    const dataAdditionCount = globalServicesData.length; // Placeholder; replace with actual logic if needed

    return {
      totalApis,
      workingApis,
      errorApis,
      refreshCount,
      successRate: totalApis > 0 ? Math.round((workingApis / totalApis) * 100) : 0,
      avgResponseTime: totalApis > 0 ? Math.round(globalServicesData.reduce((sum, api) => sum + (api.duration_ms || 0), 0) / totalApis) : 0,
      dataAdditionCount,
    };
  }, [globalServicesData, refreshCount]);

  // Fetch services from API
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/get-services`, {
        timeout: 10000,
        signal: AbortSignal.timeout(10000),
        auth: {
          username: 'your-username', // Replace with actual API username
          password: 'your-password', // Replace with actual API password
        },
      });
      console.log('Fetched services:', response.data.data);
      setServices(response.data.data);
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      if (!axios.isCancel(error)) {
        console.error('Fetch error:', error);
        Swal.fire({
          title: 'Error!',
          text: error.response?.data?.message || 'Failed to fetch services data',
          icon: 'error',
          confirmButtonText: 'OK',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Map and check API statuses
  const mapData = async () => {
    if (services.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.allSettled(
        services.map(async (service, index) => {
          const method = service.method?.toUpperCase();
          let url = service.api_url;

          // In dev, rewrite certain external hosts to local proxy paths to avoid CORS
          if (import.meta.env.DEV) {
            try {
              const parsed = new URL(url, window.location.origin);
              // rewrite SAP internal IP to /sap proxy
              if (parsed.host === '192.168.16.27:8000' || url.includes('192.168.16.27:8000')) {
                url = url.replace('http://192.168.16.27:8000', '/sap');
              }
              // rewrite apps.youngsfood.com to /yplrmapp proxy
              if (parsed.hostname === 'apps.youngsfood.com') {
                // Normalize trailing path so we don't duplicate /yplrmapp
                // e.g. original pathname may already contain /yplrmapp
                const rawPath = parsed.pathname || '';
                const normalizedTrailing = rawPath.replace(/^\/yplrmapp/, '');
                const trailing = normalizedTrailing + (parsed.search || '');
                url = '/yplrmapp' + (trailing || '');
              }
            } catch (e) {
              // non-url strings or relative paths - leave as is
            }
            // debug log original and rewritten url for easier tracing
            if (import.meta.env.DEV) console.log('mapData URL mapping:', { original: service.api_url, rewritten: url });
          } else {
            // In production keep original absolute URLs (no rewrite)
          }

          // service.auth may be stored as a JSON string in DB; normalize to object
          let auth = service.auth || {};
          if (typeof auth === 'string' && auth.trim()) {
            try {
              auth = JSON.parse(auth);
            } catch (e) {
              // leave as string if parse fails
              console.warn('Failed to parse service.auth JSON string:', auth);
              auth = {};
            }
          }
          const payload = service.request_payload || {};
          const serviceName = service.services_name || service.name || url;

          const config = {
            timeout: 30000,
            validateStatus: () => true,
            headers: {},
          };

          // If credentials present, prefer sending Authorization header (Basic) for browser proxy
          if (auth && auth.username && auth.password) {
            try {
              const basic = typeof window !== 'undefined' ? window.btoa(`${auth.username}:${auth.password}`) : Buffer.from(`${auth.username}:${auth.password}`).toString('base64');
              config.headers['Authorization'] = `Basic ${basic}`;
            } catch (e) {
              // fallback to axios auth option
              config.auth = { username: auth.username, password: auth.password };
            }
          }
          const started = Date.now();

          console.log(`Request for ${serviceName}: URL=${url}, Method=${method}, Auth=${JSON.stringify(auth)}`);

          // Ensure URL is safe for axios; avoid double-encoding for already encoded paths
          try {
            // only encode if the url is absolute and contains spaces
            if (typeof url === 'string' && /\s/.test(url)) url = encodeURI(url);
          } catch (e) {
            // ignore
          }

          try {
            let response;
            if (['GET', 'DELETE'].includes(method)) {
              response = await axios[method.toLowerCase()](url, config);
            } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
              response = await axios[method.toLowerCase()](url, payload, config);
            } else {
              return {
                services_name: serviceName,
                description: service.description || '-',
                request_payload: payload,
                auth: config,
                method,
                api_url: url,
                status_code: 'UNSUPPORTED',
                error: 'Unsupported method',
                duration_ms: 0,
                globalIndex: index + 1,
                response_data: response?.data || {},
              };
            }

            return {
              services_name: serviceName,
              description: service.description || '-',
              request_payload: payload,
              auth: config,
              method,
              api_url: url,
              status_code: response.status,
              error: response.status >= 400 ? (response.data?.message || response.statusText) : null,
              duration_ms: Date.now() - started,
              globalIndex: index + 1,
              response_data: response.data || {},
            };
          } catch (error) {
            console.error(`Error for ${serviceName}:`, error);
            if (error.code === 'ECONNABORTED') {
              Swal.fire({
                title: 'Timeout Error!',
                text: 'Request timed out. Retry?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Retry',
                cancelButtonText: 'Cancel',
              }).then((result) => {
                if (result.isConfirmed) mapData();
              });
            }
            return {
              services_name: serviceName,
              description: service.description || '-',
              request_payload: payload,
              auth: config,
              method,
              api_url: url,
              status_code: error.response?.status || 'ERROR',
              error: getErrorMessage(error),
              duration_ms: Date.now() - started,
              globalIndex: index + 1,
            };
          }
        })
      );

      const successfulResults = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

      setGlobalServicesData(successfulResults);

      if (results.some((result) => result.status === 'rejected')) {
        Swal.fire({
          title: 'Partial Success',
          text: 'Some API checks failed but others succeeded',
          icon: 'warning',
          confirmButtonText: 'OK',
        });
      }
    } catch (error) {
      console.error('Map data error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to check API statuses',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    } finally {
      setLoading(false);
    }
  };

  const getErrorMessage = (error) => {
    if (error.code === 'ECONNABORTED') return 'Request timed out. Check server or retry.';
    if (error.response) return error.response.data?.message || error.response.statusText || 'Server error';
    return error.message || 'Network error';
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (services.length > 0) mapData();
  }, [services]);

  // Enhanced filtering with better search logic
  const filtered = useMemo(() => {
    return globalServicesData.filter((service) => {
      const searchLower = debouncedSearch.toLowerCase();
      const methodSearchLower = debouncedMethodSearch.toLowerCase();
      const serialNumberLower = debouncedSerialNumberFilter.toLowerCase();
      const statusSearchLower = debouncedStatusSearch.toLowerCase();
      const errorSearchLower = debouncedErrorSearch.toLowerCase();

      const matchesSearch = !searchLower || (service.services_name?.toLowerCase().includes(searchLower) ||
        (service.request_payload && JSON.stringify(service.request_payload).toLowerCase().includes(searchLower)));
      const matchesMethod = !methodSearchLower || service.method?.toLowerCase().includes(methodSearchLower);
      const matchesSerial = !serialNumberLower || String(service.globalIndex).includes(serialNumberLower);
      const matchesStatus = !statusSearchLower || String(service.status_code).includes(statusSearchLower);
      const matchesError = !errorSearchLower || (service.error?.toLowerCase().includes(errorSearchLower));

      return matchesSearch && matchesMethod && matchesSerial && matchesStatus && matchesError;
    });
  }, [
    globalServicesData,
    debouncedSearch,
    debouncedMethodSearch,
    debouncedSerialNumberFilter,
    debouncedStatusSearch,
    debouncedErrorSearch,
  ]);

  const clearAllFilters = () => {
    setSearch('');
    setMethodSearch('');
    setSerialNumberFilter('');
    setStatusSearch('');
    setErrorSearch('');
  };

  const statusDot = useCallback((code) => {
    if (code === 200) return 'bg-green-500';
    if (code >= 200 && code < 300) return 'bg-yellow-500';
    if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'bg-red-500';
    return 'bg-gray-500';
  }, []);

  const statusColor = useCallback((code) => {
    if (code === 200) return 'text-green-600';
    if (code >= 200 && code < 300) return 'text-yellow-600';
    if (code >= 400 || code === 'ERROR' || code === 'UNSUPPORTED') return 'text-red-600';
    return 'text-gray-600';
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  useEffect(() => {
    console.log('Current items:', currentItems);
  }, [currentItems]);

  return (
    <Layout>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center max-w-sm mx-4 border border-gray-200">
            <div className="loader mx-auto mb-4"></div>
            <p className="text-gray-900 font-semibold text-lg mb-1">Checking services status...</p>
            <p className="text-gray-600 text-sm">Please wait while we verify all endpoints</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6 mt-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">API Services Dashboard</h1>
            <p className="text-gray-600 mt-2">Monitor and manage all your API endpoints</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button
              onClick={mapData}
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
                <IoBarChart className="text-blue-600" size={20} />
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
                <IoBarChart className="text-green-600" size={20} />
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
                <IoBarChart className="text-red-600" size={20} />
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
                <IoBarChart className="text-cyan-600" size={20} />
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
              <div className="relative w-full md:w-80">
                <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by name, method, status, error, or serial..."
                  className="pl-10 pr-10 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                  <button
                    onClick={clearAllFilters}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">S.No Filter</label>
              <input
                type="text"
                placeholder="Filter by S.No"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={serialNumberFilter}
                onChange={(e) => setSerialNumberFilter(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Method Filter</label>
              <input
                type="text"
                placeholder="Filter by method"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={methodSearch}
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payload</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.globalIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.globalIndex}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.services_name || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900" title={item.request_payload ? JSON.stringify(item.request_payload) : '—'}>
                      {item.request_payload ? JSON.stringify(item.request_payload).substring(0, 50) + '...' : '—'}
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
                            title: `<strong style="font-size:12px;">${item.services_name || 'Service'}</strong>`,
                            html: `
    <div style="text-align: left; font-size: 11px; line-height: 1.5 ; padding: 6px; max-height: 220px; width: 260px; overflow-y: auto;">
      <p><strong>Status:</strong> <span class="${statusColor(item.status_code)}">${item.status_code || 'N/A'}</span></p>
      ${item.error ? `<p><strong>Error:</strong> ${item.error}</p>` : ''}
      ${item.api_url ? `
        <p class="mt-1"><strong>API URL:</strong></p>
        <div style="word-break: break-all; background-color: #f9f9f9; padding: 6px; border-radius: 4px; font-size: 12px;">
          <a href="${item.api_url}" target="_blank" class="text-blue-600 hover:underline">${item.api_url}</a>
        </div>
      ` : ''}
      ${item.duration_ms ? `<p class="mt-1"><strong>Response Time:</strong> ${item.duration_ms}ms</p>` : ''}

      <div class="mt-3">
        <h3 class="text-sm font-semibold">Detailed Information</h3>
        <table class="min-w-full mt-1 border-collapse border border-gray-300 text-xs">
          <thead>
            <tr class="bg-gray-100">
              <th class="px-2 py-1 text-left font-medium text-gray-700">Field</th>
              <th class="px-2 py-1 text-left font-medium text-gray-700">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="px-2 py-1 border border-gray-300 font-medium">Service Name</td>
              <td class="px-2 py-1 border border-gray-300">${item.services_name || 'N/A'}</td>
            </tr>
            <tr>
              <td class="px-2 py-1 border border-gray-300 font-medium">Auth Credentials</td>
              <td class="px-2 py-1 border border-gray-300">
                <pre style="background-color: #f9f9f9; padding: 4px; border-radius: 2px; margin: 0; font-size: 11px;">${item.auth ? JSON.stringify(item.auth, null, 2) : 'N/A'}</pre>
              </td>
            </tr>
            <tr>
              <td class="px-2 py-1 border border-gray-300 font-medium">Request Payload</td>
              <td class="px-2 py-1 border border-gray-300">
                <pre style="background-color: #f9f9f9; padding: 4px; border-radius: 2px; margin: 0; font-size: 11px;">${item.request_payload ? JSON.stringify(item.request_payload, null, 2) : 'N/A'}</pre>
              </td>
            </tr>
            <tr>
              <td class="px-2 py-1 border border-gray-300 font-medium">Description</td>
              <td class="px-2 py-1 border border-gray-300">${item.description || 'N/A'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
                            width: '380px',
                            showCancelButton: true,
                            cancelButtonText: 'Close',
                            showConfirmButton:
                              item.status_code >= 400 ||
                              item.status_code === 'ERROR' ||
                              item.status_code === 'UNSUPPORTED',
                            confirmButtonText: 'Retry',
                            icon: item.status_code === 200
                              ? 'success'
                              : (item.status_code >= 400 || item.status_code === 'ERROR' || item.status_code === 'UNSUPPORTED')
                                ? 'error'
                                : 'info',
                            customClass: {
                              popup: 'rounded-lg p-2',
                              container: 'backdrop-blur-md',
                            }
                          });

                        }}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No services found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-6 py-4 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filtered.length)}</span> of{' '}
                <span className="font-medium">{filtered.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
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

export default YoungbazerFrontend;





















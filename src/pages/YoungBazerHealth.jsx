
// import React, { useEffect, useState, useMemo } from 'react';

// import Layout from '../component/Layout';
// import axios from 'axios';
// import { IoEyeOff } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';

// const YoungBazerHealth = () => {
//     const [services, setServices] = useState({
//         backend: { status: 'UNKNOWN', error: 'Active', loading: false },
//         frontend: { status: 'UNKNOWN', error: 'Active', loading: false },
//         product: { status: 'UNKNOWN', error: 'Active', loading: false },
//         integration: { status: 'UNKNOWN', error: 'Active', loading: false },
//         barcode: { status: 'UNKNOWN', error: 'Active', loading: false },
//     });
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [search, setSearch] = useState('');
//     const [errors, setErrors] = useState('');
//     const [statusSearch, setStatusSearch] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const navigate = useNavigate();

//     const servicesData = [
//         { id: 1, name: 'Young Bazer Backend', status: services.backend.status, error: services.backend.error },
//         { id: 2, name: 'Frontend Service', status: services.frontend.status, error: services.frontend.error },
//         { id: 3, name: 'Product Service', status: services.product.status, error: services.product.error },
//         { id: 4, name: 'Integration Service', status: services.integration.status, error: services.integration.error },
//         { id: 5, name: 'Barcode Service', status: services.barcode.status, error: services.barcode.error },
//     ];
//     const fetchBackend = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.backend, loading: true } }));
//         try {
//             const response = await axios.get('http://202.143.125.148:9000/health');
//             setServices((prev) => ({
//                 ...prev,
//                 backend: { status: response.data.status === 200 ? 'Active' : 'Active', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 backend: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getFrontendYoungbazer = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.frontend, loading: true } }));
//         try {
//             const response = await axios.get('http://202.143.125.148:9001/get_tickers');
//             setServices((prev) => ({
//                 ...prev,
//                 frontend: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 frontend: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getDummyJson = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.product, loading: true } }));
//         try {
//             const response = await axios.get('https://dummyjson.com/products/2');
//             setServices((prev) => ({
//                 ...prev,
//                 product: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 product: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const dummyTest = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.integration, loading: true } }));
//         try {
//             const response = await axios.get('https://dummyjson.com/test');
//             setServices((prev) => ({
//                 ...prev,
//                 integration: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 integration: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getBarcode = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.barcode, loading: true } }));
//         try {
//             const response = await axios.get('http://192.168.1.161:5500/get-bar-code');
//             setServices((prev) => ({
//                 ...prev,
//                 barcode: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 barcode: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getAllRefresh = async () => {
//         await Promise.all([
//             fetchBackend(),
//             getFrontendYoungbazer(),
//             getDummyJson(),
//             dummyTest(),
//             getBarcode(),
//         ]);
//     };

//     const filteredData = useMemo(() => {
//         return servicesData.filter(
//             (service) =>
//                 service.id.toString().includes(searchTerm) &&
//                 service.name.toLowerCase().includes(search.toLowerCase()) &&
//                 service.error.toLowerCase().includes(errors.toLowerCase()) &&
//                 (statusSearch === '' || service.status.toLowerCase().includes(statusSearch.toLowerCase()))
//         );
//     }, [searchTerm, search, errors, statusSearch, services]);

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//     useEffect(() => {
//         getAllRefresh();
//     }, []);

//     return (
//         <Layout>
//             <div className="container mx-auto mt-5 px-4 py-6">
//                 <div className="flex justify-end mb-4  mt-6">
//                     <button
//                         onClick={getAllRefresh}
//                         className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
//                         disabled={loading}
//                     >
//                         {loading ? 'Refreshing...' : 'Refresh Services'}
//                     </button>
//                     <button
//                         onClick={() => navigate('/add_sevice')}
//                         className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md"
//                     >
//                         Add Service
//                     </button>
//                 </div>
//                 <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
//                     {loading ? (
//                         <div className="p-4 text-center text-gray-500">Loading...</div>
//                     ) : (
//                         <table className="w-full table-auto text-sm border-separate border-spacing-0 border-2 border-gray-300">
//                             <thead className="bg-indigo-600 text-white text-xs uppercase sticky top-0">
//                                 <tr>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">S.No</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Service</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Error</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Status</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Action</th>
//                                 </tr>
//                                 <tr className="bg-gray-100">
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="S.No"
//                                             className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Service"
//                                             className="w-full px-2 py-1 text-xs  text-black  border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={search}
//                                             onChange={(e) => setSearch(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Error"
//                                             className="w-full px-2 py-1 text-xs  text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={errors}
//                                             onChange={(e) => setErrors(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Status"
//                                             className="w-full px-2 py-1 text-xs  text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={statusSearch}
//                                             onChange={(e) => setStatusSearch(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300 text-center text-gray-400 text-xs">Search</td>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {currentItems.map((service) => (
//                                     <tr key={service.id} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">{service.id}</td>
//                                         <td className="px-3 py-2 text-black border-2 border-gray-300">{service.name}</td>
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
//                                             {services[service.name.split(' ')[0].toLowerCase()]?.loading ? 'Loading...' : service.error}
//                                         </td>
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
//                                             {services[service.name.split(' ')[0].toLowerCase()]?.loading ? (
//                                                 'Loading...'
//                                             ) : (
//                                                 <div className="flex items-center justify-center">
//                                                     <span
//                                                         className={`h-2.5 w-2.5 rounded-full mr-1.5 ${service.status === 'OK' ? 'bg-green-500' : service.status === 'ERROR' ? 'bg-red-500' : 'bg-yellow-500'
//                                                             }`}
//                                                     ></span>
//                                                     <span className="text-xs">{service.status}</span>
//                                                 </div>
//                                             )}
//                                         </td>
//                                         <td className="px-3 py-2 text-center border-2 border-gray-300">
//                                             <button
//                                                 className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors"
//                                                 aria-label="View details"
//                                             >
//                                                 <IoEyeOff className="text-sm" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                     <div className="flex justify-center items-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white text-xs uppercase rounded-lg mt-4 space-x-3 py-3 shadow-md">
//                         <button
//                             className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
//                             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                             disabled={currentPage === 1 || loading}
//                         >
//                             Prev
//                         </button>
//                         <span className="text-xs font-medium text-white bg-indigo-800 px-3 py-1.5 rounded-lg">
//                             Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
//                         </span>
//                         <button
//                             className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
//                             onClick={() =>
//                                 setCurrentPage((prev) => (prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev))
//                             }
//                             disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage) || loading}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default YoungBazerHealth;


// import React, { useEffect, useState, useMemo } from 'react';
// import Layout from '../component/Layout';
// import axios from 'axios';
// import { IoEyeOff } from 'react-icons/io5';
// import { useNavigate } from 'react-router-dom';

// const YoungBazerHealth = () => {
//     const [services, setServices] = useState({
//         backend: { status: 'UNKNOWN', error: 'Active', loading: false },
//         frontend: { status: 'UNKNOWN', error: 'Active', loading: false },
//         product: { status: 'UNKNOWN', error: 'Active', loading: false },
//         integration: { status: 'UNKNOWN', error: 'Active', loading: false },
//         barcode: { status: 'UNKNOWN', error: 'Active', loading: false },
//     });
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [search, setSearch] = useState('');
//     const [errors, setErrors] = useState('');
//     const [statusSearch, setStatusSearch] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const itemsPerPage = 10;

//     const navigate = useNavigate();

//     const servicesData = [
//         { id: 1, name: 'Young Bazer Backend', status: services.backend.status, error: services.backend.error },
//         { id: 2, name: 'Frontend Service', status: services.frontend.status, error: services.frontend.error },
//         { id: 3, name: 'Product Service', status: services.product.status, error: services.product.error },
//         { id: 4, name: 'Integration Service', status: services.integration.status, error: services.integration.error },
//         { id: 5, name: 'Barcode Service', status: services.barcode.status, error: services.barcode.error },
//     ];

//     const fetchBackend = async () => {
//         setServices((prev) => ({ ...prev, backend: { ...prev.backend, loading: true } }));
//         try {
//             const response = await axios.get('http://202.143.125.148:9000/health');
//             setServices((prev) => ({
//                 ...prev,
//                 backend: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 backend: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getFrontendYoungbazer = async () => {
//         setServices((prev) => ({ ...prev, frontend: { ...prev.frontend, loading: true } }));
//         try {
//             const response = await axios.get('http://202.143.125.148:9001/get_tickers');
//             setServices((prev) => ({
//                 ...prev,
//                 frontend: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 frontend: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getDummyJson = async () => {
//         setServices((prev) => ({ ...prev, product: { ...prev.product, loading: true } }));
//         try {
//             const response = await axios.get('https://dummyjson.com/products/2');
//             setServices((prev) => ({
//                 ...prev,
//                 product: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 product: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const dummyTest = async () => {
//         setServices((prev) => ({ ...prev, integration: { ...prev.integration, loading: true } }));
//         try {
//             const response = await axios.get('https://dummyjson.com/test');
//             setServices((prev) => ({
//                 ...prev,
//                 integration: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 integration: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getBarcode = async () => {
//         setServices((prev) => ({ ...prev, barcode: { ...prev.barcode, loading: true } }));
//         try {
//             const response = await axios.get('http://192.168.1.161:5500/get-bar-code');
//             setServices((prev) => ({
//                 ...prev,
//                 barcode: { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false },
//             }));
//         } catch (error) {
//             setServices((prev) => ({
//                 ...prev,
//                 barcode: { status: 'ERROR', error: error.message, loading: false },
//             }));
//         }
//     };

//     const getAllRefresh = async () => {
//         setLoading(true);
//         await Promise.all([
//             fetchBackend(),
//             getFrontendYoungbazer(),
//             getDummyJson(),
//             dummyTest(),
//             getBarcode(),
//         ]);
//         setLoading(false);
//     };

//     const filteredData = useMemo(() => {
//         return servicesData.filter(
//             (service) =>
//                 service.id.toString().includes(searchTerm) &&
//                 service.name.toLowerCase().includes(search.toLowerCase()) &&
//                 service.error.toLowerCase().includes(errors.toLowerCase()) &&
//                 (statusSearch === '' || service.status.toLowerCase().includes(statusSearch.toLowerCase()))
//         );
//     }, [searchTerm, search, errors, statusSearch, services]);

//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//     useEffect(() => {
//         getAllRefresh();
//     }, []);

//     return (
//         <Layout>
//             <div className="container mx-auto mt-5 px-4 py-6">
//                 <div className="flex justify-end mb-4 mt-6">
//                     <button
//                         onClick={getAllRefresh}
//                         className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
//                         disabled={loading}
//                     >
//                         {loading ? 'Refreshing...' : 'Refresh Services'}
//                     </button>
//                     <button
//                         onClick={() => navigate('/add_sevice')}
//                         className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md"
//                     >
//                         Add Service
//                     </button>
//                 </div>
//                 <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
//                     {loading ? (
//                         <div className="p-4 text-center text-gray-500">Loading...</div>
//                     ) : (
//                         <table className="w-full table-auto text-sm border-separate border-spacing-0 border-2 border-gray-300">
//                             <thead className="bg-indigo-600 text-white text-xs uppercase sticky top-0">
//                                 <tr>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">S.No</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Service</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Error</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Status</th>
//                                     <th className="px-3 py-2 font-medium border-2 border-gray-300">Action</th>
//                                 </tr>
//                                 <tr className="bg-gray-100">
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="S.No"
//                                             className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={searchTerm}
//                                             onChange={(e) => setSearchTerm(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Service"
//                                             className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={search}
//                                             onChange={(e) => setSearch(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Error"
//                                             className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={errors}
//                                             onChange={(e) => setErrors(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300">
//                                         <input
//                                             type="text"
//                                             placeholder="Status"
//                                             className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                                             value={statusSearch}
//                                             onChange={(e) => setStatusSearch(e.target.value)}
//                                         />
//                                     </td>
//                                     <td className="px-3 py-2 border-2 border-gray-300 text-center text-gray-400 text-xs">Search</td>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {currentItems.map((service) => (
//                                     <tr key={service.id} className="hover:bg-gray-50 transition-colors">
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">{service.id}</td>
//                                         <td className="px-3 py-2 text-black border-2 border-gray-300">{service.name}</td>
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
//                                             {services[service.name.split(' ')[0].toLowerCase()]?.loading ? 'Loading...' : service.error}
//                                         </td>
//                                         <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
//                                             {services[service.name.split(' ')[0].toLowerCase()]?.loading ? (
//                                                 'Loading...'
//                                             ) : (
//                                                 <div className="flex items-center justify-center">
//                                                     <span
//                                                         className={`h-2.5 w-2.5 rounded-full mr-1.5 ${service.status === 'Active' ? 'bg-green-500' : service.status === 'ERROR' ? 'bg-red-500' : 'bg-yellow-500'
//                                                             }`}
//                                                     ></span>
//                                                     <span className="text-xs">{service.status}</span>
//                                                 </div>
//                                             )}
//                                         </td>
//                                         <td className="px-3 py-2 text-center border-2 border-gray-300">
//                                             <button
//                                                 className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors"
//                                                 aria-label="View details"
//                                             >
//                                                 <IoEyeOff className="text-sm" />
//                                             </button>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     )}
//                     <div className="flex justify-center items-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white text-xs uppercase rounded-lg mt-4 space-x-3 py-3 shadow-md">
//                         <button
//                             className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
//                             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                             disabled={currentPage === 1 || loading}
//                         >
//                             Prev
//                         </button>
//                         <span className="text-xs font-medium text-white bg-indigo-800 px-3 py-1.5 rounded-lg">
//                             Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
//                         </span>
//                         <button
//                             className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
//                             onClick={() =>
//                                 setCurrentPage((prev) => (prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev))
//                             }
//                             disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage) || loading}
//                         >
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </Layout>
//     );
// };

// export default YoungBazerHealth;



import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';
import { IoEyeOff } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

// Custom debounce function
const debounce = (func, wait) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

const YoungBazerHealth = () => {
    const [services, setServices] = useState({
        backend: { status: 'UNKNOWN', error: 'Active', loading: false },
        frontend: { status: 'UNKNOWN', error: 'Active', loading: false },
        product: { status: 'UNKNOWN', error: 'Active', loading: false },
        integration: { status: 'UNKNOWN', error: 'Active', loading: false },
        barcode: { status: 'UNKNOWN', error: 'Active', loading: false },
    });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setSearch] = useState('');
    const [errors, setErrors] = useState('');
    const [statusSearch, setStatusSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const navigate = useNavigate();

    // In-memory cache
    const cache = useMemo(() => new Map(), []);
    const CACHE_DURATION = 60000; // Cache for 1 minute
    const API_TIMEOUT = 5000; // 5 seconds timeout per API

    const servicesData = [
        { id: 1, name: 'Young Bazer Backend', status: services.backend.status, error: services.backend.error },
        { id: 2, name: 'Frontend Service', status: services.frontend.status, error: services.frontend.error },
        { id: 3, name: 'Product Service', status: services.product.status, error: services.product.error },
        { id: 4, name: 'Integration Service', status: services.integration.status, error: services.integration.error },
        { id: 5, name: 'Barcode Service', status: services.barcode.status, error: services.barcode.error },
    ];

    // Helper function to add timeout to API calls
    const withTimeout = async (promise, ms) => {
        const timeout = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timed out')), ms)
        );
        return Promise.race([promise, timeout]);
    };

    // Helper function to check cache
    const getCachedData = (key) => {
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            console.log(`Using cached data for ${key}`);
            return cached.data;
        }
        return null;
    };

    // Helper function to set cache
    const setCachedData = (key, data) => {
        console.log(`Caching data for ${key}`);
        cache.set(key, { data, timestamp: Date.now() });
    };

    const fetchBackend = async () => {
        const cacheKey = 'backend';
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        setServices((prev) => ({ ...prev, backend: { ...prev.backend, loading: true } }));
        try {
            console.log('Fetching backend API');
            const response = await withTimeout(axios.get('http://202.143.125.148:9000/health'), API_TIMEOUT);
            const data = { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false };
            setServices((prev) => ({ ...prev, backend: data }));
            setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            const data = { status: 'ERROR', error: error.message, loading: false };
            setServices((prev) => ({ ...prev, backend: data }));
            setCachedData(cacheKey, data);
            return data;
        }
    };

    const getFrontendYoungbazer = async () => {
        const cacheKey = 'frontend';
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        setServices((prev) => ({ ...prev, frontend: { ...prev.frontend, loading: true } }));
        try {
            console.log('Fetching frontend API');
            const response = await withTimeout(axios.get('http://202.143.125.148:9001/get_tickers'), API_TIMEOUT);
            const data = { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false };
            setServices((prev) => ({ ...prev, frontend: data }));
            setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            const data = { status: 'ERROR', error: error.message, loading: false };
            setServices((prev) => ({ ...prev, frontend: data }));
            setCachedData(cacheKey, data);
            return data;
        }
    };

    const getDummyJson = async () => {
        const cacheKey = 'product';
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        setServices((prev) => ({ ...prev, product: { ...prev.product, loading: true } }));
        try {
            console.log('Fetching product API');
            const response = await withTimeout(axios.get('https://dummyjson.com/products/2'), API_TIMEOUT);
            const data = { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false };
            setServices((prev) => ({ ...prev, product: data }));
            setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            const data = { status: 'ERROR', error: error.message, loading: false };
            setServices((prev) => ({ ...prev, product: data }));
            setCachedData(cacheKey, data);
            return data;
        }
    };

    const dummyTest = async () => {
        const cacheKey = 'integration';
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        setServices((prev) => ({ ...prev, integration: { ...prev.integration, loading: true } }));
        try {
            console.log('Fetching integration API');
            const response = await withTimeout(axios.get('https://dummyjson.com/test'), API_TIMEOUT);
            const data = { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false };
            setServices((prev) => ({ ...prev, integration: data }));
            setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            const data = { status: 'ERROR', error: error.message, loading: false };
            setServices((prev) => ({ ...prev, integration: data }));
            setCachedData(cacheKey, data);
            return data;
        }
    };

    const getBarcode = async () => {
        const cacheKey = 'barcode';
        const cachedData = getCachedData(cacheKey);
        if (cachedData) return cachedData;

        setServices((prev) => ({ ...prev, barcode: { ...prev.barcode, loading: true } }));
        try {
            console.log('Fetching barcode API');
            const response = await withTimeout(axios.get('http://192.168.1.161:5500/get-bar-code'), API_TIMEOUT);
            const data = { status: response.status === 200 ? 'Active' : 'ERROR', error: 'Active', loading: false };
            setServices((prev) => ({ ...prev, barcode: data }));
            setCachedData(cacheKey, data);
            return data;
        } catch (error) {
            const data = { status: 'ERROR', error: error.message, loading: false };
            setServices((prev) => ({ ...prev, barcode: data }));
            setCachedData(cacheKey, data);
            return data;
        }
    };

    const getAllRefresh = useCallback(
        debounce(async (forceRefresh = false) => {
            console.log('Starting refresh, forceRefresh:', forceRefresh);
            setLoading(true);
            try {
                // Clear cache if forceRefresh is true
                if (forceRefresh) {
                    console.log('Clearing cache');
                    cache.clear();
                }
                await Promise.all([
                    fetchBackend(),
                    getFrontendYoungbazer(),
                    getDummyJson(),
                    dummyTest(),
                    getBarcode(),
                ]);
                console.log('All API calls completed');
            } catch (error) {
                console.error('Error during refresh:', error);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    const handleRefreshClick = () => {
        // Allow force refresh on double-click or specific condition
        getAllRefresh(false); // Normal refresh
    };

    const filteredData = useMemo(() => {
        return servicesData.filter(
            (service) =>
                service.id.toString().includes(searchTerm) &&
                service.name.toLowerCase().includes(search.toLowerCase()) &&
                service.error.toLowerCase().includes(errors.toLowerCase()) &&
                (statusSearch === '' || service.status.toLowerCase().includes(statusSearch.toLowerCase()))
        );
    }, [searchTerm, search, errors, statusSearch, services]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    useEffect(() => {
        console.log('Initial refresh on mount');
        getAllRefresh(false);
    }, [getAllRefresh]);

    return (
        <Layout>
            <div className="container mx-auto mt-5 px-4 py-6">
                <div className="flex justify-end mb-4 mt-6">
                    <button
                        onClick={handleRefreshClick}
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Refreshing...' : 'Refresh Services'}
                    </button>
                    <button
                        onClick={() => navigate('/add_sevice')}
                        className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md"
                    >
                        Add Service
                    </button>
                </div>
                <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <table className="w-full table-auto text-sm border-separate border-spacing-0 border-2 border-gray-300">
                        <thead className="bg-indigo-600 text-white text-xs uppercase sticky top-0">
                            <tr>
                                <th className="px-3 py-2 font-medium border-2 border-gray-300">S.No</th>
                                <th className="px-3 py-2 font-medium border-2 border-gray-300">Service</th>
                                <th className="px-3 py-2 font-medium border-2 border-gray-300">Error</th>
                                <th className="px-3 py-2 font-medium border-2 border-gray-300">Status</th>
                                <th className="px-3 py-2 font-medium border-2 border-gray-300">Action</th>
                            </tr>
                            <tr className="bg-gray-100">
                                <td className="px-3 py-2 border-2 border-gray-300">
                                    <input
                                        type="text"
                                        placeholder="S.No"
                                        className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2 border-2 border-gray-300">
                                    <input
                                        type="text"
                                        placeholder="Service"
                                        className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2 border-2 border-gray-300">
                                    <input
                                        type="text"
                                        placeholder="Error"
                                        className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={errors}
                                        onChange={(e) => setErrors(e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2 border-2 border-gray-300">
                                    <input
                                        type="text"
                                        placeholder="Status"
                                        className="w-full px-2 py-1 text-xs text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                        value={statusSearch}
                                        onChange={(e) => setStatusSearch(e.target.value)}
                                    />
                                </td>
                                <td className="px-3 py-2 border-2 border-gray-300 text-center text-gray-400 text-xs">Search</td>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((service) => (
                                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-3 py-2 text-black text-center border-2 border-gray-300">{service.id}</td>
                                    <td className="px-3 py-2 text-black border-2 border-gray-300">{service.name}</td>
                                    <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
                                        {services[service.name.split(' ')[0].toLowerCase()]?.loading ? 'Loading...' : service.error}
                                    </td>
                                    <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
                                        {services[service.name.split(' ')[0].toLowerCase()]?.loading ? (
                                            'Loading...'
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span
                                                    className={`h-2.5 w-2.5 rounded-full mr-1.5 ${service.status === 'Active' ? 'bg-green-500' : service.status === 'ERROR' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}
                                                ></span>
                                                <span className="text-xs">{service.status}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-3 py-2 text-center border-2 border-gray-300">
                                        <button
                                            className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors"
                                            aria-label="View details"
                                        >
                                            <IoEyeOff className="text-sm" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="flex justify-center items-center bg-gradient-to-r from-indigo-700 to-indigo-600 text-white text-xs uppercase rounded-lg mt-4 space-x-3 py-3 shadow-md">
                        <button
                            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1 || loading}
                        >
                            Prev
                        </button>
                        <span className="text-xs font-medium text-white bg-indigo-800 px-3 py-1.5 rounded-lg">
                            Page {currentPage} of {Math.ceil(filteredData.length / itemsPerPage)}
                        </span>
                        <button
                            className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-800 rounded-lg hover:bg-indigo-900 disabled:opacity-50 transition-colors"
                            onClick={() =>
                                setCurrentPage((prev) => (prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev))
                            }
                            disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage) || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default YoungBazerHealth;




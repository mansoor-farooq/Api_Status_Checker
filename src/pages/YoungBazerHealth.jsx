import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Layout from '../component/Layout';
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

    const servicesData = [
        { id: 1, name: 'SAP Service', status: services.barcode.status, error: services.barcode.error },
    ];

    // Helper function to check cache
    const getCachedData = (key) => {
        const cached = cache.get(key);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
            return cached.data;
        }
        return null;
    };

    // Helper function to set cache
    const setCachedData = (key, data) => {
        cache.set(key, { data, timestamp: Date.now() });
    };

    const getBarcode = async () => {
        const cacheKey = 'barcode';
        const cachedData = getCachedData(cacheKey);

        // Return cached data if available
        if (cachedData) {
            setServices((prev) => ({ ...prev, barcode: cachedData }));
            return cachedData;
        }

        setServices((prev) => ({ ...prev, barcode: { ...prev.barcode, loading: true } }));

        try {
            const url = "/sap/opu/odata/sap/ZC_FBR_INVOICE_HDR_CDS/ZC_FBR_INVOICE_HDR?$filter=DocumentDate ge datetime'2025-06-01T00:00:00' and DocumentDate le datetime'2025-07-31T00:00:00' and DocumentCompanyCode eq '1000'&$format=json";
            const username = 'APIUSER';
            const password = 'Basis@123';
            const basicAuth = 'Basic ' + btoa(`${username}:${password}`);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': basicAuth,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }

            const data = await response.json();
            const serviceData = {
                status: 'Active',
                error: 'Active',
                loading: false,
            };

            setServices((prev) => ({ ...prev, barcode: serviceData }));
            setCachedData(cacheKey, serviceData);
            return serviceData;
        } catch (error) {
            let errorMessage = 'Unknown error';
            if (error.message.includes('status')) {
                errorMessage = error.message;
            } else if (error.name === 'TypeError') {
                errorMessage = 'Network error or CORS issue';
            } else {
                errorMessage = error.message;
            }

            const serviceData = { status: 'ERROR', error: errorMessage, loading: false };
            setServices((prev) => ({ ...prev, barcode: serviceData }));
            setCachedData(cacheKey, serviceData);
            return serviceData;
        }
    };

    const getAllRefresh = useCallback(
        debounce(async (forceRefresh = false) => {
            setLoading(true);
            if (forceRefresh) {
                cache.clear();
            }
            await getBarcode();
            setLoading(false);
        }, 500),
        []
    );

    const handleRefreshClick = () => {
        getAllRefresh(false);
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
                                        {services.barcode.loading ? 'Loading...' : service.error}
                                    </td>
                                    <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
                                        {services.barcode.loading ? (
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

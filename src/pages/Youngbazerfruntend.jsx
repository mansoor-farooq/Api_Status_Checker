

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useDebounce } from 'use-debounce';
import Layout from '../component/Layout';
import axios from 'axios';
import axiosRetry from 'axios-retry';
import { IoRefresh, IoSearch, IoBarChart } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { proxyRequest } from '../component/proxy';
import { Clipboard, X } from 'lucide-react';

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
  const [detail, setDetail] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // Collapsible filters for mobile
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // State for sorting
  const itemsPerPage = 8;
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.239:7070';
  console.log("services", services);

  // Calculate API stats
  const apiStats = useMemo(() => {
    const totalApis = globalServicesData.length;
    const workingApis = globalServicesData.reduce((count, api) => (api.status_code === 200 ? count + 1 : count), 0);
    const errorApis = globalServicesData.reduce(
      (count, api) => (api.status_code >= 400 || api.status_code === 'ERROR' || api.status_code === 'UNSUPPORTED' ? count + 1 : count),
      0
    );
    const dataAdditionCount = globalServicesData.length;

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

  // Function to sort data
  const sortData = (data, key, direction) => {
    if (!key || !direction) return data;

    return [...data].sort((a, b) => {
      let aValue = a[key] ?? '';
      let bValue = b[key] ?? '';

      // Handle specific columns
      if (key === 'request_payload') {
        aValue = aValue ? JSON.stringify(aValue) : '';
        bValue = bValue ? JSON.stringify(bValue) : '';
      }
      if (key === 'status_code') {
        aValue = String(aValue);
        bValue = String(bValue);
      }
      if (key === 'globalIndex') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }

      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // Filter and sort data
  const filtered = useMemo(() => {
    let result = globalServicesData.filter((service) => {
      const searchLower = debouncedSearch.toLowerCase();
      const methodSearchLower = debouncedMethodSearch.toLowerCase();
      const serialNumberLower = debouncedSerialNumberFilter.toLowerCase();
      const statusSearchLower = debouncedStatusSearch.toLowerCase();
      const errorSearchLower = debouncedErrorSearch.toLowerCase();

      const matchesSearch =
        !searchLower ||
        (service.services_name?.toLowerCase().includes(searchLower) ||
          (service.request_payload && JSON.stringify(service.request_payload).toLowerCase().includes(searchLower)));
      const matchesMethod = !methodSearchLower || service.method?.toLowerCase().includes(methodSearchLower);
      const matchesSerial = !serialNumberLower || String(service.globalIndex).includes(serialNumberLower);
      const matchesStatus = !statusSearchLower || String(service.status_code).includes(statusSearchLower);
      const matchesError = !errorSearchLower || (service.error?.toLowerCase().includes(errorSearchLower));

      return matchesSearch && matchesMethod && matchesSerial && matchesStatus && matchesError;
    });

    return sortData(result, sortConfig.key, sortConfig.direction);
  }, [
    globalServicesData,
    debouncedSearch,
    debouncedMethodSearch,
    debouncedSerialNumberFilter,
    debouncedStatusSearch,
    debouncedErrorSearch,
    sortConfig,
  ]);

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key && prev.direction === 'asc') {
        return { key, direction: 'desc' };
      } else if (prev.key === key && prev.direction === 'desc') {
        return { key: null, direction: null };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/get-services`);
      setServices(response.data.data || []);
      setRefreshCount((prev) => prev + 1);
    } catch (error) {
      Swal.fire('Error!', error.message || 'Failed to fetch services', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Map data
  const mapData = async () => {
    if (services.length === 0) return;
    setLoading(true);
    try {
      const results = await Promise.allSettled(
        services.map(async (service, index) => {
          const { method, api_url, auth, request_payload } = service;
          const started = Date.now();
          try {
            const res = await proxyRequest({
              url: api_url,
              method,
              payload: request_payload,
              auth,
            });
            return {
              globalIndex: index + 1,
              services_name: service.services_name || api_url,
              source_name: service.source_name,
              method,
              auth,
              api_url,
              request_payload,
              status_code: 200,
              error: null,
              duration_ms: Date.now() - started,
              response_data: res.data,
            };
          } catch (err) {
            return {
              globalIndex: index + 1,
              services_name: service.services_name || api_url,
              source_name: service.source_name,
              method,
              auth,
              api_url,
              request_payload,
              status_code: 'ERROR',
              error: err.message,
              duration_ms: Date.now() - started,
            };
          }
        })
      );
      const final = results.map((r) => (r.status === 'fulfilled' ? r.value : r.reason));
      setGlobalServicesData(final);
    } catch (err) {
      console.error('❌ MapData Failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (services.length > 0) mapData();
  }, [services]);

  const clearAllFilters = () => {
    setSearch('');
    setMethodSearch('');
    setSerialNumberFilter('');
    setStatusSearch('');
    setErrorSearch('');
    setIsFilterOpen(false);
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

  console.log("currentItems", currentItems);

  // Function to format detail object for copying in plain text
  const formatDetailForCopy = (detail) => {
    if (!detail) return 'No data available';
    try {
      return `
Basic Information
Service Name
${detail.services_name ?? '—'}
Source Name
${detail.source_name ?? '—'}
auth
${detail.auth ? JSON.stringify(detail.auth, null, 2) : 'No auth data'}
HTTP Method
${detail.method ?? '—'}
Serial Number
${detail.globalIndex ?? '—'}
Status & Performance
Status Code
${detail.status_code ?? '—'}
Response Time
${detail.duration_ms != null ? `${detail.duration_ms}ms` : '—'}
Error Message
${detail.error ?? 'No errors detected'}
API Endpoint
${detail.api_url ?? '—'}
Request Payload
${detail.request_payload ? JSON.stringify(detail.request_payload, null, 2) : 'No payload data'}
`.trim();
    } catch (err) {
      console.error('Error formatting data for copy:', err);
      return 'Error formatting data';
    }
  };

  // Fallback clipboard copy function
  const fallbackCopyText = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      return true;
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  };

  const colorClasses = {
    blue: {
      bg: "from-blue-50 to-blue-100 border-blue-200",
      iconBg: "bg-blue-200",
      icon: "text-blue-700",
      text: "text-blue-800",
    },
    green: {
      bg: "from-green-50 to-green-100 border-green-200",
      iconBg: "bg-green-200",
      icon: "text-green-700",
      text: "text-green-800",
    },
    red: {
      bg: "from-red-50 to-red-100 border-red-200",
      iconBg: "bg-red-200",
      icon: "text-red-700",
      text: "text-red-800",
    },
    purple: {
      bg: "from-purple-50 to-purple-100 border-purple-200",
      iconBg: "bg-purple-200",
      icon: "text-purple-700",
      text: "text-purple-800",
    },
    cyan: {
      bg: "from-cyan-50 to-cyan-100 border-cyan-200",
      iconBg: "bg-cyan-200",
      icon: "text-cyan-700",
      text: "text-cyan-800",
    },
  };




  return (
    <Layout>
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-xl shadow-2xl text-center max-w-xs mx-2 border border-gray-200">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-600 mx-auto mb-3"></div>
            <p className="text-gray-900 font-semibold text-base">Checking services...</p>
            <p className="text-gray-600 text-xs">Please wait</p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-2 sm:px-4 py-4">

        {/* Sticky Header */}
        {/* Sticky Header */}
        <div className="sticky top-2 bg-white/90 backdrop-blur-md z-20 py-4 px-3 sm:px-5 shadow-lg rounded-xl border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title */}
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                API Services Dashboard
              </h1>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                Monitor & manage all your API endpoints in real-time
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 shadow-md transition-transform hover:scale-105"
              >
                <IoRefresh size={16} />
                {loading ? "Refreshing..." : "Refresh"}
              </button>

              <button
                onClick={() => navigate("/add_sevice")}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-50 shadow-md transition-transform hover:scale-105"
              >
                ➕ Add Service
              </button>
            </div>
          </div>
        </div>




        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5 mt-6">
          {[
            { label: "Total APIs", value: apiStats.totalApis, icon: IoBarChart, color: "blue" },
            { label: "Working APIs", value: `${apiStats.workingApis} (${apiStats.successRate}%)`, icon: IoBarChart, color: "green" },
            { label: "Error APIs", value: apiStats.errorApis, icon: IoBarChart, color: "red" },
            { label: "Refresh Count", value: apiStats.refreshCount, icon: IoRefresh, color: "purple" },
            { label: "Data Added", value: apiStats.dataAdditionCount, icon: IoBarChart, color: "cyan" },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-${stat.color}-50 to-${stat.color}-100 p-4 sm:p-5 rounded-xl shadow-md border border-${stat.color}-200 transition-transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 bg-${stat.color}-200 rounded-lg`}>
                  <stat.icon className={`text-${stat.color}-700`} size={20} />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500">
                    {stat.label}
                  </h3>
                  <p className={`text-lg sm:text-xl font-extrabold text-${stat.color}-800`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Section */}
        <div className="bg-white p-2 sm:p-3 rounded-lg shadow-sm border border-gray-200 mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900">API Services</h2>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="text-indigo-600 hover:text-indigo-800 text-xs font-medium flex items-center gap-1 sm:hidden"
              aria-label={isFilterOpen ? 'Hide filters' : 'Show filters'}
            >
              <IoSearch size={14} />
              {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          <div className="relative mb-2">
            <IoSearch className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Search by name, method, status..."
              className="pl-7 pr-7 py-1.5 text-xs border text-black font-semibold border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search APIs"
            />
            {search && (
              <button
                onClick={clearAllFilters}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className={`${isFilterOpen ? 'flex' : 'hidden'} sm:flex flex-row gap-1 sm:gap-2 flex-wrap`}>
            {[
              { label: 'S.No', value: serialNumberFilter, setValue: setSerialNumberFilter, placeholder: 'S.No' },
              { label: 'Method', value: methodSearch, setValue: setMethodSearch, placeholder: 'Method' },
              { label: 'Status', value: statusSearch, setValue: setStatusSearch, placeholder: 'Status' },
              { label: 'Error', value: errorSearch, setValue: setErrorSearch, placeholder: 'Error' },
            ].map((filter, index) => (
              <div key={index} className="flex-1 min-w-0">
                <label className="block text-xs font-medium text-gray-700 mb-0.5">{filter.label}</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={filter.placeholder}
                    className="w-full px-1.5 py-1 text-xs border text-black font-semibold border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500"
                    value={filter.value}
                    onChange={(e) => filter.setValue(e.target.value)}
                    aria-label={`Filter by ${filter.label}`}
                  />
                  {filter.value && (
                    <button
                      onClick={() => filter.setValue('')}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      aria-label={`Clear ${filter.label} filter`}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto snap-x">
            <table className="min-w-[700px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                <tr>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[60px]">
                    <button
                      onClick={() => handleSort('globalIndex')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by S.No"
                    >
                      S.No
                      {sortConfig.key === 'globalIndex' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                    <button
                      onClick={() => handleSort('services_name')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by Service"
                    >
                      Service
                      {sortConfig.key === 'services_name' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[150px] hidden sm:table-cell">
                    <button
                      onClick={() => handleSort('request_payload')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by Payload"
                    >
                      Payload
                      {sortConfig.key === 'request_payload' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <button
                      onClick={() => handleSort('method')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by Method"
                    >
                      Method
                      {sortConfig.key === 'method' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[80px]">
                    <button
                      onClick={() => handleSort('status_code')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by Status"
                    >
                      Status
                      {sortConfig.key === 'status_code' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] hidden sm:table-cell">
                    <button
                      onClick={() => handleSort('error')}
                      className="flex items-center gap-1 hover:text-indigo-600"
                      aria-label="Sort by Error"
                    >
                      Error
                      {sortConfig.key === 'error' && (
                        <span>
                          {sortConfig.direction === 'asc' ? '↑' : sortConfig.direction === 'desc' ? '↓' : ''}
                        </span>
                      )}
                    </button>
                  </th>
                  <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.map((item) => (
                  <tr key={item.globalIndex} className="hover:bg-gray-50 transition-colors">
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-gray-900">{item.globalIndex}</td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-[150px]" title={item.services_name || '—'}>
                      {item.services_name || '—'}
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 truncate max-w-[120px] hidden sm:table-cell"
                      title={item.request_payload ? JSON.stringify(item.request_payload) : '—'}
                    >
                      {item.request_payload ? JSON.stringify(item.request_payload).substring(0, 20) + '...' : '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900">
                      <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">{item.method}</span>
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <div className="flex items-center">
                        <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full inline-block mr-1 sm:mr-2 ${statusDot(item.status_code)}`} />
                        <span className={`font-medium ${statusColor(item.status_code)}`}>{item.status_code}</span>
                      </div>
                    </td>
                    <td
                      className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-gray-900 truncate max-w-[100px] hidden sm:table-cell"
                      title={item.error || ''}
                    >
                      {item.error || '—'}
                    </td>
                    <td className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                      <button
                        onClick={() => {
                          setIsOpen(true);
                          setDetail(item);
                        }}
                        className="px-3 py-1.5 text-xs sm:text-sm bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition-colors touch-manipulation"
                        aria-label="View API details"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-2 sm:px-4 py-3 text-center text-xs sm:text-sm text-gray-500">
                      No services found matching the filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {isOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 px-2 sm:px-4 py-4">
              <div className="bg-white w-full max-w-3xl rounded-lg sm:shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 sm:p-4 text-white relative">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-base sm:text-lg font-bold flex items-center gap-1 sm:gap-2">
                        <IoBarChart className="text-white" size={16} />
                        API Service Details
                      </h2>
                      <p className="text-indigo-100 text-xs mt-1">API endpoint information</p>
                    </div>
                    <div
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${detail?.status_code === 200
                        ? 'bg-green-500/20 text-green-100'
                        : detail?.status_code >= 400 || detail?.status_code === 'ERROR' || detail?.status_code === 'UNSUPPORTED'
                          ? 'bg-red-500/20 text-red-100'
                          : 'bg-yellow-500/20 text-yellow-100'
                        }`}
                    >
                      {detail?.status_code === 200
                        ? 'Operational'
                        : detail?.status_code >= 400 || detail?.status_code === 'ERROR' || detail?.status_code === 'UNSUPPORTED'
                          ? 'Error'
                          : 'Warning'}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-3 right-3 text-white hover:text-indigo-200 p-1.5 rounded-full hover:bg-white/10"
                    aria-label="Close modal"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4">
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    {/* Basic Info */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Basic Information
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Service Name</span>
                          <span className="font-medium text-gray-900">{detail?.services_name || '—'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Source Name</span>
                          <span className="font-medium text-gray-900">{detail?.source_name || '—'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">auth </span>
                          <span className="font-medium text-gray-900">{detail?.auth ? JSON.stringify(detail.auth, null, 2) : 'No auth data'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">HTTP Method</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${detail?.method === 'GET'
                              ? 'bg-blue-100 text-blue-800'
                              : detail?.method === 'POST'
                                ? 'bg-green-100 text-green-800'
                                : detail?.method === 'PUT'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : detail?.method === 'DELETE'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-gray-100 text-gray-800'
                              }`}
                          >
                            {detail?.method || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Serial Number</span>
                          <span className="font-medium text-gray-900">{detail?.globalIndex || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Performance */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Status & Performance
                      </h3>
                      <div className="space-y-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Status Code</span>
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full inline-block ${statusDot(detail?.status_code)}`} />
                            <span className={`font-medium ${statusColor(detail?.status_code)}`}>{detail?.status_code || '—'}</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Response Time</span>
                          <span className="font-medium text-gray-900">{detail?.duration_ms ? `${detail.duration_ms}ms` : '—'}</span>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500 block">Error Message</span>
                          <span className="font-medium text-red-600 break-words">{detail?.error || 'No errors detected'}</span>
                        </div>
                      </div>
                    </div>

                    {/* API Endpoint */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        API Endpoint
                      </h3>
                      <div className="bg-gray-100 p-2 rounded-md overflow-x-auto">
                        <code className="text-xs sm:text-sm text-gray-800 break-all">{detail?.api_url || '—'}</code>
                      </div>
                    </div>

                    {/* Request Payload */}
                    <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-1">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Request Payload
                      </h3>
                      <div className="bg-gray-900 p-2 sm:p-3 rounded-md overflow-x-auto max-h-40 sm:max-h-48">
                        <pre className="text-xs text-green-400 overflow-x-auto">{detail?.request_payload ? JSON.stringify(detail.request_payload, null, 2) : 'No payload data'}</pre>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-3 sm:px-4 py-3 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <div className="text-xs text-gray-500 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last checked: {new Date().toLocaleString()}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm touch-manipulation"
                      aria-label="Close modal"
                    >
                      Close
                    </button>
                    <button
                      onClick={async () => {
                        const textToCopy = formatDetailForCopy(detail);
                        try {
                          if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(textToCopy);
                            Swal.fire({
                              icon: 'success',
                              title: 'Copied!',
                              text: 'Service details copied to clipboard',
                              timer: 1500,
                              showConfirmButton: false,
                              position: 'top-end',
                              toast: true,
                            });
                          } else {
                            const success = fallbackCopyText(textToCopy);
                            if (success) {
                              Swal.fire({
                                icon: 'success',
                                title: 'Copied!',
                                text: 'Service details copied to clipboard (fallback method)',
                                timer: 1500,
                                showConfirmButton: false,
                                position: 'top-end',
                                toast: true,
                              });
                            } else {
                              throw new Error('Fallback copy failed');
                            }
                          }
                        } catch (err) {
                          console.error('Clipboard copy error:', err);
                          Swal.fire({
                            icon: 'error',
                            title: 'Failed to Copy',
                            text: 'Unable to access clipboard. Please ensure the site is running on HTTPS or localhost, check browser permissions, or copy manually.',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'top-end',
                            toast: true,
                          });
                        }
                      }}
                      className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-sm flex items-center gap-1 touch-manipulation"
                      aria-label="Copy all API details"
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      Copy All Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          <div className="bg-white px-2 sm:px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-700">
                Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                <span className="font-medium">{Math.min(indexOfLastItem, filtered.length)}</span> of{' '}
                <span className="font-medium">{filtered.length}</span> results
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                  aria-label="Previous page"
                >
                  Previous
                </button>
                <span className="px-2 sm:px-3 py-1 text-xs sm:text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
                  onClick={() => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev))}
                  disabled={currentPage === totalPages || loading}
                  aria-label="Next page"
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


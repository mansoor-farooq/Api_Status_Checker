import React, { useEffect, useState, useMemo } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';
import { IoClose, IoEyeOff, IoRefresh } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Youngbazerfruntend = () => {
  const [services, setServices] = useState([]);
  const [servicesdata, setservicesdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const navigate = useNavigate();
  // CSS for loading animation
  const loadingStyle = `
    .loader {
      width: 48px;
      height: 48px;
      border: 5px solid #FFF;
      border-bottom-color: #6366F1;
      border-radius: 50%;
      display: inline-block;
      box-sizing: border-box;
      animation: rotation 1s linear infinite;
    }
    @keyframes rotation {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @media (max-width: 640px) {
      .loader {
        width: 36px;
        height: 36px;
        border-width: 4px;
      }
    }
  `;
  const fetchdata = () => {
    axios.get('http://localhost:7070/get-services')
      .then((response) => {
        setServices(response.data.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };
  function mapingdata() {
    setLoading(true);
    setservicesdata([]); // reset

    const calls = services.map((dt) => {
      const method = dt.method?.toUpperCase();
      const url = dt.api_url;
      const payload = dt.request_payload || {};
      const services_name = dt.services_name || dt.name || url;

      let axiosCall;
      if (method === 'GET' || method === 'DELETE') {
        axiosCall = axios[method.toLowerCase()](url);
      } else if (['POST', 'PUT', 'PATCH'].includes(method)) {
        axiosCall = axios[method.toLowerCase()](url, payload);
      } else {
        // unsupported method = immediately return a row with error
        return Promise.resolve({
          services_name,
          method,
          api_url: url,
          status_code: 'UNSUPPORTED',
          error: 'Unsupported method',
        });
      }

      const started = Date.now();

      return axiosCall
        .then((response) => ({
          services_name,
          method,
          api_url: url,
          status_code: response.status,
          error: null,
          duration_ms: Date.now() - started,
        }))
        .catch((err) => ({
          services_name,
          method,
          api_url: url,
          status_code: err?.response?.status ?? 'ERROR',
          error:
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.code ||
            err?.message ||
            'Unknown error',
          duration_ms: Date.now() - started,
        }));
    });

    Promise.all(calls)
      .then((rows) => setservicesdata(rows))
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    fetchdata();
  }, []);

  useEffect(() => {
    if (services.length > 0) {
      mapingdata(); // Only run after services are fetched
    }
  }, [services]);

  // const filteredData = useMemo(() => {
  //   // In filteredData useMemo
  //   return servicesdata
  //     .map((row, i) => ({ ...row, _index: i + 1 }))
  //     .filter((row) => {
  //       const name = row.services_name?.toLowerCase() || '';
  //       const err = (row.error || '').toLowerCase();
  //       const status = String(row.status_code || '').toLowerCase();
  //       const snum = String(row._index).toLowerCase();

  //       return (
  //         snum.includes(searchTerm.toLowerCase()) &&
  //         name.includes(search.toLowerCase()) &&
  //         err.includes(errors.toLowerCase()) &&
  //         (statusSearch === '' || status.includes(statusSearch.toLowerCase()))
  //       );
  //     });

  // }, [servicesdata, search, errors, statusSearch]);
  const statusDot = (code) => {
    if (code === 200) return 'bg-green-500';
    if (code === 'ERROR' || Number(code) >= 400) return 'bg-red-500';
    return 'bg-yellow-500';
  };
  const clearAllFilters = () => {
    setSearchTerm('');
    setSearch('');
    setErrors('');
    setStatusSearch('');
  };
  const totalPages = Math.ceil(servicesdata.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = servicesdata.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <Layout>
      <style>{loadingStyle}</style>
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg text-center max-w-sm mx-2 border border-gray-200">
            <div className="loader mx-auto mb-3"></div>
            <p className="text-gray-900 font-semibold text-sm">
              Checking services status...
            </p>
            <p className="text-gray-600 text-xs mt-1">
              Please wait while we verify all endpoints
            </p>
          </div>
        </div>
      )}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-6  mt-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-0">
            Services Dashboard
          </h1>
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={mapingdata}
              disabled={loading}
              className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-indigo-700"
            >
              <IoRefresh className="mr-1 sm:mr-2" size={14} />
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => navigate('/add-service')}
              disabled={loading}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 shadow-sm border border-indigo-700"
            >
              Add Service
            </button>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <div className="w-full overflow-x-auto  rounded-lg shadow-md">
            <table className="min-w-full text-[11px] text-sm text-left border">

              <thead className="bg-indigo-600 text-white text-[10px] sm:text-xs uppercase">
                <tr>
                  <th className="px-2 py-1 sm:px-3 sm:py-2">S.No</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2">Service</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2">Status</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2">Error</th>
                  <th className="px-2 py-1 sm:px-3 sm:py-2 text-center">Actions</th>
                </tr>
                <tr className="bg-gray-100 text-[10px] sm:text-xs">
                  {/* S.No Filter */}
                  <td className="border border-gray-200 p-[6px] sm:p-2">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="S.No"
                        className="w-full px-2 py-[6px] sm:py-1.5  text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
                        >
                          <IoClose size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Service Filter */}
                  <td className="border border-gray-200 p-[6px] sm:p-2">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Service"
                        className="w-full px-2 py-[6px] sm:py-1.5  text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
                        >
                          <IoClose size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Status Filter */}
                  <td className="border border-gray-200 p-[6px] sm:p-2">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Status"
                        className="w-full px-2 py-[6px] sm:py-1.5  text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                        value={statusSearch}
                        onChange={(e) => setStatusSearch(e.target.value)}
                      />
                      {statusSearch && (
                        <button
                          onClick={() => setStatusSearch('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
                        >
                          <IoClose size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Error Filter */}
                  <td className="border border-gray-200 p-[6px] sm:p-2">
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Error"
                        className="w-full px-2 py-[6px] sm:py-1.5  text-black text-[10px] sm:text-xs rounded-lg shadow-sm border border-gray-300 group-focus-within:border-indigo-500 focus:ring-2 focus:ring-indigo-400 transition-all duration-200"
                        value={errors}
                        onChange={(e) => setErrors(e.target.value)}
                      />
                      {errors && (
                        <button
                          onClick={() => setErrors('')}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition duration-200"
                        >
                          <IoClose size={14} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Clear All Button */}
                  <td className="text-center border border-gray-200 p-[6px] sm:p-2 ">
                    <button
                      onClick={clearAllFilters}
                      className="text-[10px] sm:text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-all duration-200"
                    >
                      Clear All
                    </button>
                  </td>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">{index + 1}</td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2  text-black border-2 border-gray-300">{item.services_name}</td>
                    {/* <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">{item.status_code}</td>
                   */}

                    <td className="px-2 py-1 sm:px-3 sm:py-2 border-2 border-gray-300">
                      <div className="flex items-center justify-center gap-1 sm:gap-2 h-full">
                        <span className={`h-2.5 w-2.5 rounded-full ${statusDot(item.status_code)}`}></span>
                        <span className="text-xs sm:text-sm font-medium text-black">{item.status_code}</span>
                      </div>
                    </td>


                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-black text-center border-2 border-gray-300">{item.error || '—'}</td>
                    <td className="px-2 py-1 sm:px-3 sm:py-2 text-black border-2 border-gray-300">
                      <button className="p-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full transition-colors" aria-label="View details">
                        <IoEyeOff className="text-sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="w-full bg-indigo-600 text-white px-2 py-1.5">
            <div className="flex flex-col xs:flex-row items-center justify-between gap-1 w-full">
              {/* Pagination Info */}
              <div className="w-full xs:w-auto text-center xs:text-left text-xs">
                <span className="font-medium">
                  Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, servicesdata.length)} of {servicesdata.length}
                </span>
              </div>

              {/* Pagination Controls */}
              <div className="w-full xs:w-auto flex items-center justify-between gap-1">
                {/* Previous Button */}
                <button
                  className="flex-1 xs:flex-none flex items-center justify-center px-2 py-0.5 rounded border border-indigo-400 hover:bg-indigo-700 disabled:opacity-50 text-xs min-w-[60px]"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Prev
                </button>

                {/* Page Indicator */}
                <div className="text-xs font-medium px-1 whitespace-nowrap">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Next Button */}
                <button
                  className="flex-1 xs:flex-none flex items-center justify-center px-2 py-0.5 rounded border border-indigo-400 hover:bg-indigo-700 disabled:opacity-50 text-xs min-w-[60px]"
                  onClick={() => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev))}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>





        </div>
        {/* </div> */}
      </div>
    </Layout>
  );
};

export default Youngbazerfruntend;
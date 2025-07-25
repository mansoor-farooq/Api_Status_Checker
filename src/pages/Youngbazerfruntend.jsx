

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';
import { IoEyeOff } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';


const Youngbazerfruntend = () => {

  // const [services, setServices] = useState({
  //   backend: { status: 'UNKNOWN', error: 'Active', loading: false },
  //   frontend: { status: 'UNKNOWN', error: 'Active', loading: false },
  //   product: { status: 'UNKNOWN', error: 'Active', loading: false },
  //   integration: { status: 'UNKNOWN', error: 'Active', loading: false },
  //   barcode: { status: 'UNKNOWN', error: 'Active', loading: false },
  // });

  const [services, setServices] = useState([]);
  const [servicesdata, setservicesdata] = useState([])
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState('');
  const [statusSearch, setStatusSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const fetchdata = () => {
    axios.get('http://localhost:7070/get-services')
      .then((response) => {
        console.log("fetchdata", response.data.data);
        setServices(response.data.data)
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    fetchdata();
  }, [])



  // const servicesData = [
  //   { id: 1, name: 'Young Bazer Backend', status: services.backend.status, error: services.backend.error },
  //   { id: 2, name: 'Frontend Service', status: services.frontend.status, error: services.frontend.error },
  //   { id: 3, name: 'Product Service', status: services.product.status, error: services.product.error },
  //   { id: 4, name: 'Integration Service', status: services.integration.status, error: services.integration.error },
  //   { id: 5, name: 'Barcode Service', status: services.barcode.status, error: services.barcode.error },
  // ];

  const filteredData = useMemo(() => {
    return services.filter((service) => {
      const status = service.status?.toString().toLowerCase() || '';
      const error = service.error?.toLowerCase() || '';
      const name = service.services_name?.toLowerCase() || '';

      return (
        name.includes(search.toLowerCase()) &&
        error.includes(errors.toLowerCase()) &&
        (statusSearch === '' || status.includes(statusSearch.toLowerCase()))
      );
    });
  }, [search, errors, statusSearch, services]);


  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // useEffect(() => {
  //   console.log('Initial refresh on mount');
  //   getAllRefresh(false);
  // }, [getAllRefresh]);

  return (
    <Layout>
      <div className="container mx-auto mt-5 px-4 py-6">
        <div className="flex justify-end mb-4 mt-6">
          <button
            // onClick={handleRefreshClick}
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
        <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
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
              {/* {currentItems.map((service) => ( */}
              {currentItems.map((service, index) => (
                <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-2 text-black text-center border-2 border-gray-300">{index + 1}</td>
                  <td className="px-3 py-2 text-black border-2 border-gray-300">{service.services_name}</td>
                  <td className="px-3 py-2 text-black text-center border-2 border-gray-300">
                    {services[
                      (service?.services_name?.split?.(' ')[0] || '').toLowerCase()


                    ]?.loading ? 'Loading...' : service.error}

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

export default Youngbazerfruntend;




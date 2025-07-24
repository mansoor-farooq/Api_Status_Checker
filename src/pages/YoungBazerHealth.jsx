// import React, { useEffect, useLayoutEffect, useState } from 'react';
// import Layout from '../component/Layout';
// import axios from 'axios';
// const YoungBazerHealth = () => {
//const [status, setStatus] = useState('');
//// useEffect(() => {
//const fetchYoungBazerHealth = async () => {
//try {
//await axios.get('http://202.143.125.148:9000/health')
//.then(response => {
// console.log("Young Bazer health response:", response);
// setStatus(response.data.status);
//})
//.catch(error => {
// console.error("Error fetching Young Bazer health data:", error);
// setStatus('ERROR');
//});
//} catch (error) {
//console.error("Error fetching Young Bazer health data:", error);
//setStatus('ERROR');
//} };
//fetchYoungBazerHealth();
//// }, []);
//return (
//<Layout>
//<div className="container mx-auto px-4 py-8">
//<h1 className="text-3xl font-bold mb-4">Young Bazer Health</h1>
//<p className="text-lg mb-4">A health monitoring system for backend service status.</p>
//<div className="overflow-x-auto mt-8">
// <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">
//<thead className="bg-gray-100">
//<tr>
//<th className="px-4 py-3 border text-left">S.No</th>
//<th className="px-4 py-3 border text-left">Service</th>
//<th className="px-4 py-3 border text-left">Status</th>
//</tr>
//</thead>
//<tbody>
//<tr className="hover:bg-gray-50">
//<td className="px-4 py-3 border">1</td>
//<td className="px-4 py-3 border">Young Bazer Backend</td>
//<td className="px-4 py-3 border font-semibold">
//<span
// className={`h-3 w-3 rounded-full inline-block${status === 'ERROR'
//? 'bg-red-500'
//: status === 'OK'
//? 'bg-green-500'
//: 'bg-yellow-500'
//}`}
//></span>
//</td>
//</tr>
//</tbody>
// </table>
//</div>
//</div>
//</Layout>
//);
// };
// export default YoungBazerHealth;

import React, { useEffect, useState } from 'react';
import Layout from '../component/Layout';
import axios from 'axios';
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import { IoEyeOff } from "react-icons/io5";
import { data } from 'react-router-dom';
const ResponsiveGridLayout = WidthProvider(Responsive);

const YoungBazerHealth = () => {

    const [status, setStatus] = useState('');
    const [errorStatus, setErrorStatus] = useState(false);
    const [frontendStatus, setFrontendStatus] = useState();
    const [dummyStatus, setDummyStatus] = useState();
    const [testStatus, setTestStatus] = useState();
    const [barcode, setbarcode] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setsearch] = useState('');
    const [Errors, setError] = useState('');
    const [StatusSearch, setStatusSearch] = useState('')

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);



    function fetechbackend() {
        axios.get('http://202.143.125.148:9000/health')
            .then(response => {
                console.log("Young Bazer health response:", response);
                setStatus(response.data.status)
            })
    };
    const get_fruntend_youngbazer = async () => {
        try {
            const response = await axios.get('http://202.143.125.148:9001/get_tickers');
            setFrontendStatus(response.status);
            setErrorStatus(false); // no error
        } catch (error) {
            setErrorStatus(true); // error occurred
        }
    };

    //product service
    const get_dummyjson = async () => {
        axios.get('https://dummyjson.com/products/2')
            .then(response => {
                setDummyStatus(response.status)
                console.log("dummy json ", response.status)
            })
    };

    //integration service
    const dummytest = async () => {
        axios.get('https://dummyjson.com/test')
            .then(response => {
                setTestStatus(response.status)
                console.log("dummytest", response.status)
            })
    };

    const getbarcode = () => {
        axios.get('http://192.168.1.161:5500/get-bar-code')
            .then(response => {
                console.log("getbarcode", response)
                setbarcode(response)
            })
    }




    const getallrefrsh = () => {
        fetechbackend();
        dummytest();
        get_dummyjson();
        get_fruntend_youngbazer();
        getbarcode();
    };

    const filteredData = Array.isArray(data)
        ? data.filter(service => service.status === selectedStatus || selectedStatus === "All")
        : [];
    console.log(errorStatus)
    console.log("yadummy_json", dummyStatus)
    console.log("yadummy_json", dummyStatus)

    console.log("testStatus", testStatus)

    console.log("frontendStatus", frontendStatus)

    getallrefrsh();

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);


    return (
        <Layout>
            <div className="container mx-auto mt-4 px-4 py-8">
                <div className="overflow-x-auto mt-8 ">
                    <div className="min-w-full inline-block align-middle">
                        <div className="flex justify-end mb-4 ">
                            <button onClick={getallrefrsh}
                                className="px-4 py-2 sm:text-base font-semiboldsm:px-4 sm:py-2 bg-blue-500 text-white text-smrounded hover:bg-blue-600 transition-colors">
                                Refresh Services
                            </button>
                        </div>
                        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">

                            <table className="min-w-full table-auto border-collapse bg-white  border border-gray-200 shadow-sm text-sm  text-gray-700 ">
                                <thead className="bg-gray-100 text-sm text-gray-900 border">
                                    {/* Table Header */}
                                    <tr>
                                        <th className="w-16 px-2 py-1 border uppercase tracking-wider">S.No</th>
                                        <th className="px-3 py-1 border uppercase tracking-wider">Service</th>
                                        <th className="w-10 px-2 py-1 border uppercase tracking-wider">Error</th>
                                        <th className="w-10 px-2 py-1 border uppercase tracking-wider">Status</th>
                                        <th className="w-10 px-2 py-1 border uppercase tracking-wider">Action</th>
                                    </tr>

                                    {/* Search Row */}
                                    <tr className="bg-gray-50">
                                        <td className="w-16 px-2 py-1 border">
                                            <input
                                                type="text"
                                                placeholder="S.No"
                                                className="w-full px-2 py-1 border rounded text-xs"
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </td>
                                        <td className="px-2 py-1 border">
                                            <input
                                                type="text"
                                                placeholder="Service"
                                                className="w-full px-2 py-1 border rounded text-xs"
                                                value={search}
                                                onChange={(e) => setsearch(e.target.value)}
                                            />
                                        </td>
                                        <td className="w-10 px-2 py-1 border">
                                            <input
                                                type="text"
                                                placeholder="Error"
                                                className="w-full px-2 py-1 border rounded text-xs"
                                                value={Errors}
                                                onChange={(e) => setError(e.target.value)}
                                            />
                                        </td>
                                        <td className="w-10 px-2 py-1 border">
                                            <input
                                                type="text"
                                                placeholder="Status"
                                                className="w-full px-2 py-1 border rounded text-xs"
                                                value={StatusSearch}
                                                onChange={(e) => setStatusSearch(e.target.value)}
                                            />
                                        </td>
                                        <td className="w-10 px-2 py-1 border text-center text-gray-400 text-xs">Search</td>
                                    </tr>
                                </thead>


                                <tbody>

                                    {/* 1. Backend */}
                                    <tr className="hover:bg-gray-50">
                                        {/* S.No column */}
                                        <td className="w-12 px-2 py-1 text-sm text-gray-900 border">1</td>

                                        {/* Service column */}
                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Young Bazer Backend
                                        </td>

                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Error
                                        </td>

                                        {/* Status column */}
                                        <td className="w-10 px-2 py-1 text-sm text-gray-900 border">
                                            <div className="flex items-center">
                                                <span
                                                    className={`h-3 w-3 rounded-full inline-block mr-1 ${status === 'ERROR' ? 'bg-red-500' :
                                                        status === 'OK' ? 'bg-green-500' : 'bg-yellow-500'
                                                        }`}
                                                ></span>
                                                <span className="hidden sm:inline">{status}</span> {/* optional status text */}
                                            </div>
                                        </td>

                                        {/* Action column */}
                                        <td className="w-20 px-2 py-1 text-sm text-gray-900 border text-center">
                                            <button className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                                                <IoEyeOff className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>


                                    {/* 2. Frontend */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">2</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Frontend Service</td>
                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Error
                                        </td>
                                        <td className="w-10 px-2 py-1 text-sm text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${errorStatus ? 'bg-red-500' :
                                                    frontendStatus === 200 ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                        {/* Action column */}
                                        <td className="w-20 px-2 py-1 text-sm text-gray-900 border text-center">
                                            <button className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                                                <IoEyeOff className="text-lg" />
                                            </button>
                                        </td>

                                    </tr>

                                    {/* 3. Product Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">3</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Product Service</td>
                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Error
                                        </td>
                                        <td className="w-10 px-2 py-1 text-sm text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${dummyStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                        {/* Action column */}
                                        <td className="w-20 px-2 py-1 text-sm text-gray-900 border text-center">
                                            <button className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                                                <IoEyeOff className="text-lg" />
                                            </button>
                                        </td>
                                    </tr>

                                    {/* 4. Integration Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">4</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Integration Service</td>
                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Error
                                        </td>
                                        <td className="w-10 px-2 py-1 text-sm text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${testStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                        {/* Action column */}
                                        <td className="w-20 px-2 py-1 text-sm text-gray-900 border text-center">
                                            <button className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                                                <IoEyeOff className="text-lg" />
                                            </button>
                                        </td>

                                    </tr>

                                    {/* 4. Integration Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">4</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Integration Service</td>
                                        <td className="w-20   px-3 py-1 text-sm text-gray-900 border">
                                            Error
                                        </td>
                                        <td className="w-10 px-2 py-1 text-sm text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${testStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                        {/* Action column */}
                                        <td className="w-20 px-2 py-1 text-sm text-gray-900 border text-center">
                                            <button className="p-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition-colors">
                                                <IoEyeOff className="text-lg" />
                                            </button>
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                            <div className="flex justify-center mt-4 space-x-2">
                                <button
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <span className="px-4 py-1 text-sm">Page {currentPage}</span>
                                <button
                                    className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                                    onClick={() =>
                                        setCurrentPage(prev =>
                                            prev < Math.ceil(filteredData.length / itemsPerPage) ? prev + 1 : prev
                                        )
                                    }
                                    disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout >
    );
};

export default YoungBazerHealth;

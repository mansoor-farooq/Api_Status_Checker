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

const YoungBazerHealth = () => {

    const [status, setStatus] = useState('');
    const [errorStatus, setErrorStatus] = useState(false);
    const [frontendStatus, setFrontendStatus] = useState();
    const [dummyStatus, setDummyStatus] = useState();
    const [testStatus, setTestStatus] = useState();
    const [barcode, setbarcode] = useState();
    const [searchTerm, setSearchTerm] = useState('');
    const [search, setsearch] = useState('');


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

    console.log(errorStatus)
    console.log("yadummy_json", dummyStatus)
    console.log("yadummy_json", dummyStatus)

    console.log("testStatus", testStatus)

    console.log("frontendStatus", frontendStatus)

    getallrefrsh();

    // const filteredData = getallrefrsh.filter(item =>
    //     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     item.city.toLowerCase().includes(searchTerm.toLowerCase())
    // );

    return (
        <Layout>
            <div className="container mx-auto mt-4 px-4 py-8">
                {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-700 mb-3 sm:mb-4">Young Bazer Health</h1>
 <p className="text-base sm:text-lg text-gray-700 mb-6">A health monitoring system for backend service status.</p> */}

                <div className="overflow-x-auto mt-8 ">
                    <div className="min-w-full inline-block align-middle">
                        <div className="flex justify-end mb-4 ">
                            <button onClick={getallrefrsh}
                                className="px-4 py-2 sm:text-base font-semiboldsm:px-4 sm:py-2 bg-blue-500 text-white text-smrounded hover:bg-blue-600 transition-colors">
                                Refresh Services
                            </button>
                        </div>
                        <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">

                            <table className="min-w-full table-auto border-collapse bg-white border border-gray-200 shadow-sm text-sm text-gray-700">

                                <thead className="bg-gray-100 px-4 py-3 w-full text-sm sm:text-base text-gray-900 border">
                                    <tr>
                                        <th className="px-4 py-3 text-sm sm:text-base text-gray-900 border uppercase tracking-wider">S.No</th>
                                        <th className="px-4 py-3 text-sm sm:text-base text-gray-900 border uppercase tracking-wider">Service</th>
                                        <th className="px-4 py-3 text-sm sm:text-base text-gray-900 border uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    <tr className="w-full px-4 py-3 border bg-gray-50">
                                        <td colSpan="4" className="px-4 py-3">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {/* Serial Number Search */}
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                        <i className="fas fa-hashtag"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search by serial number"
                                                        className="pl-10 pr-4 py-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                    />
                                                </div>

                                                {/* Service Name Search */}
                                                <div className="relative">
                                                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                                                        <i className="fas fa-search"></i>
                                                    </span>
                                                    <input
                                                        type="text"
                                                        placeholder="Search by service name"
                                                        className="pl-10 pr-4 py-3 w-full rounded-md shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                                        value={search}
                                                        onChange={(e) => setsearch(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>



                                    {/* 1. Backend */}
                                    <tr className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">1</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border ">Young Bazer Backend</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${status === 'ERROR' ? 'bg-red-500' :
                                                    status === 'OK' ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* 2. Frontend */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">2</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Frontend Service</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border ">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${errorStatus ? 'bg-red-500' :
                                                    frontendStatus === 200 ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                    </tr>

                                    {/* 3. Product Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">3</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Product Service</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${dummyStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>
                                        {/* <td className="px-4 py-3">
<button onClick={get_dummyjson} className="px-3 py-1 sm:px-4 sm:py-2 bg-blue-500 text-white text-sm sm:text-base rounded hover:bg-blue-600">
Refresh
</button>
</td> */}
                                    </tr>

                                    {/* 4. Integration Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">4</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Integration Service</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${testStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>

                                    </tr>

                                    {/* 4. Integration Service */}
                                    <tr className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">4</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">Integration Service</td>
                                        <td className="px-4 py-3 text-sm sm:text-base text-gray-900 border">
                                            <div className="flex items-center">
                                                <span className={`h-3 w-3 rounded-full inline-block mr-2 ${testStatus === 200 ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`}></span>
                                            </div>
                                        </td>

                                    </tr>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default YoungBazerHealth;

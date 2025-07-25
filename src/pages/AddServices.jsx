// import React, { useState } from 'react'
// import Layout from '../component/Layout'
// import { FaServicestack } from 'react-icons/fa';

// const AddServices = () => {
//     const [status, setstatus] = useState(true || false);
//     const [name, setname] = useState('');
//     const [description, setdescription] = useState('');
//     const [apiurl, setapiurl] = useState('');
//     console.log("status", status);
//     return (
//         <Layout>
//             <div className='countainer  mt-3.5 '>
//                 <div className='mt-3'>
//                     <div className="mt-3.5 hover: bg-emerald-400  ">
//                         <h1> Add Services </h1>
//                     </div>
//                     <div className='col-auto display: flex bg-white text-black text-sm '>
//                         <div>
//                             <label> Service Name:</label>
//                             <FaServicestack />
//                             <input type='text' placeholder='Enter Service Name'
//                                 onChange={(e) => {
//                                     setname(e.target.value);
//                                 }}
//                                 className=" text-gray-900  font-semibold  block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
//                             />
//                         </div>

//                         <div>
//                             <label>Description</label>
//                             <input type='text' maxLength={300}
//                                 onChange={(e) => {
//                                     setdescription(e.target.value);
//                                 }}
//                                 className=" text-gray-900  font-semibold  block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
//                             />
//                         </div>
//                         <div>

//                             <label> api_url</label>
//                             <input type='text' placeholder='Enter api_url'
//                                 onChange={(e) => {
//                                     setapiurl(e.target.value);
//                                 }}
//                                 className=" text-gray-900  font-semibold  block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
//                             />
//                         </div>


//                         <div>
//                             <label className="text-sm text-gray-700">Status</label>
//                             <select
//                                 value={status}
//                                 onChange={(e) =>
//                                     setstatus(e.target.value === 'true')
//                                     // setState({ status: e.target.value === "true" })
//                                 }
//                                 className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                             >
//                                 <option value="">Select Status</option>
//                                 <option value="true">Active</option>
//                                 <option value="false">Inactive</option>
//                             </select>
//                         </div>

//                     </div>
//                 </div>
//             </div>
//         </Layout>

//     )
// }

// export default AddServices



import { VscSymbolMethod } from "react-icons/vsc";
import { useState } from 'react';
import Layout from '../component/Layout';
import { FaCog, FaFileAlt, FaLink, FaPowerOff, FaPlusCircle } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddServices = () => {
    const [status, setStatus] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [apikey, setapikey] = useState('');
    const [rqpayload, setrqpayload] = useState('');
    const [method, setmethod] = useState('GET' || 'POST' || 'PUT' || 'PATCH' || 'DELETE');


    const navigate = useNavigate();
    console.log("status", status);

    // const add_data = () => {
    //     const payload = {
    //         services_name: name,
    //         description: description,
    //         api_url: apiUrl,
    //         status: status
    //     };

    //     axios.post('http://localhost:7070/add-services', payload)
    //         .then((response) => {

    //             console.log(response);
    //             if (response.status === 200) {
    //                 Swal.fire({
    //                     title: 'Success',
    //                     text: 'Data Added Successfully',
    //                     icon: 'success',
    //                     confirmButtonText: 'OK',
    //                 })
    //                     .then(() => {
    //                         setApiUrl('');
    //                         setDescription('');
    //                         setName('');
    //                         setStatus(true);
    //                         navigate('/youngBazer');
    //                     })
    //             } caches((error) => {
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Error',
    //                     text: error.response.data.message
    //                 })
    //             })


    //         })

    // }

    const add_data = () => {
        let parsedPayload = null;

        // ✅ If method is not GET, validate and parse rqpayload
        if (method !== 'GET' && rqpayload) {
            try {
                parsedPayload = JSON.parse(rqpayload);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid JSON',
                    text: 'Request Payload must be valid  like this forment JSON.\nExample: {"username": "admin", "password": "password"}',
                });
                return;
            }
        }

        const payload = {
            services_name: name,
            description: description,
            "status": status,
            "api_url": apiUrl,
            "api_key": apikey,
            //     "method": method,
            //     "request_payload": {
            //         "username": "admin@example.com",
            //         "password": "secure123"
            //     }
            // };
            method: method,
            request_payload: parsedPayload
        };

        if (!name) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'name is recuired ',
            });
            return;
        }

        if (!description) {
            Swal.fire({
                title: 'error',
                icon: 'error',
                text: 'Description is recuired',
            });
            return;
        }

        if (!apiUrl) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'api url is recuired',
            });
            return;
        }
        if (!apikey) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'api key is recuired',
            })
        }



        if (!method) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'API method is required',
            });
            return;
        }

        // ✅ Only check payload if method is not GET
        if (method !== 'GET' && !rqpayload) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Payload is required for methods other than GET',
            });
            return;
        }



        axios.post('http://localhost:7070/add-services', payload)
            .then((response) => {
                if (response.status === 200) {
                    Swal.fire({
                        title: 'Success',
                        text: 'Data Added Successfully',
                        icon: 'success',
                        confirmButtonText: 'OK',
                    }).then(() => {
                        setApiUrl('');
                        setDescription('');
                        setName('');
                        setStatus(true);
                        navigate('/youngBazer'); // Make sure navigate is defined using useNavigate()
                    });
                }
            })
            .catch((error) => {
                console.log(error, "error")
                Swal.fire({
                    icon: 'error',
                    title: 'Error',

                    text: error.response?.data?.message || 'Something went wrong'
                });
            });
    };

    return (
        <Layout>
            <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">

                <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-6 max-w-4xl w-full mx-auto animate-fade-in-up">
                    <div className="mb-4 text-center animate-slide-in-down">
                        <h1 className=" text-balance text-2xl font-semibold text-black flex justify-center items-center gap-2">
                            <FaPlusCircle className="text-indigo-600  transition-transform duration-300 hover:rotate-180" />
                            Add New Service
                        </h1>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                        <div className="animate-fade-in-up animation-delay-200">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <FaCog className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                Service Name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Service Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="Service Name"
                            />
                        </div>

                        <div className="animate-fade-in-up animation-delay-300">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <FaFileAlt className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                Description
                            </label>
                            <input
                                type="text"
                                maxLength={300}
                                placeholder="Enter Service Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="Description"
                            />
                        </div>

                        <div className="animate-fade-in-up animation-delay-400">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <FaLink className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                API URL
                            </label>
                            <input
                                type="text"
                                placeholder="Enter API URL"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="API URL"
                            />
                        </div>


                        <div className="animate-fade-in-up animation-delay-500">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <VscSymbolMethod className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                API Method
                            </label>
                            <select
                                value={method}
                                onChange={(e) => setmethod(e.target.value)}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="API Method"
                            >
                                <option value="">Select Method</option>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        {method !== 'GET' && (
                            <div className="animate-fade-in-up animation-delay-400">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                    <FaLink className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                    Payload
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter payload"
                                    value={rqpayload}
                                    onChange={(e) => setrqpayload(e.target.value)}
                                    className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                    aria-label="API payload"
                                />

                            </div>
                        )}


                        <div className="animate-fade-in-up animation-delay-400">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <FaLink className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                Api key
                            </label>
                            <input
                                type="text"
                                placeholder="Enter API key"
                                value={apikey}
                                onChange={(e) => setapikey(e.target.value)}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="API Key"
                            />
                        </div>


                        <div className="animate-fade-in-up animation-delay-500">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <FaPowerOff className="text-indigo-600 transition-transform duration-300 hover:scale-110" />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value === 'true')}
                                className="w-full px-4 py-2 text-gray-900 font-semibold border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 hover:border-indigo-400 hover:shadow-md text-base"
                                aria-label="Status"
                            >
                                <option value="">Select Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end mb-4 mt-6">
                        <div className="flex justify-end mt-5 animate-fade-in-up animation-delay-600">
                            <button
                                type="button"
                                onClick={add_data}
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
                                aria-label="Add Service"
                            >
                                Add Service
                            </button>
                        </div>
                        <div className="flex justify-end mt-5 animate-fade-in-up animation-delay-600">
                            <button
                                type="button"
                                onClick={() => navigate('/youngBazer')}
                                className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200 shadow-md disabled:opacity-50"
                                aria-label="Add Service"
                            >
                                Back To The List
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AddServices;
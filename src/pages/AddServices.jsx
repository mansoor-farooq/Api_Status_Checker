import { SiGoogleauthenticator } from "react-icons/si";
import { VscSymbolMethod } from "react-icons/vsc";
import { useState } from 'react';
import Layout from '../component/Layout';
import { FaCog, FaFileAlt, FaLink, FaPowerOff, FaPlusCircle, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AddServices = () => {
    const [status, setStatus] = useState(true);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [sorce_name, setsorce_name] = useState('');
    const [apiUrl, setApiUrl] = useState('');
    const [apikey, setapikey] = useState('');
    const [rqpayload, setrqpayload] = useState('');
    const [method, setmethod] = useState('GET');
    const [auth, setauth] = useState('');
    const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.239:7070';
    const navigate = useNavigate();




    const add_data = () => {

        let parsedPayload = null;
        let parsedAuth = null;

        if (method !== 'GET' && rqpayload) {
            try {
                parsedPayload = JSON.parse(rqpayload);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid JSON',
                    text: 'Request Payload must be valid JSON.\nExample: {"username": "admin", "password": "password"}',
                });
                return;
            }
        }
        if (auth.trim() !== '') {
            try {
                parsedAuth = JSON.parse(auth);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Auth JSON',
                    text: 'Auth must be valid JSON like {"Username": "user", "password": "pass"}',
                });
                return;
            }
        }
        const payload = {
            services_name: name,
            description: description,
            status: status,
            api_url: apiUrl,
            api_key: apikey,
            method: method,
            request_payload: parsedPayload,
            auth: auth,
            sorce_name: sorce_name
        };

        if (!sorce_name) {
            Swal.fire({
                icon: 'error',
                title: 'error',
                text: 'sorce name is recuired ',
            });
            return;
        }

        if (parsedAuth) {
            payload.auth = parsedAuth;
        }
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
        if (method !== 'GET' && !rqpayload) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Payload is required for methods other than GET',
            });
            return;
        }

        axios.post(`${API_BASE}/add-services`, payload)
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
                        setauth('');
                        setName('');
                        setStatus(true);
                        navigate('/services_status');
                    });
                }
            })
            .catch((error) => {

                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: error.response?.data?.message || 'Something went wrong'
                });
            });
    };

    return (
        <Layout>

            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-6 md:p-8 max-w-4xl w-full mx-auto transition-all duration-300 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={() => navigate('/services_status')}
                            className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors duration-200"
                        >
                            <FaArrowLeft className="mr-2" />
                            Back to List
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
                            <FaPlusCircle className="text-indigo-600 animate-pulse" />
                            Add New Service
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaCog className="text-indigo-600" />
                                Service Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Service Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border text-black font-semibold border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="Service Name"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaCog className="text-indigo-600" />
                                Sorce Name *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter Sorce Name "
                                value={sorce_name}
                                onChange={(e) => setsorce_name(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border text-black font-semibold border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="Sorce Name "
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaFileAlt className="text-indigo-600" />
                                Description *
                            </label>
                            <input
                                type="text"
                                maxLength={300}
                                placeholder="Enter Service Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 text-black font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="Description"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <SiGoogleauthenticator className="text-indigo-600" />
                                Authentication (JSON)
                            </label>
                            <input
                                type="text"
                                placeholder='Example: {"username": "admin", "password": "password"}'
                                value={auth}
                                onChange={(e) => setauth(e.target.value)}
                                className="w-full px-4 py-3 text-black font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="Auth"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaLink className="text-indigo-600" />
                                API URL *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter API URL"
                                value={apiUrl}
                                onChange={(e) => setApiUrl(e.target.value)}
                                className="w-full px-4 py-3 text-black font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="API URL"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <VscSymbolMethod className="text-indigo-600" />
                                API Method *
                            </label>
                            <select
                                value={method}
                                onChange={(e) => setmethod(e.target.value)}
                                className="w-full px-4 py-3 text-black font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="API Method"
                            >
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                                <option value="PUT">PUT</option>
                                <option value="PATCH">PATCH</option>
                                <option value="DELETE">DELETE</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaLink className="text-indigo-600" />
                                API Key *
                            </label>
                            <input
                                type="text"
                                placeholder="Enter API Key"
                                value={apikey}
                                onChange={(e) => setapikey(e.target.value)}
                                className="w-full px-4 py-3  text-black font-semibold bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="API Key"
                            />
                        </div>

                        {method !== 'GET' && (
                            <div className="space-y-1 md:col-span-2">
                                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <FaFileAlt className="text-indigo-600" />
                                    Request Payload (JSON) *
                                </label>
                                <textarea
                                    placeholder='Example: {"param1": "value1", "param2": "value2"}'
                                    value={rqpayload}
                                    onChange={(e) => setrqpayload(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3  text-black font-semibold    bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                                    aria-label="Request Payload"
                                />
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                <FaPowerOff className="text-indigo-600" />
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value === 'true')}
                                className="w-full px-4 py-3  text-black font-semibold   bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                aria-label="Status"
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/services_status')}
                            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors duration-200 shadow-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={add_data}
                            className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200 shadow-md disabled:opacity-50 flex items-center gap-2"
                        >
                            <FaPlusCircle />
                            Add Service
                        </button>
                    </div>
                </div>
            </div>

        </Layout>
    );
};

export default AddServices;

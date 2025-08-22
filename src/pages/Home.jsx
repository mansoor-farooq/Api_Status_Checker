// import Layout from '../component/Layout';
// import RecentActivities from '../component/RecentActivities';

// const HomePage = () => {
//     return (
//         <Layout>
//             {/* <div className="min-h-screen bg-gray-50"> */}
//             <div className="min-h-screen bg-gray-50 pt-20 text-bl" > {/* Added pt-20 to add padding top */}
//                 {/* Navbar */}
//                 <RecentActivities />

//                 {/* Footer */}
//             </div>
//         </Layout>
//     );
// };

// export default HomePage;

import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../component/Layout";
import Dashboard from "../component/RecentActivities";
import axios from "axios";
import Swal from "sweetalert2";

const HomePage = () => {
    const [globalServicesData, setGlobalServicesData] = useState([]);
    const [services, setServices] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Keep track of AbortControllers for cancellation
    const abortControllersRef = useRef([]);

    const apiStats = useMemo(() => {
        const totalApis = globalServicesData.length;
        const workingApis = globalServicesData.filter(api => api.status_code === 200).length;
        const errorApis = globalServicesData.filter(api =>
            api.status_code >= 400 || api.status_code === "ERROR" || api.status_code === "UNSUPPORTED"
        ).length;

        return {
            totalApis,
            workingApis,
            errorApis,
            successRate: totalApis > 0 ? Math.round((workingApis / totalApis) * 100) : 0
        };
    }, [globalServicesData]);

    const fetchdata = () => {
        setLoading(true);
        const controller = new AbortController();
        abortControllersRef.current.push(controller);

        axios.get("http://localhost:7070/get-services", {
            timeout: 10000,
            signal: controller.signal
        })
            .then((response) => {
                setServices(response.data.data);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return; // Ignore canceled requests
                console.error("error", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to fetch services data",
                    icon: "error",
                    confirmButtonText: "OK"
                });
            })
            .finally(() => setLoading(false));
    };

    const mapingdata = () => {
        setLoading(true);
        setServicesData([]);

        // Cancel previous mapping requests
        abortControllersRef.current.forEach(ctrl => ctrl.abort());
        abortControllersRef.current = [];

        const calls = services.map((dt) => {
            const method = dt.method?.toUpperCase();
            const url = dt.api_url;
            const auth = dt.auth;
            const payload = dt.request_payload || {};
            const services_name = dt.services_name || dt.name || url;
            const controller = new AbortController();
            abortControllersRef.current.push(controller);

            const config = {
                ...(auth ? { auth: { username: auth.Username, password: auth.password } } : {}),
                timeout: 5000,
                signal: controller.signal
            };

            let axiosCall;
            if (["GET", "DELETE"].includes(method)) {
                axiosCall = axios[method.toLowerCase()](url, config);
            } else if (["POST", "PUT", "PATCH"].includes(method)) {
                axiosCall = axios[method.toLowerCase()](url, payload, config);
            } else {
                return Promise.resolve({
                    services_name,
                    method,
                    api_url: url,
                    status_code: "UNSUPPORTED",
                    error: "Unsupported method",
                    duration_ms: 0,
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
                    status_code: err?.response?.status ?? "ERROR",
                    error: err?.response?.data?.message ||
                        err?.response?.data?.error ||
                        err?.code || err?.message || "Unknown error",
                    duration_ms: Date.now() - started,
                }));
        });

        Promise.all(calls)
            .then((rows) => {
                const indexedRows = rows.map((row, index) => ({
                    ...row,
                    globalIndex: index + 1
                }));
                setGlobalServicesData(indexedRows);
                setServicesData(indexedRows);
            })
            .catch((error) => {
                if (axios.isCancel(error)) return;
                console.error("Error in mapping data:", error);
                Swal.fire({
                    title: "Error!",
                    text: "Failed to check some API statuses",
                    icon: "warning",
                    confirmButtonText: "OK"
                });
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchdata();
        return () => {
            abortControllersRef.current.forEach(ctrl => ctrl.abort());
        };
    }, []);

    useEffect(() => {
        if (services.length > 0) {
            mapingdata();
        }
    }, [services]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-20 text-black">
                <Dashboard globalServicesData={globalServicesData} servicesData={servicesData} />
            </div>
        </Layout>
    );
};

export default HomePage;










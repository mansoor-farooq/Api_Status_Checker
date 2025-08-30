import { useEffect, useMemo, useRef, useState } from "react";
import Layout from "../component/Layout";
import Dashboard from "../component/RecentActivities";
import axios from "axios";
import Swal from "sweetalert2";
import { proxyRequest } from "../component/proxy";
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.239:7070';
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
            setServicesData(final);
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
    const [refreshCount, setRefreshCount] = useState(0);


    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 pt-20 text-black">
                <Dashboard globalServicesData={globalServicesData} servicesData={servicesData} />
            </div>
        </Layout>
    );
};

export default HomePage;










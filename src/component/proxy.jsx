import axios from "axios";

const API_BASE = "http://192.168.1.239:7070"; // tera backend

export const proxyRequest = async ({ url, method = "GET", payload = null, auth = null, headers = {} }) => {
    try {
        const res = await axios.post(`${API_BASE}/proxy`, {
            url,
            method,
            payload,
            auth,
            headers,
        });
        return res.data;
    } catch (err) {
        console.error("❌ Proxy Request Failed:", err.message);
        throw err;
    }
};

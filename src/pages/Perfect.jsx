import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import { MdRemoveRedEye } from "react-icons/md";
import { FaCalendarPlus } from "react-icons/fa";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { BiDesktop, BiMobile } from "react-icons/bi";
import { RiMotorbikeLine } from "react-icons/ri";
import moment from "moment";

const Perfect = () => {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); // Stores filtered results
    const [orderDetails, setOrderDetails] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [riders, setRiders] = useState([]); // Stores fetched riders
    const [error, setError] = useState("");
    const [riderSearchQuery, setRiderSearchQuery] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const totalOrders = filteredOrders.length;
    const totalPages = Math.ceil(totalOrders / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);



    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    const [selectedOrderId, setSelectedOrderId] = useState(null); // Track selected order ID
    const [selectedDisplayId, setSelectedDisplayId] = useState(null); // ✅ for Display ID



    const [assignMessage, setAssignMessage] = useState(""); // State for message
    const [verifiedStatus, setVerifiedStatus] = useState({}); // {orderId: "Yes" | "No"}








    const [searchFilters, setSearchFilters] = useState({
        id: "",
        name: "",
        phone: "",
        address: "",
        orderDate: "",
        status: "",
    });


    const [errorMessages, setErrorMessages] = useState({}); // State to hold error messages









    const distributorId = localStorage.getItem("record_id");
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        fetch(`http://202.143.125.148:9001/get-orders-distributor/${distributorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data) {
                    setOrders(data.data);
                    setFilteredOrders(data.data); // Initially, show all orders
                }
            })
            .catch((error) => console.error("Error fetching orders:", error));
    };

    const fetchRiders = () => {
        fetch(`http://202.143.125.148:9001/get-riders-by-distributor/${distributorId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.data) {
                    setRiders(data.data);
                    setError("");
                    setIsAssignModalOpen(true); // Open the modal when riders are fetched
                } else {
                    setError(data.message || "Failed to fetch riders");
                }
            })
            .catch((error) => {
                setError("Error fetching riders: " + error.message);
            });
    };


    const fetchOrderDetails = (orderId) => {
        fetch(`http://202.143.125.148:9001/get-orders-detail-by-distributor-id/${orderId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success && data.data.length > 0) {
                    setOrderDetails(data.data);
                    setIsModalOpen(true);
                }
            })
            .catch((error) => console.error("Error fetching order details:", error));
    };

    // Handle search by email
    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        setFilteredOrders(
            orders.filter(order => order.email?.toLowerCase().includes(query))
        );
    };

    const filteredRiders = riders
        .filter((rider) => rider.status) // Only include riders with status = true
        .filter((rider) =>
            rider.name?.toLowerCase().includes(riderSearchQuery.toLowerCase()) ||
            rider.phone?.includes(riderSearchQuery)
        );


    // Handle date range filter
    const handleDateFilter = () => {
        if (!startDate || !endDate) return;
        const start = moment(startDate).toISOString();
        const end = moment(endDate).toISOString();





        setFilteredOrders(
            orders.filter(order => {
                const orderDate = moment(order.created_at).format('YYYY-MM-DD')  // Parse the date
                return orderDate >= startDate && orderDate <= endDate;

            })

        );
    };


    const handleAssignRider = async (rider) => {
        console.log("Rider Object:", rider); // ✅ Log to verify the rider object structure

        if (!selectedOrderId) {
            setAssignMessage("No order selected.");
            return;
        }

        if (!rider || !rider.record_id) {
            setAssignMessage("Invalid rider. Cannot assign without rider record ID.");
            return;
        }

        // ✅ Find the selected order object using selectedOrderId
        const selectedOrder = orders.find((order) => order.id === selectedOrderId);

        if (!selectedOrder) {
            setAssignMessage("Order not found.");
            return;
        }

        // ✅ Get the display_id from the selected order
        const displayId = selectedOrder.display_id;

        const data = {
            rider_id: rider.record_id,   // Rider record ID
            order_id: selectedOrderId,   // Order ID
            display_id: displayId        // ✅ Include display_id
        };

        try {
            const response = await fetch("http://202.143.125.148:9001/assign-order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setAssignMessage(`Rider assigned successfully to Order #${displayId}!`);

                setTimeout(() => {
                    setIsAssignModalOpen(false);      // Close modal
                    setRiderSearchQuery("");          // Clear search
                    setAssignMessage("");             // Reset message
                    fetchOrders();                    // Refresh order list
                }, 2000);
            } else {
                const errorData = await response.json();
                console.error("Error assigning rider:", errorData);
                setAssignMessage(`Failed to assign rider: ${errorData.message}`);
            }
        } catch (error) {
            console.error("Error:", error);
            setAssignMessage("An error occurred while assigning the rider.");
        }
    };








    useEffect(() => {
        let filtered = orders.filter((order) => {
            const orderFirstName = (order.shipping_first_name || order.first_name || "").toLowerCase();
            const searchName = searchFilters.name.toLowerCase();

            return (
                (searchFilters.id === "" || String(order.email || "").includes(searchFilters.id)) &&
                (searchFilters.name === "" || orderFirstName.includes(searchName)) &&
                (searchFilters.phone === "" || String(order.shipping_phone || order.phone || "").includes(searchFilters.phone)) &&
                (searchFilters.address === "" || (order.shipping_address || "").toLowerCase().includes(searchFilters.address.toLowerCase())) &&
                (searchFilters.orderDate === "" || new Date(order.created_at).toLocaleDateString().includes(searchFilters.orderDate)) &&
                (searchFilters.status === "" || (order.metadata.status || "").toLowerCase().includes(searchFilters.status.toLowerCase()))
            );
        });

        setFilteredOrders(filtered);
    }, [searchFilters, orders]);



    const handleColumnSearch = (e, column) => {
        setSearchFilters({ ...searchFilters, [column]: e.target.value });
    };


    const handleDeliveredQtyChange = (index, newDeliveredQty) => {
        if (newDeliveredQty < 1) {
            setErrorMessages((prev) => ({
                ...prev,
                [index]: "Delivered quantity must be at least 1.",
            }));
            return;
        }

        setOrderDetails((prevDetails) => {
            return prevDetails.map((product, idx) => {
                if (idx === index) {
                    const orderQty = product.quantity || 0;
                    const balanceQty = orderQty - newDeliveredQty;

                    return {
                        ...product,
                        deliveredQuantity: newDeliveredQty,
                        balanceQuantity: balanceQty < 0 ? 0 : balanceQty, // Prevent negative balance
                    };
                }
                return product;
            });
        });

        // Validation: Check if delivered quantity exceeds order quantity
        const orderQty = orderDetails[index].quantity || 0;
        if (newDeliveredQty > orderQty) {
            setErrorMessages((prev) => ({
                ...prev,
                [index]: `Delivered quantity cannot exceed order quantity of ${orderQty}.`,
            }));
        } else {
            setErrorMessages((prev) => ({
                ...prev,
                [index]: "",
            }));
        }
    };


    const handleVerifyClick = async (orderId, distributorId, currentStatus) => {
        const newStatus = currentStatus === true ? false : true;
        const action = newStatus ? "verify (Yes)" : "unverify (No)";
        const confirmed = window.confirm(`Do you want to mark this as ${action}?`);

        if (confirmed) {
            try {
                const response = await fetch(`http://202.143.125.148:9001/order-verify-by-tsm/${orderId}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer ${token}", // Replace this
                    },
                    body: JSON.stringify({
                        verify_by_tsm: newStatus,
                        verified_by: distributorId,
                    }),
                });

                if (response.ok) {
                    setVerifiedStatus((prev) => ({
                        ...prev,
                        [orderId]: newStatus ? "Yes" : "No",
                    }));
                    fetchOrders();
                    alert(`Order successfully marked as ${newStatus ? "Yes" : "No"}`);
                } else {
                    throw new Error("Verification failed.");
                }
            } catch (error) {
                console.error("Error verifying order:", error);
                alert("Something went wrong.");
            }
        }
    };




    const handlePrint = async () => {
        const input = document.getElementById('order-details-table'); // Target the div/table you want to print
        if (input) {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            window.open(pdf.output('bloburl'), '_blank');
        }
    };
    return (
        <Layout>
            <div className="p-0  bg-white">
                {/* Header */}
                <div className="mb-4">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Orders </h2>

                    <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-2 flex-1">
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-2 border rounded" />
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-2 border rounded" />
                            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleDateFilter}>
                                Apply Date Filter
                            </button>
                        </div>
                        {/* <input type="text" placeholder="Search by Email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="p-2 border rounded w-full sm:w-1/3" /> */}
                    </div>
                </div>
                {/* Orders Table */}
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <table className="w-full border-collapse table-fixed">
                        <thead className="bg-gray-200 text-sm">
                            <tr className="h-[2rem]">
                                <th className="w-[5%] text-center">
                                    <input type="text" placeholder="Order ID" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "id")} />
                                </th>
                                <th className="w-[11%] text-left">
                                    <input type="text" placeholder="Name" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "name")} />
                                </th>
                                <th className="w-[8%] text-left">
                                    <input type="text" placeholder="Phone" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "phone")} />
                                </th>
                                <th className="w-[23%] text-left">
                                    <input type="text" placeholder="Address" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "address")} />
                                </th>

                                <th className="w-[12%] text-left">
                                    <input type="text" placeholder="Nearest Landmark" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "nearest_landmark")} />
                                </th>
                                <th className="w-[10%] text-center">
                                    <input type="text" placeholder="Date" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "orderDate")} />
                                </th>
                                <th className="w-[7%] text-left">
                                    <input type="text" placeholder="Status" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "status")} />
                                </th>
                                <th className="w-[10%] text-left">
                                    <input type="text" placeholder="Aging" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "aging")} />
                                </th>
                                <th className="w-[9%] text-left">
                                    <input type="text" placeholder="Rider Name" className="p-1 border rounded w-full" onChange={(e) => handleColumnSearch(e, "riderName")} />
                                </th>
                                <th className="w-[6%] text-left">Verified</th>

                                <th className="w-[10%] text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order, index) => {
                                    const createdAt = new Date(order.created_at);
                                    const now = new Date();
                                    const diffMs = now - createdAt;

                                    const agingDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
                                    const agingHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                                    const agingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

                                    const status = verifiedStatus[order.id];

                                    return (
                                        <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 h-[3rem] text-sm">
                                            <td className="text-center">{order.display_id || "N/A"}</td>
                                            <td className="text-left truncate">{`${order.shipping_first_name || order.first_name || "N/A"}`}</td>
                                            <td className="text-left truncate">{order.shipping_phone || order.phone || "N/A"}</td>
                                            <td className="text-left truncate">{order.shipping_address || "N/A"}</td>
                                            <td className="text-left truncate">{order.nearest_landmark || "N/A"}</td>

                                            <td className="text-left">{new Date(order.created_at).toLocaleString()}</td>
                                            <td
                                                className={`text-left font-semibold uppercase ${order.status?.toLowerCase() === "completed"
                                                    ? "text-green-600"
                                                    : order.status?.toLowerCase() === "pending"
                                                        ? "text-red-600"
                                                        : "text-gray-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </td>
                                            {/* ⏱️ Updated Aging Display */}
                                            <td className="text-left">{`${agingMinutes} mins, ${agingHours} hrs, ${agingDays} days`}</td>

                                            <td
                                                className={`text-left truncate font-medium uppercase ${!order.rider_name ? "text-red-600" : "text-gray-800"
                                                    }`}
                                            >
                                                {order.rider_name || "Unassigned"}
                                            </td>

                                            <td className="text-center">
                                                <button
                                                    onClick={() =>
                                                        handleVerifyClick(
                                                            order.id,
                                                            order.metadata?.distributor_id,
                                                            order.metadata?.verify_by_tsm
                                                        )
                                                    }
                                                    className={`px-2 py-1 text-xs rounded font-medium ${order.metadata?.verify_by_tsm === true
                                                        ? "bg-green-100 text-green-700"
                                                        : order.metadata?.verify_by_tsm === false
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-blue-100 text-blue-700"
                                                        }`}
                                                >
                                                    {order.metadata?.verify_by_tsm === true
                                                        ? "Yes"
                                                        : order.metadata?.verify_by_tsm === false
                                                            ? "No"
                                                            : "Verify"}
                                                </button>
                                            </td>

                                            <td className="flex justify-center items-center gap-2">
                                                <button onClick={() => fetchOrderDetails(order.id)} className="w-8 h-8 flex items-center justify-center">
                                                    <MdRemoveRedEye size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (order.status?.toLowerCase() === "completed") {
                                                            alert("This order has already been delivered.");
                                                        } else {
                                                            fetchRiders();
                                                            setSelectedOrderId(order.id);
                                                            setSelectedDisplayId(order.display_id); // ✅ Set display ID

                                                        }
                                                    }}
                                                    className="w-8 h-8 flex items-center justify-center"
                                                >
                                                    <FaCalendarPlus size={18} />
                                                </button>

                                            </td>
                                        </tr>
                                    );
                                })

                            ) : (
                                <tr>
                                    <td colSpan="10" className="p-4 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>




                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                            <button key={pageNumber} onClick={() => setCurrentPage(pageNumber)} className={`px-3 py-1 mx-1 rounded ${currentPage === pageNumber ? "bg-blue-600 text-white" : "bg-gray-300 text-black hover:bg-gray-400"}`}>
                                {pageNumber}
                            </button>
                        ))}
                    </div>
                )}
            </div>




            {/* Order Details Modal */}
            {isModalOpen && orderDetails.length > 0 && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-4/5 h-3/4">
                        <h3 className="text-lg font-bold mb-8">Order Details</h3>

                        {/* Scrollable Table with id="order-details-table" */}
                        <div className="overflow-y-auto h-3/4" id="order-details-table">
                            <table className="w-full border-collapse border border-gray-300">
                                <thead className="bg-gray-200">
                                    <tr>
                                        <th className="border p-2">Image</th>
                                        <th className="border p-2">Product Name</th>
                                        <th className="border p-2">Order Qty</th>
                                        {/* <th className="border p-2">Delivered Qty</th> */}
                                        {/* <th className="border p-2">Balance Qty</th> */}
                                        <th className="border p-2">Price</th>
                                        {/* <th className="border p-2">Tax 18% GST</th> */}
                                        <th className="border p-2">Sub Total</th>
                                        {/* <th className="border p-2">Reason</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.map((product, index) => {
                                        const updatedThumbnail = product.thumbnail?.replace(
                                            "http://localhost:9000/static/",
                                            "http://202.143.125.148:9000/static/"
                                        );

                                        const reasons = ["Reason 1", "Reason 2", "Reason 3", "Reason 4", "Other"];

                                        return (
                                            <tr key={index} className="border">
                                                <td className="border p-2">
                                                    {updatedThumbnail ? (
                                                        <img
                                                            src={updatedThumbnail}
                                                            alt={product.product_title}
                                                            className="h-16 w-16 object-cover rounded"
                                                        />
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td className="border p-2">{product.product_title}</td>
                                                <td className="border p-2">{product.quantity || "N/A"}</td>

                                                <td className="border p-2">
                                                    {product.unit_price
                                                        ? (((product.deliveredQuantity ?? 1) * product.unit_price) * 1.18).toFixed(2)
                                                        : "N/A"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Total */}
                            <div className="mt-4 flex justify-end pr-6 text-lg font-bold">
                                Total:{" "}
                                {orderDetails.reduce((total, product) => {
                                    const subtotal = product.unit_price
                                        ? (((product.deliveredQuantity ?? 1) * product.unit_price) * 1.18)
                                        : 0;
                                    return total + subtotal;
                                }, 0).toFixed(2)}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex justify-end gap-4">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Close
                            </button>

                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={handlePrint}
                            >
                                Print
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Assign Rider Modal */}
            {isAssignModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-3xl animate-scaleIn">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Assign Rider</h3>

                        {selectedOrderId && (
                            <p className="mb-1 text-sm text-gray-500">
                                {/* Selected Order ID: <span className="font-semibold">{selectedOrderId}</span> */}
                            </p>
                        )}

                        {selectedDisplayId && (
                            <p className="mb-4 text-sm text-gray-600">
                                Order ID: <span className="font-semibold text-gray-800">{selectedDisplayId}</span>
                            </p>
                        )}

                        <input
                            type="text"
                            placeholder="🔍 Search by Rider Name or Phone..."
                            value={riderSearchQuery}
                            onChange={(e) => setRiderSearchQuery(e.target.value)}
                            className="border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none p-3 rounded-lg w-full mb-6 transition"
                        />

                        {filteredRiders.length > 0 ? (
                            <ul className="divide-y divide-gray-200">
                                {filteredRiders.slice(0, 4).map((rider, index) => (
                                    <li
                                        key={index}
                                        className="p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 rounded-md mb-2 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="bg-blue-100 text-blue-600 font-bold rounded-full h-10 w-10 flex items-center justify-center shadow-sm">
                                                {rider.name?.charAt(0) || "R"}
                                            </div>
                                            <div>
                                                <h4 className="text-md font-semibold text-gray-800">{rider.name || "Unnamed Rider"}</h4>
                                                <p className="text-sm text-gray-500">{rider.phone || "No Phone"}</p>
                                            </div>
                                        </div>
                                        <button
                                            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 shadow transition"
                                            onClick={() => handleAssignRider(rider)}
                                        >
                                            Assign
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-center text-gray-500">No riders available</p>
                        )}
                        {assignMessage && (
                            <p className="mt-4 text-sm font-semibold text-blue-600 text-center">{assignMessage}</p>
                        )}
                        <div className="flex justify-end mt-6">
                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition"
                                onClick={() => {
                                    setIsAssignModalOpen(false);
                                    setRiderSearchQuery("");
                                    setAssignMessage("");
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Perfect;
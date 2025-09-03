import React, { useState } from "react";
import { Mail, User, Phone, MessageSquare } from "lucide-react";

const Contactus = () => {

    const [state, setstate] = useState({
        name: "",
        email: "",
        phone: 0,
        message: ""
    });


    function handleSubmit(e) {

    }

    return (
        <div className="min-h-screen flex text-black items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 p-6">
            <div className="w-full max-w-4xl bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-black drop-shadow-sm">Contact Us</h1>
                    <p className="text-black mt-2 text-lg">
                        We’d love to hear from you! Fill out the form below and we’ll get in touch.
                    </p>
                </div>

                {/* Form */}
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                            required
                            type="text"
                            placeholder="Your Name"
                            onChange={(e) => setstate({ ...state, name: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                            required
                            type="email"
                            onChange={(e) => setstate({ ...state, email: e.target.value })}
                            placeholder="Your Email"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white"
                        />
                    </div>

                    {/* Phone */}
                    {/* Phone */}
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black w-5 h-5" />
                        <input
                            type="tel"
                            placeholder="03xxxxxxxxx"
                            maxLength={11}
                            pattern="[0-9]*"
                            required
                            inputMode="numeric"
                            onChange={(e) => setstate({ ...state, phone: e.target.value })}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white"
                        />
                    </div>


                    {/* Message */}
                    <div className="relative md:col-span-2">
                        <MessageSquare className="absolute left-3 top-5 text-black w-5 h-5" />
                        <textarea
                            required
                            rows="5"
                            onChange={(e) => setstate({ ...state, message: e.target.value })}
                            placeholder="Your Message..."
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white resize-none"
                        ></textarea>
                    </div>

                    {/* Button */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-black to-black text-white font-semibold py-3 rounded-xl shadow-md hover:from-gray-900 hover:to-gray-600 transition transform hover:scale-[1.02]"
                            onClick={handleSubmit}
                        >
                            Send Message
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Contactus;

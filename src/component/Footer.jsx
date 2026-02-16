// Footer.js
import React from 'react';
const Footer = () => {
    return (
        <footer className="w-full bg-white text-white py-4 shadow-2xs shadow-gray-600 border-t border-gray-200 ">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="  pt-4 text-center text-gray-800     animate-fadeInUp delay-300  ">
                    <p className="text-sm">
                        © {new Date().getFullYear()} InfoTech Solutions. All rights reserved.
                    </p>
                    
                </div>
            </div>
        </footer>
    );
};
export default Footer;
import logo from '../images/real.png';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    Disclosure,
    Popover,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react';
import toast, { Toaster } from "react-hot-toast";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { LogOut, Settings, User, Bell, HelpCircle } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa';

const YoungBazerService = [
    { name: 'Services Status', description: 'Services Status', href: '/services_status', icon: null },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const userData = JSON.parse(localStorage.getItem('User_Data'));

    // Detect scroll for header styling
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Logout",
            cancelButtonText: "Cancel",
            reverseButtons: true,
            width: "22rem",
            customClass: {
                popup: "rounded-xl shadow-lg p-4",
                title: "text-lg font-semibold text-gray-800",
                htmlContainer: "text-sm text-gray-600",
                confirmButton:
                    "bg-red-500 text-white px-4 py-1.5 rounded-md text-sm hover:bg-red-600 focus:outline-none",
                cancelButton:
                    "bg-gray-200 text-gray-700 px-4 py-1.5 rounded-md text-sm hover:bg-gray-300 focus:outline-none",
            },
            buttonsStyling: false,
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("User_Data");
                localStorage.removeItem("isLoggedIn");

                Swal.fire({
                    icon: "success",
                    title: "Logged out",
                    text: "See you soon 👋",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 1800,
                    timerProgressBar: true,
                    customClass: {
                        popup: "rounded-lg shadow-md text-sm",
                    },
                });

                navigate("/login");
            }
        });
    };

    const renderDropdown = (label, data) => (
        <Popover className="relative">
            {({ open }) => (
                <div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <PopoverButton className="flex items-center text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors gap-x-1">
                            {label}
                            <motion.div
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDownIcon className="h-4 w-4" />
                            </motion.div>
                        </PopoverButton>
                    </motion.div>

                    <AnimatePresence>
                        {open && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="absolute z-20 left-1/2 -translate-x-1/2 mt-3 w-64"
                            >
                                <PopoverPanel static>
                                    <div className="rounded-xl shadow-xl ring-1 ring-black/5 bg-white backdrop-blur-md bg-opacity-95 border border-gray-100">
                                        <ul className="divide-y divide-gray-100">
                                            {data.map((item) => (
                                                <li key={item.name}>
                                                    <a
                                                        href={item.href}
                                                        className="block p-4 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-all duration-150 hover:bg-gray-50 rounded-lg"
                                                    >
                                                        {item.name}
                                                        <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </PopoverPanel>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </Popover>
    );

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm shadow-md'}`}>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-3">
                    <div className="flex-1 flex items-center lg:justify-start">
                        <a href="/" className="flex items-center">
                            {/* <img src={logo} alt="Logo" className="h-10 w-auto" /> */}
                            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-[length:200%_200%] bg-clip-text text-transparent animate-[gradient_3s_linear_infinite]"> API WIKIPEDIA </span>
                        </a>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-8">
                        <a
                            href="/"
                            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-indigo-600' : 'text-gray-700 hover:text-indigo-600'}`}
                        >
                            Home
                        </a>
                        {renderDropdown('Services Health', YoungBazerService)}

                        {userData ? (
                            <div className="flex items-center space-x-4">
                                <Popover className="relative">
                                    {({ open }) => (
                                        <>
                                            <PopoverButton className="flex items-center space-x-2 p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                                                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                            </PopoverButton>

                                            <PopoverPanel className="absolute right-0 z-30 mt-2 w-72 bg-white rounded-2xl shadow-xl ring-1 ring-black/5 overflow-hidden border border-gray-100">
                                                {/* Profile Section */}
                                                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                                                    <div className="h-12 w-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                                        {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                                                        <p className="text-xs text-gray-600">{userData.email}</p>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-2 space-y-1">

                                                    <div className="border-t border-gray-100 my-1"></div>

                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Logout
                                                    </button>
                                                </div>
                                            </PopoverPanel>
                                        </>
                                    )}
                                </Popover>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <a
                                    href="/login"
                                    className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    Sign in
                                </a>
                                <a
                                    href="/register"
                                    className="text-sm font-medium bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    Get started
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-gray-700 focus:outline-none"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </motion.button>
                    </div>
                </nav>
            </div>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <Dialog
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        className="relative z-50 lg:hidden"
                    >
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                            aria-hidden="true"
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <div className="fixed inset-y-0 right-0 flex max-w-xs w-full">
                            <motion.div
                                className="bg-white p-6 w-full h-full overflow-y-auto"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'tween', ease: 'easeInOut' }}
                            >
                                {/* Menu Header */}
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center">
                                        <img src={logo} alt="Logo" className="h-8 w-auto" />
                                        <span className="ml-2 text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dashboard</span>
                                    </div>
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </motion.button>
                                </div>

                                {/* Navigation links */}
                                <div className="space-y-6">
                                    <div className="space-y-1">
                                        <a
                                            href="/"
                                            className={`block py-2 px-3 text-base font-medium rounded-lg ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'}`}
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            Home
                                        </a>

                                        <Disclosure>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full py-2 px-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                                                        Services Health
                                                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pl-4 space-y-1">
                                                        {YoungBazerService.map(item => (
                                                            <a
                                                                key={item.name}
                                                                href={item.href}
                                                                className="block py-2 px-3 text-sm font-normal text-gray-600 hover:text-indigo-600 hover:bg-gray-50 rounded-lg"
                                                                onClick={() => setMobileMenuOpen(false)}
                                                            >
                                                                {item.name}
                                                            </a>
                                                        ))}
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    </div>

                                    {userData ? (
                                        <div className="pt-6 border-t border-gray-200">
                                            <div className="flex items-center gap-3 px-3 pb-4">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 flex items-center justify-center text-white font-medium">
                                                    {userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                                                    <p className="text-xs text-gray-600">{userData.email}</p>
                                                </div>
                                            </div>

                                            <div className="space-y-1">


                                                <button
                                                    onClick={() => {
                                                        setMobileMenuOpen(false);
                                                        handleLogout();
                                                    }}
                                                    className="flex items-center gap-2 w-full py-2 px-3 text-sm text-red-600 rounded-lg hover:bg-red-50"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="pt-6 border-t border-gray-200 space-y-3">
                                            <a
                                                href="/login"
                                                className="block w-full py-2.5 text-center text-sm font-medium text-gray-700 hover:text-indigo-600"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Sign in
                                            </a>
                                            <a
                                                href="/register"
                                                className="block w-full py-2.5 text-center text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm"
                                                onClick={() => setMobileMenuOpen(false)}
                                            >
                                                Get started
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    </Dialog>
                )}
            </AnimatePresence>
        </header>
    );
};

export default Header;


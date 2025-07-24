// import logo from '../images/real.png';
// import { useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//     Dialog,
//     Disclosure,
//     Popover,
//     PopoverButton,
//     PopoverPanel,
// } from '@headlessui/react';
// import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
// import { ChevronDownIcon } from '@heroicons/react/20/solid';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// // Dropdown data
// const services = [
//     { name: 'SAP Api Services', description: 'Api Services checking ', href: '/sapservices', icon: null },
//     { name: 'SAP Service ', description: 'Fast service 2', href: '/statusgrid', icon: null },
// ];
// const dynamicServices = [
//     { name: 'YoungBazer Backend', description: 'YoungBazer Backend', href: '/youngBazer', icon: null },
//     { name: 'Dynamic 2', description: 'Dynamic desc 2', href: '#', icon: null },
// ];
// const sscpServices = [
//     { name: 'SSCP 1', description: 'SSCP desc 1', href: '#', icon: null },
//     { name: 'SSCP 2', description: 'SSCP desc 2', href: '#', icon: null },
// ];
// const Header = () => {
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//     const navigate = useNavigate();

//     const userData = JSON.parse(localStorage.getItem('User_Data'));

//     const handleLogout = () => {
//         Swal.fire({
//             title: 'Are you sure?',
//             text: "You will be logged out.",
//             icon: 'warning',
//             showCancelButton: true,
//             confirmButtonText: 'Yes, logout',
//             cancelButtonText: 'Cancel',
//         }).then((result) => {
//             if (result.isConfirmed) {
//                 localStorage.removeItem('User_Data');
//                 Swal.fire('Logged Out!', 'You have successfully logged out.', 'success');
//                 navigate('/login');
//             }
//         });
//     };
//     const renderDropdown = (label, data) => (
//         <Popover className="relative">
//             {({ open }) => (
//                 <>
//                     <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
//                         <PopoverButton className="flex items-center text-sm font-semibold text-black gap-x-1">
//                             {label}
//                             <motion.div
//                                 animate={{ rotate: open ? 180 : 0 }}
//                                 transition={{ duration: 0.2 }}
//                             >
//                                 <ChevronDownIcon className="h-5 w-5 text-black" />
//                             </motion.div>
//                         </PopoverButton>
//                     </motion.div>

//                     <AnimatePresence>
//                         {open && (
//                             <motion.div
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 exit={{ opacity: 0, y: -10 }}
//                                 transition={{ duration: 0.2 }}
//                                 className="absolute z-20 left-1/2 -translate-x-1/2 mt-3 w-64"
//                             >
//                                 <PopoverPanel static>
//                                     <div className="rounded-xl shadow-xl ring-1 ring-black/5 bg-white backdrop-blur-md bg-opacity-90">
//                                         <ul className="divide-y divide-gray-100">
//                                             {data.map((item) => (
//                                                 <li key={item.name}>
//                                                     <a
//                                                         href={item.href}
//                                                         className="block p-4 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-all duration-150"
//                                                     >
//                                                         {item.name}
//                                                         <p className="text-xs text-gray-500">{item.description}</p>
//                                                     </a>
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </PopoverPanel>
//                             </motion.div>
//                         )}
//                     </AnimatePresence>
//                 </>
//             )}
//         </Popover>
//     );
//     return (
//         <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur shadow-md">
//             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//                 <nav className="flex items-center justify-between py-2">
//                     <div className="flex-1 flex items-center lg:justify-start">
//                         <a href="/">
//                             <img src={logo} alt="Logo" className="h-10 w-auto" />
//                         </a>
//                     </div>
//                     {/* Mobile menu button */}
//                     <div className="lg:hidden ">
//                         <motion.button
//                             whileTap={{ scale: 0.9 }}
//                             onClick={() => setMobileMenuOpen(true)}
//                             className="p-2 text-black focus:outline-none"
//                         >
//                             <Bars3Icon className="h-6 w-6" />
//                         </motion.button>
//                     </div>
//                     {/* Desktop navigation */}
//                     <div className="hidden lg:flex lg:items-center lg:space-x-6">
//                         <a
//                             href="/"
//                             className="text-sm font-semibold text-black hover:scale-105 transition"
//                         >
//                             Home
//                         </a>
//                         {renderDropdown('Services', services)}
//                         {renderDropdown('Dynamic', dynamicServices)}
//                         {renderDropdown('SSCP', sscpServices)}
//                         {userData ? (
//                             <Popover className="relative">
//                                 {({ open }) => (
//                                     <>
//                                         <PopoverButton className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
//                                             <span className="text-sm font-semibold text-black">
//                                                 {userData.name}
//                                             </span>
//                                             <ChevronDownIcon className="h-4 w-4 text-black" />
//                                         </PopoverButton>
//                                         <PopoverPanel className="absolute right-0 z-30 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
//                                             <div className="p-4 border-b">
//                                                 <p className="text-sm font-medium text-gray-900">{userData.name}</p>
//                                                 <p className="text-sm text-gray-600">{userData.email}</p>
//                                             </div>
//                                             <button
//                                                 onClick={handleLogout}
//                                                 className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
//                                             >
//                                                 Logout
//                                             </button>
//                                         </PopoverPanel>
//                                     </>
//                                 )}
//                             </Popover>
//                         ) : (
//                             <a
//                                 href="/login"
//                                 className="text-sm font-semibold text-black px-3 py-1 rounded-md hover:scale-105 transition"
//                             >
//                                 Login
//                             </a>
//                         )}
//                     </div>
//                 </nav>
//             </div>
//             {/* mobile menu  */}
//             <AnimatePresence>
//                 {mobileMenuOpen && (
//                     <Dialog
//                         open={mobileMenuOpen}
//                         onClose={() => setMobileMenuOpen(false)}
//                         className="relative z-50 lg:hidden"
//                     >
//                         <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />

//                         <div className="fixed inset-y-0 right-0 flex max-w-xs w-full">
//                             <motion.div
//                                 className="bg-white p-6 w-full h-full"
//                                 initial={{ x: '100%' }}
//                                 animate={{ x: 0 }}
//                                 exit={{ x: '100%' }}
//                             >
//                                 {/* Menu Header */}
//                                 <div className="flex justify-between items-center mb-6">
//                                     <img src={logo} alt="Logo" className="h-8 w-auto" />
//                                     <motion.button
//                                         whileTap={{ scale: 0.95 }}
//                                         onClick={() => setMobileMenuOpen(false)}
//                                         className="text-black focus:outline-none"
//                                     >
//                                         <XMarkIcon className="h-6 w-6" />
//                                     </motion.button>
//                                 </div>


//                                 {/* Navigation links */}
//                                 <div className="space-y-3">
//                                     <a href="/" className="block text-sm font-semibold text-black hover:text-indigo-600 transition-all duration-150">Home</a>

//                                     {[
//                                         ['Services', services],
//                                         ['Dynamic', dynamicServices],
//                                         ['SSCP', sscpServices],
//                                     ].map(([label, data]) => (
//                                         <Disclosure key={label}>
//                                             {({ open }) => (
//                                                 <>
//                                                     <Disclosure.Button className="flex justify-between w-full py-2 text-sm font-semibold text-black">
//                                                         {label}
//                                                         <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
//                                                     </Disclosure.Button>
//                                                     <Disclosure.Panel className="pl-4 space-y-1">
//                                                         {data.map(item => (
//                                                             <a
//                                                                 key={item.name}
//                                                                 href={item.href}
//                                                                 className="block py-1 text-sm font-normal text-black"
//                                                             >
//                                                                 {item.name}
//                                                             </a>
//                                                         ))}
//                                                     </Disclosure.Panel>
//                                                 </>
//                                             )}
//                                         </Disclosure>
//                                     ))}

//                                     {userData ? (
//                                         <Popover className="relative">
//                                             {({ open }) => (
//                                                 <>
//                                                     <PopoverButton className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
//                                                         <span className="text-sm font-semibold text-black">
//                                                             {userData.name}
//                                                         </span>
//                                                         <ChevronDownIcon className="h-4 w-4 text-black" />
//                                                     </PopoverButton>
//                                                     <PopoverPanel className="absolute right-0 z-30 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
//                                                         <div className="p-4 border-b">
//                                                             <p className="text-sm font-medium text-gray-900">{userData.name}</p>
//                                                             <p className="text-sm text-gray-600">{userData.email}</p>
//                                                         </div>
//                                                         <button
//                                                             onClick={handleLogout}
//                                                             className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
//                                                         >
//                                                             Logout
//                                                         </button>
//                                                     </PopoverPanel>
//                                                 </>
//                                             )}
//                                         </Popover>
//                                     ) : (
//                                         <a
//                                             href="/login"
//                                             className="text-sm font-semibold text-black px-3 py-1 rounded-md hover:scale-105 transition"
//                                         >
//                                             Login
//                                         </a>
//                                     )}


//                                 </div>
//                             </motion.div>
//                         </div>
//                     </Dialog>
//                 )}
//             </AnimatePresence>
//         </header>
//     );
// };
// export default Header;

import logo from '../images/real.png';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Dialog,
    Disclosure,
    Popover,
    PopoverButton,
    PopoverPanel,
} from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

// Dropdown data
const services = [
    { name: 'SAP Api Services', description: 'Api Services checking ', href: '/sapservices', icon: null },
    { name: 'SAP Service ', description: 'Fast service 2', href: '/statusgrid', icon: null },
];

const YoungBazerService = [
    { name: 'YoungBazer Backend', description: 'YoungBazer Backend', href: '/youngBazer', icon: null },
    { name: 'YoungBazer Frontend', description: 'YoungBazer Frontend services', href: '/fruntend_youngbazer', icon: null },
];

const sscpServices = [
    { name: 'SSCP 1', description: 'SSCP desc 1', href: '#', icon: null },
    { name: 'SSCP 2', description: 'SSCP desc 2', href: '#', icon: null },
];

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('User_Data'));



    const handleLogout = () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be logged out.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('User_Data');
                Swal.fire('Logged Out!', 'You have successfully logged out.', 'success');
                navigate('/login');
            }
        });
    };

    const renderDropdown = (label, data) => (
        <Popover className="relative">
            {({ open }) => (
                <div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <PopoverButton className="flex items-center text-sm font-semibold text-black gap-x-1">
                            {label}
                            <motion.div
                                animate={{ rotate: open ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDownIcon className="h-5 w-5 text-black" />
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
                                    <div className="rounded-xl shadow-xl ring-1 ring-black/5 bg-white backdrop-blur-md bg-opacity-90">
                                        <ul className="divide-y divide-gray-100">
                                            {data.map((item) => (
                                                <li key={item.name}>
                                                    <a
                                                        href={item.href}
                                                        className="block p-4 text-sm font-medium text-gray-800 hover:text-indigo-600 transition-all duration-150"
                                                    >
                                                        {item.name}
                                                        <p className="text-xs text-gray-500">{item.description}</p>
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
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <nav className="flex items-center justify-between py-2">
                    <div className="flex-1 flex items-center lg:justify-start">
                        <a href="/">
                            <img src={logo} alt="Logo" className="h-10 w-auto" />
                        </a>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden ">
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setMobileMenuOpen(true)}
                            className="p-2 text-black focus:outline-none"
                        >
                            <Bars3Icon className="h-6 w-6" />
                        </motion.button>
                    </div>

                    {/* Desktop navigation */}
                    <div className="hidden lg:flex lg:items-center lg:space-x-6">
                        <a
                            href="/"
                            className="text-sm font-semibold text-black hover:scale-105 transition"
                        >
                            Home
                        </a>
                        {renderDropdown('Services', services)}
                        {renderDropdown('Dynamic', YoungBazerService)}
                        {renderDropdown('SSCP', sscpServices)}

                        {userData ? (
                            <Popover className="relative">
                                {({ open }) => (
                                    <>
                                        <PopoverButton className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
                                            <span className="text-sm font-semibold text-black">
                                                {userData.name}
                                            </span>
                                            <ChevronDownIcon className="h-4 w-4 text-black" />
                                        </PopoverButton>
                                        <PopoverPanel className="absolute right-0 z-30 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                                            <div className="p-4 border-b">
                                                <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                                                <p className="text-sm text-gray-600">{userData.email}</p>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                            >
                                                Logout
                                            </button>
                                        </PopoverPanel>
                                    </>
                                )}
                            </Popover>
                        ) : (
                            <a
                                href="/login"
                                className="text-sm font-semibold text-black px-3 py-1 rounded-md hover:scale-105 transition"
                            >
                                Login
                            </a>
                        )}


                    </div>
                </nav>
            </div>
            {/* mobile menu  */}


            <AnimatePresence>
                {mobileMenuOpen && (
                    <Dialog
                        open={mobileMenuOpen}
                        onClose={() => setMobileMenuOpen(false)}
                        className="relative z-50 lg:hidden"
                    >
                        <div className="fixed inset-0 bg-black/50" aria-hidden="true" onClick={() => setMobileMenuOpen(false)} />

                        <div className="fixed inset-y-0 right-0 flex max-w-xs w-full">
                            <motion.div
                                className="bg-white p-6 w-full h-full"
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                            >
                                {/* Menu Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <img src={logo} alt="Logo" className="h-8 w-auto" />
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-black focus:outline-none"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </motion.button>
                                </div>


                                {/* Navigation links */}
                                <div className="space-y-3">
                                    <a href="/" className="block text-sm font-semibold text-black hover:text-indigo-600 transition-all duration-150">Home</a>

                                    {[
                                        ['Services', services],
                                        ['Dynamic', YoungBazerService],
                                        ['SSCP', sscpServices],
                                    ].map(([label, data]) => (
                                        <Disclosure key={label}>
                                            {({ open }) => (
                                                <>
                                                    <Disclosure.Button className="flex justify-between w-full py-2 text-sm font-semibold text-black">
                                                        {label}
                                                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${open ? 'rotate-180' : ''}`} />
                                                    </Disclosure.Button>
                                                    <Disclosure.Panel className="pl-4 space-y-1">
                                                        {data.map(item => (
                                                            <a

                                                                key={item.name} // 
                                                                href={item.href}
                                                                className="block py-1 text-sm font-normal text-black"
                                                            >
                                                                {item.name}
                                                            </a>
                                                        ))}
                                                    </Disclosure.Panel>
                                                </>
                                            )}
                                        </Disclosure>
                                    ))}

                                    {userData ? (
                                        <Popover className="relative">
                                            {({ open }) => (
                                                <>
                                                    <PopoverButton className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100">
                                                        <span className="text-sm font-semibold text-black">
                                                            {userData.name}
                                                        </span>
                                                        <ChevronDownIcon className="h-4 w-4 text-black" />
                                                    </PopoverButton>
                                                    <PopoverPanel className="absolute right-0 z-30 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black/5">
                                                        <div className="p-4 border-b">
                                                            <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                                                            <p className="text-sm text-gray-600">{userData.email}</p>
                                                        </div>
                                                        <button
                                                            onClick={handleLogout}
                                                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                                                        >
                                                            Logout
                                                        </button>
                                                    </PopoverPanel>
                                                </>
                                            )}
                                        </Popover>
                                    ) : (
                                        <a
                                            href="/login"
                                            className="text-sm font-semibold text-black px-3 py-1 rounded-md hover:scale-105 transition"
                                        >
                                            Login
                                        </a>
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




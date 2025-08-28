// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import PrivateRoutes from '../routes/Private_route';

// const Login = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     // const [rememberMe, setRememberMe] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const navigate = useNavigate();

//     const dumyatanpt = [{
//         id: 1001,
//         name: "Admin",
//         email: "admin@gmail.com",
//         password: "Admin@123"
//     },
//     {
//         id: 1002,
//         name: "Mansoor",
//         email: "mansoorturk757@gmail.com",
//         password: "Mansoor@123"
//     }
//     ];

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle login logic here
//         console.log('Email:', email);
//         console.log('Password:', password);
//         // const matchedUser = dumatanpt.find(
//         //     user => user.email === email && user.password === password
//         // );
//         const matchedUser = dumyatanpt.find(
//             user => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
//         );
//         if (matchedUser) {
//             Swal.fire({
//                 title: 'Login Successful',
//                 text: `Welcome back, ${matchedUser.name}!`,
//                 icon: 'success',
//                 confirmButtonText: 'OK',
//             }).then(() => {
//                 localStorage.setItem('User_Data', JSON.stringify(matchedUser));
//                 localStorage.setItem('isLoggedIn', 'true');
//                 navigate('/');
//             });
//             setEmail('');
//             setPassword('');
//         }
//         else {
//             Swal.fire({
//                 title: 'Login Failed',
//                 text: 'Invalid email or password.',
//                 icon: 'error',
//                 confirmButtonText: 'Try Again',
//             });
//         }
//     };
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
//             <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 sm:p-10 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl">
//                 {/* Decorative background elements */}
//                 <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 animate-blob"></div>
//                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-30 animate-blob animation-delay-2000"></div>
//                 <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-blob animation-delay-4000"></div>

//                 <div className="relative z-10">
//                     <div className="text-center mb-8">
//                         <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
//                             Welcome Back!
//                         </h2>
//                         <p className="text-gray-600 text-lg">
//                             Sign in to your account
//                         </p>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                 Email Address
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className=" text-gray-900  font-bold    block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
//                                 placeholder="you@example.com"
//                             />
//                         </div>


//                         <div className="relative">
//                             <input
//                                 type={showPassword ? "text" : "password"}
//                                 id="password"
//                                 name="password"
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 required
//                                 className="text-gray-900 font-bold block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
//                                 placeholder="••••••••"
//                             />
//                             <button
//                                 type="button"
//                                 className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
//                                 onClick={() => setShowPassword(!showPassword)}
//                             >
//                                 {showPassword ? (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                         <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                                     </svg>
//                                 ) : (
//                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                         <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
//                                         <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
//                                     </svg>
//                                 )}
//                             </button>
//                         </div>





//                         <div>
//                             <button
//                                 type="submit"
//                                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
//                             >
//                                 Sign In
//                             </button>
//                         </div>
//                     </form>

//                     {/* <div className="mt-8 text-center">
//                         <p className="text-sm text-gray-600">
//                             Don't have an account?{'/signup '}
//                             <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200 ease-in-out">
//                                 Sign up
//                             </a>
//                         </p>
//                     </div> */}
//                 </div>
//             </div>
//             <PrivateRoutes dumyatanpt={dumyatanpt} />
//         </div>
//     );
// };

// export default Login;


// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const dumyatanpt = [
        { id: 1001, name: "Admin", email: "admin@gmail.com", password: "Admin@123" },
        { id: 1002, name: "Mansoor", email: "mansoorturk757@gmail.com", password: "Mansoor@123" }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        const matchedUser = dumyatanpt.find(
            user => user.email.toLowerCase() === email.trim().toLowerCase() && user.password === password
        );
        if (matchedUser) {
            Swal.fire({
                title: 'Login Successful',
                text: `Welcome back, ${matchedUser.name}!`,
                icon: 'success',
                confirmButtonText: 'OK',
            }).then(() => {
                localStorage.setItem('User_Data', JSON.stringify(matchedUser));
                localStorage.setItem('isLoggedIn', 'true');
                navigate('/fruntend_youngbazer'); // Redirect to dashboard
            });
            setEmail('');
            setPassword('');
        } else {
            Swal.fire({
                title: 'Login Failed',
                text: 'Invalid email or password.',
                icon: 'error',
                confirmButtonText: 'Try Again',
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden max-w-md w-full p-8 sm:p-10 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl">
                <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 animate-blob"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-blob animation-delay-4000"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
                            Welcome Back!
                        </h2>
                        <p className="text-gray-600 text-lg">
                            Sign in to your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="text-gray-900 font-bold block w-full px-4 py-2.5 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="text-gray-900 font-bold block w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 ease-in-out text-lg"
                                placeholder="••••••••"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                    </svg>
                                )}
                            </button>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;

// import React, { useState, useEffect } from 'react';
// import { FaFacebook, FaGoogle } from "react-icons/fa";
// import { FaSquareFacebook } from 'react-icons/fa6';
// import gogle from '../images/gogle_logo.png';


// const Signup = () => {
//     const [formData, setFormData] = useState({
//         firstName: '',
//         lastName: '',
//         email: '',
//         password: '',
//         confirmPassword: '',
//         phone: '',
//         acceptTerms: false
//     });

//     const [errors, setErrors] = useState({});
//     const [passwordStrength, setPasswordStrength] = useState(0);
//     const [showPassword, setShowPassword] = useState(false);

//     // Password strength calculation
//     useEffect(() => {
//         if (formData.password) {
//             let strength = 0;

//             // Minimum length
//             if (formData.password.length >= 8) strength++;

//             // Contains uppercase
//             if (/[A-Z]/.test(formData.password)) strength++;

//             // Contains lowercase
//             if (/[a-z]/.test(formData.password)) strength++;

//             // Contains number
//             if (/\d/.test(formData.password)) strength++;

//             // Contains special character
//             if (/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) strength++;

//             setPasswordStrength(strength);
//         } else {
//             setPasswordStrength(0);
//         }
//     }, [formData.password]);

//     const validateForm = () => {
//         const newErrors = {};

//         if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
//         if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';

//         if (!formData.email.trim()) {
//             newErrors.email = 'Email is required';
//         } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//             newErrors.email = 'Please enter a valid email';
//         }

//         if (!formData.password) {
//             newErrors.password = 'Password is required';
//         } else if (formData.password.length < 8) {
//             newErrors.password = 'Password must be at least 8 characters';
//         }

//         if (formData.password !== formData.confirmPassword) {
//             newErrors.confirmPassword = 'Passwords do not match';
//         }

//         if (formData.phone && !/^03\d{9}$/.test(formData.phone)) {
//             newErrors.phone = 'Please enter a valid Pakistani phone number like 03001234567';
//         }



//         if (!formData.acceptTerms) {
//             newErrors.acceptTerms = 'You must accept the terms and conditions';
//         }

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked : value
//         }));
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (validateForm()) {
//            
//             alert('Account created successfully! Please check your email for verification.');
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
//             <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-3xl mx-auto p-8 sm:p-10 transform transition-all duration-500 hover:scale-[1.01] hover:shadow-3xl">
//                 {/* Background animations */}
//                 <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-30 animate-blob"></div>
//                 <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-30 animate-blob animation-delay-2000"></div>
//                 <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-200 rounded-full opacity-30 animate-blob animation-delay-4000"></div>

//                 <div className="relative z-10">
//                     <div className="text-center mb-8">
//                         <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
//                         <p className="text-gray-600 text-lg">Join our community today</p>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                         <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
//                             <img src={gogle} alt="Google logo" className="w-6 h-6" />
//                             {/* <FaGoogle className='w-6 h-6 text-amber-200  ' /> */}
//                             Sign up with Google
//                         </button>
//                         <button className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition">
//                             <FaSquareFacebook className="w-6 h-6 text-[#1877F2]" />

//                             Sign up with Facebook
//                         </button>
//                     </div>

//                     <div className="flex items-center my-6">
//                         <div className="flex-grow border-t border-gray-300"></div>
//                         <span className="mx-4 text-gray-500">OR</span>
//                         <div className="flex-grow border-t border-gray-300"></div>
//                     </div>

//                     <form onSubmit={handleSubmit} className="space-y-5">
//                         <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                             <div>
//                                 <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
//                                 <input
//                                     type="text"
//                                     id="firstName"
//                                     name="firstName"
//                                     value={formData.firstName}
//                                     onChange={handleChange}
//                                     className={`block w-full px-4 py-2.5 border ${errors.firstName ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200   text-gray-900  font-bold `}
//                                     placeholder="John"
//                                 />
//                                 {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
//                             </div>

//                             <div>
//                                 <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
//                                 <input
//                                     type="text"
//                                     id="lastName"
//                                     name="lastName"
//                                     value={formData.lastName}
//                                     onChange={handleChange}
//                                     className={`block w-full px-4 py-2.5 border ${errors.lastName ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200
//     text-gray-900  font-bold
//    `}
//                                     placeholder="Doe"
//                                 />
//                                 {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                                 className={`block w-full px-4 py-2.5 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200
// text-gray-900  font-bold
//          `}
//                                 placeholder="you@example.com"
//                             />
//                             {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
//                         </div>

//                         <div>
//                             <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number (Optional)</label>
//                             <input
//                                 type="tel"
//                                 id="phone"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                                 className={` text-gray-900  font-bold  block w-full px-4 py-2.5 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
//                                 placeholder="03XXXXXXXXX"
//                                 maxLength={11}
//                                 pattern="03[0-9]{9}"
//                                 title="Phone number must be 11 digits and start with 03 (e.g., 03001234567)"
//                             />
//                             {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
//                         </div>

//                         <div>
//                             <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//                             <div className="relative">
//                                 <input
//                                     type={showPassword ? "text" : "password"}
//                                     id="password"
//                                     name="password"
//                                     value={formData.password}
//                                     onChange={handleChange}
//                                     className={` text-gray-900  font-bold  block w-full px-4 py-2.5 pr-10 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
//                                     placeholder="••••••••"
//                                 />
//                                 <button
//                                     type="button"
//                                     className=" absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
//                                     onClick={() => setShowPassword(!showPassword)}
//                                 >
//                                     {showPassword ? (
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                             <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                             <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                                         </svg>
//                                     ) : (
//                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                                             <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
//                                             <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
//                                         </svg>
//                                     )}
//                                 </button>
//                             </div>
//                             {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}

//                             <div className="mt-2">
//                                 <div className="flex items-center gap-2 mb-1">
//                                     <div className={`h-1.5 rounded-full flex-1 ${passwordStrength > 0 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
//                                     <div className={`h-1.5 rounded-full flex-1 ${passwordStrength > 1 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
//                                     <div className={`h-1.5 rounded-full flex-1 ${passwordStrength > 2 ? 'bg-yellow-500' : 'bg-gray-200'}`}></div>
//                                     <div className={`h-1.5 rounded-full flex-1 ${passwordStrength > 3 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
//                                     <div className={`h-1.5 rounded-full flex-1 ${passwordStrength > 4 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
//                                 </div>
//                                 <p className="text-xs text-gray-500">
//                                     Password Strength: {passwordStrength === 0 ? 'Weak' : passwordStrength < 3 ? 'Medium' : 'Strong'}
//                                     {passwordStrength > 0 && (
//                                         <span className="ml-1">({passwordStrength}/5)</span>
//                                     )}
//                                 </p>
//                             </div>
//                         </div>

//                         <div>
//                             <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                             <input
//                                 type="password"
//                                 id="confirmPassword"
//                                 name="confirmPassword"
//                                 value={formData.confirmPassword}
//                                 onChange={handleChange}
//                                 className={` text-gray-900  font-bold   block w-full px-4 py-2.5 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200`}
//                                 placeholder="••••••••"
//                             />
//                             {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
//                         </div>

//                         <div className="flex items-start">
//                             <div className="flex items-center h-5">
//                                 <input
//                                     id="acceptTerms"
//                                     name="acceptTerms"
//                                     type="checkbox"
//                                     checked={formData.acceptTerms}
//                                     onChange={handleChange}
//                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                                 />
//                             </div>
//                             <div className="ml-3 text-sm">
//                                 <label htmlFor="acceptTerms" className="font-medium text-gray-700">
//                                     I agree to the <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a> and <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
//                                 </label>
//                                 {errors.acceptTerms && <p className="mt-1 text-sm text-red-600">{errors.acceptTerms}</p>}
//                             </div>
//                         </div>

//                         <div>
//                             <button
//                                 type="submit"
//                                 className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
//                             >
//                                 Create Account
//                             </button>
//                         </div>
//                     </form>

//                     <div className="mt-6 text-center">
//                         <p className="text-sm text-gray-600">
//                             Already have an account?{' '}
//                             <a href="login" className="font-medium text-indigo-600 hover:text-indigo-500">
//                                 Log in
//                             </a>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Signup;
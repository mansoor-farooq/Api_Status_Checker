import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Layout from '../component/Layout';

// Reusable FloatingStars component
const FloatingStars = ({ count = 100 }) => {
    return (
        <>
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, Math.random(), 0],
                        y: [0, -Math.random() * 100, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 5,
                        repeat: Infinity,
                        delay: Math.random() * 5
                    }}
                    style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        width: `${Math.random() * 4 + 1}px`,
                        height: `${Math.random() * 4 + 1}px`,
                    }}
                />
            ))}
        </>
    );
};

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (

        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(#64748b_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_at_center,transparent_30%,black)]" />
            </div>

            {/* Animated Glowing Orbs */}
            <motion.div
                className="absolute -bottom-1/3 -left-1/3 w-2/3 h-2/3 rounded-full bg-emerald-500/10 blur-3xl"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full bg-blue-500/10 blur-3xl"
                animate={{ opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 6, repeat: Infinity }}
            />

            {/* Floating Stars */}
            <FloatingStars count={100} />

            {/* Main Content Container */}
            <motion.div
                className="relative flex flex-col items-center justify-center min-h-screen px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* 404 Number Display */}
                <motion.div
                    className="relative mb-8"
                    whileHover={{ scale: 1.05 }}
                >
                    <motion.div
                        className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full blur opacity-30"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                        404
                    </h1>
                </motion.div>

                {/* Error Message */}
                <motion.div
                    className="text-center mb-8"
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <motion.h2
                        className="text-3xl md:text-4xl font-semibold text-white mb-4"
                        animate={{ x: [0, -5, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        Oops! Page Not Found
                        <motion.span
                            className="ml-3 inline-block"
                            animate={{ rotate: [0, 20, -20, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            🚀
                        </motion.span>
                    </motion.h2>
                    <p className="text-lg text-slate-300 max-w-md mx-auto">
                        The page you're looking for has been lost in space. Don't worry, our cosmic team is on it!
                    </p>
                </motion.div>

                {/* Navigation Button */}
                <motion.button
                    className="relative px-6 py-3 bg-white/10 backdrop-blur-lg rounded-lg border border-white/20 hover:border-emerald-400/50 transition-all duration-300 group overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/')}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white font-medium group-hover:text-emerald-200 transition-colors duration-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                        </svg>
                        Return Home
                    </span>
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 to-transparent opacity-0 -skew-x-12"
                        whileHover={{ opacity: 1 }}
                    />
                </motion.button>
            </motion.div>
        </div>

    );
};

// Wrap NotFoundPage with Layout

export default NotFoundPage;
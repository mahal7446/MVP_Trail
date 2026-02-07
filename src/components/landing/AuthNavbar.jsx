import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AuthNavbar() {
    const navigate = useNavigate();

    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="fixed w-full top-0 z-50 bg-transparent backdrop-blur-md bg-opacity-30"
        >
            <div className="container mx-auto px-6 h-[72px] flex items-center justify-between">
                {/* Logo Only */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    onClick={() => navigate('/')}
                    className="text-2xl font-semibold text-agri-green hover:text-agri-green-light transition-colors duration-300 cursor-pointer"
                >
                    AgriDetect AI
                </motion.button>
            </div>
        </motion.nav>
    );
}

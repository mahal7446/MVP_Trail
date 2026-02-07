import { motion } from "framer-motion";
import { CommunityAlerts } from "@/components/dashboard/CommunityAlerts";
import { useTranslation } from "react-i18next";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 }
    }
};

export const CommunityPage = () => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
        >
            {/* Page Header */}
            <motion.div variants={itemVariants} className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {t("dashboard.communityAlerts.title")}
                </h1>
                <p className="text-muted-foreground">
                    {t("dashboard.communityAlerts.startSharing")}
                </p>
            </motion.div>

            {/* Community Alerts Section */}
            <motion.div variants={itemVariants}>
                <CommunityAlerts />
            </motion.div>
        </motion.div>
    );
};

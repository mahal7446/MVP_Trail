import { motion } from "framer-motion";
import { MapPin, AlertCircle, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface AlertCardProps {
    id: number;
    farmerName: string;
    location: string;
    diseaseReported: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
}

const getTimeAgo = (timestamp: string, t: any) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) {
        return t("dashboard.communityAlerts.timeAgo.justNow");
    } else if (diffMins < 60) {
        return t("dashboard.communityAlerts.timeAgo.minutesAgo", { count: diffMins });
    } else if (diffHours < 24) {
        return t("dashboard.communityAlerts.timeAgo.hoursAgo", { count: diffHours });
    } else {
        return t("dashboard.communityAlerts.timeAgo.daysAgo", { count: diffDays });
    }
};

export const AlertCard = ({
    farmerName,
    location,
    diseaseReported,
    description,
    imageUrl,
    createdAt,
}: AlertCardProps) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        >
            <Card className="overflow-hidden border-emerald-200/50 hover:border-emerald-300 transition-all hover:shadow-md">
                <CardContent className="p-4 bg-gradient-to-r from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent">
                    <div className="flex gap-3">
                        {/* Image Thumbnail */}
                        {imageUrl && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 border-emerald-200">
                                <img
                                    src={`http://localhost:5000${imageUrl}`}
                                    alt={diseaseReported}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            {/* Header with Farmer Name and Location */}
                            <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-medium text-sm">
                                        {farmerName} ({location}) {t("dashboard.communityAlerts.reportsDisease")}{" "}
                                        <span className="text-destructive font-semibold">{diseaseReported}</span>
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            {description && (
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                                    {description}
                                </p>
                            )}

                            {/* Footer */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>{getTimeAgo(createdAt, t)}</span>
                                </div>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 text-xs text-emerald-700 hover:text-emerald-800 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-950"
                                >
                                    {t("dashboard.communityAlerts.preventiveTips")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCard } from "./AlertCard";
import { AlertSubmissionForm } from "./AlertSubmissionForm";
import { useTranslation } from "react-i18next";

interface Alert {
    id: number;
    farmerName: string;
    location: string;
    diseaseReported: string;
    description?: string;
    imageUrl?: string;
    createdAt: string;
}

export const CommunityAlerts = () => {
    const { t } = useTranslation();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Get user data from localStorage
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    const fetchAlerts = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/alerts/recent?limit=10");
            const data = await response.json();

            if (data.success) {
                setAlerts(data.alerts);
            }
        } catch (error) {
            console.error("Failed to fetch alerts:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, []);

    const handleSubmitSuccess = () => {
        fetchAlerts(); // Refresh alerts after submission
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="shadow-soft overflow-hidden border-emerald-200/50 bg-gradient-to-br from-emerald-50/30 to-transparent dark:from-emerald-950/20 dark:to-transparent">
                <CardHeader className="pb-3 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Users className="w-5 h-5 text-emerald-600" />
                                {t("dashboard.communityAlerts.title")}
                            </CardTitle>
                            <CardDescription className="text-xs">
                                {t("dashboard.communityAlerts.startSharing")}
                            </CardDescription>
                        </div>
                        <Button
                            onClick={() => setIsFormOpen(true)}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            {t("dashboard.communityAlerts.submitAlert")}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-3">
                    {isLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <p className="text-sm">{t("common.loading")}</p>
                        </div>
                    ) : alerts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">{t("dashboard.communityAlerts.noAlerts")}</p>
                            <p className="text-xs mt-1">{t("dashboard.communityAlerts.startSharing")}</p>
                        </div>
                    ) : (
                        <div className="grid gap-3 sm:grid-cols-2">
                            {alerts.map((alert) => (
                                <AlertCard
                                    key={alert.id}
                                    id={alert.id}
                                    farmerName={alert.farmerName}
                                    location={alert.location}
                                    diseaseReported={alert.diseaseReported}
                                    description={alert.description}
                                    imageUrl={alert.imageUrl}
                                    createdAt={alert.createdAt}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Alert Submission Form Modal */}
            <AlertSubmissionForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmitSuccess={handleSubmitSuccess}
                userFullName={user?.fullName}
                userEmail={user?.email}
            />
        </motion.div>
    );
};

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface AlertSubmissionFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess: () => void;
    userFullName?: string;
    userEmail?: string;
}

export const AlertSubmissionForm = ({
    isOpen,
    onClose,
    onSubmitSuccess,
    userFullName,
    userEmail,
}: AlertSubmissionFormProps) => {
    const { t } = useTranslation();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        farmerName: userFullName || "",
        location: "",
        diseaseReported: "",
        description: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: t("profile.fileTooLarge"),
                description: t("profile.selectSmaller"),
                variant: "destructive",
            });
            return;
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: t("profile.invalidFile"),
                description: t("profile.selectImage"),
                variant: "destructive",
            });
            return;
        }

        setImageFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.farmerName || !formData.location || !formData.diseaseReported) {
            toast({
                title: t("common.error"),
                description: "Please fill in all required fields",
                variant: "destructive",
            });
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();
            submitFormData.append("farmerName", formData.farmerName);
            submitFormData.append("location", formData.location);
            submitFormData.append("diseaseReported", formData.diseaseReported);
            submitFormData.append("description", formData.description);
            if (userEmail) {
                submitFormData.append("userEmail", userEmail);
            }
            if (imageFile) {
                submitFormData.append("image", imageFile);
            }

            const response = await fetch("http://localhost:5000/api/alerts/submit", {
                method: "POST",
                body: submitFormData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to submit alert");
            }

            toast({
                title: t("dashboard.communityAlerts.alertSubmitted"),
                description: t("dashboard.communityAlerts.alertSubmittedDesc"),
            });

            // Reset form
            setFormData({
                farmerName: userFullName || "",
                location: "",
                diseaseReported: "",
                description: "",
            });
            setImageFile(null);
            setImagePreview(null);

            onSubmitSuccess();
            onClose();

        } catch (error) {
            console.error("Submit alert error:", error);
            toast({
                title: t("dashboard.communityAlerts.submitFailed"),
                description: error instanceof Error ? error.message : "Unknown error",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.2 }}
                    className="bg-background rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between z-10">
                        <h2 className="text-xl font-semibold">
                            {t("dashboard.communityAlerts.submitAlert")}
                        </h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {/* Farmer Name */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                {t("dashboard.communityAlerts.farmerName")} *
                            </label>
                            <Input
                                value={formData.farmerName}
                                onChange={(e) =>
                                    setFormData({ ...formData, farmerName: e.target.value })
                                }
                                placeholder={t("dashboard.communityAlerts.farmerName")}
                                required
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                {t("dashboard.communityAlerts.location")} *
                            </label>
                            <Input
                                value={formData.location}
                                onChange={(e) =>
                                    setFormData({ ...formData, location: e.target.value })
                                }
                                placeholder={t("dashboard.communityAlerts.location")}
                                required
                            />
                        </div>

                        {/* Disease Name */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                {t("dashboard.communityAlerts.disease")} *
                            </label>
                            <Input
                                value={formData.diseaseReported}
                                onChange={(e) =>
                                    setFormData({ ...formData, diseaseReported: e.target.value })
                                }
                                placeholder={t("dashboard.communityAlerts.disease")}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                {t("dashboard.communityAlerts.description")}
                            </label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                placeholder={t("dashboard.communityAlerts.description")}
                                rows={3}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="text-sm font-medium mb-1.5 block">
                                {t("dashboard.communityAlerts.uploadPhoto")}
                            </label>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />

                            {imagePreview ? (
                                <div className="relative w-full h-40 rounded-lg overflow-hidden border-2 border-dashed border-emerald-300">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            if (fileInputRef.current) {
                                                fileInputRef.current.value = "";
                                            }
                                        }}
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full h-32 rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Upload className="w-8 h-8" />
                                    <span className="text-sm">{t("dashboard.communityAlerts.uploadPhoto")}</span>
                                </button>
                            )}
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? t("dashboard.communityAlerts.submitting")
                                : t("dashboard.communityAlerts.submit")}
                        </Button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

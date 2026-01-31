import { UploadSection } from "@/components/dashboard/UploadSection";
import { Leaf, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const tips = [
  "Use natural lighting - avoid shadows and flash",
  "Focus on the affected area of the plant",
  "Hold camera steady for clear images",
  "Include both healthy and diseased parts if possible",
  "Take photos from multiple angles if needed",
];

export const UploadPage = () => {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <Leaf className="w-7 h-7 text-primary" />
          Upload Plant Image
        </h1>
        <p className="text-muted-foreground">
          Take a photo or upload an image of your plant to detect diseases
        </p>
      </div>

      {/* Upload Section */}
      <UploadSection />

      {/* Tips Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Tips for Best Results
          </h3>
          <ul className="space-y-3">
            {tips.map((tip, index) => (
              <li key={index} className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Supported Crops */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4">Supported Crops</h3>
          <div className="flex flex-wrap gap-2">
            {["Tomato", "Rice", "Wheat", "Cotton", "Potato", "Corn", "Grape", "Apple", "Pepper", "Strawberry"].map((crop) => (
              <span
                key={crop}
                className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
              >
                {crop}
              </span>
            ))}
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
              +20 more
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

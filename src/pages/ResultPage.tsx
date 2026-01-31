import { useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Leaf, 
  AlertTriangle, 
  Check, 
  Shield, 
  Pill, 
  Languages,
  Share2,
  Download,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import { PredictionResponse } from "@/lib/api";

interface DiseaseResult {
  diseaseName: string;
  confidence: number;
  cropName: string;
  severity: "Low" | "Medium" | "High";
  treatments: string[];
  preventions: string[];
  description: string;
}

// Treatment and prevention data (can be moved to a database or API)
const getDiseaseInfo = (diseaseName: string, cropName: string): { treatments: string[]; preventions: string[]; description: string } => {
  const diseaseInfo: Record<string, { treatments: string[]; preventions: string[]; description: string }> = {
    "Early Blight": {
      description: "Early blight is a common fungal disease that affects tomato and potato plants. It is caused by Alternaria solani and typically appears on older leaves first.",
      treatments: [
        "Apply copper-based fungicide every 7-10 days",
        "Remove and destroy infected leaves immediately",
        "Use neem oil spray as organic alternative",
        "Ensure proper spacing between plants for air circulation",
      ],
      preventions: [
        "Rotate crops yearly - avoid planting in same spot",
        "Water at the base of plants, not on leaves",
        "Mulch around plants to prevent soil splash",
        "Choose disease-resistant tomato varieties",
        "Maintain proper plant spacing for airflow",
      ],
    },
    "Late Blight": {
      description: "Late blight is a devastating disease caused by Phytophthora infestans. It spreads rapidly in cool, wet conditions and can destroy entire crops.",
      treatments: [
        "Apply fungicides containing chlorothalonil or mancozeb",
        "Remove and destroy all infected plant parts",
        "Improve air circulation around plants",
        "Avoid overhead watering",
      ],
      preventions: [
        "Plant disease-resistant varieties",
        "Space plants adequately for air flow",
        "Water early in the day so foliage dries",
        "Remove volunteer plants and crop debris",
      ],
    },
    "Healthy": {
      description: "Your plant appears to be healthy! Continue monitoring and maintaining good growing conditions.",
      treatments: [
        "Continue regular monitoring",
        "Maintain proper watering schedule",
        "Ensure adequate nutrition",
        "Keep plants well-spaced",
      ],
      preventions: [
        "Practice crop rotation",
        "Use disease-free seeds and plants",
        "Maintain proper plant spacing",
        "Monitor regularly for early signs of disease",
      ],
    },
  };

  return diseaseInfo[diseaseName] || {
    description: `${diseaseName} detected in ${cropName}. Consult with agricultural experts for specific treatment recommendations.`,
    treatments: [
      "Consult with agricultural extension services",
      "Identify specific disease characteristics",
      "Apply appropriate fungicides or treatments",
      "Remove severely infected plants if necessary",
    ],
    preventions: [
      "Practice good crop management",
      "Use disease-resistant varieties when available",
      "Maintain proper plant spacing and air circulation",
      "Monitor plants regularly for early detection",
    ],
  };
};

const severityConfig = {
  Low: { color: "bg-success/20 text-success border-success/30", icon: Check },
  Medium: { color: "bg-warning/20 text-warning border-warning/30", icon: AlertTriangle },
  High: { color: "bg-destructive/20 text-destructive border-destructive/30", icon: AlertTriangle },
};

export const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState<"en" | "local">("en");
  
  const imageUrl = location.state?.imageUrl || "/placeholder.svg";
  const predictionData: PredictionResponse | undefined = location.state?.prediction;
  
  // Use prediction data if available, otherwise use mock data
  const diseaseInfo = predictionData 
    ? getDiseaseInfo(predictionData.diseaseName, predictionData.cropName)
    : getDiseaseInfo("Early Blight", "Tomato");
  
  const result: DiseaseResult = predictionData
    ? {
        diseaseName: predictionData.diseaseName,
        confidence: predictionData.confidence,
        cropName: predictionData.cropName,
        severity: predictionData.severity,
        description: predictionData.description || diseaseInfo.description,
        treatments: diseaseInfo.treatments,
        preventions: diseaseInfo.preventions,
      }
    : {
        diseaseName: "Early Blight",
        confidence: 94,
        cropName: "Tomato",
        severity: "Medium",
        description: diseaseInfo.description,
        treatments: diseaseInfo.treatments,
        preventions: diseaseInfo.preventions,
      };
  
  const SeverityIcon = severityConfig[result.severity].icon;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === "en" ? "local" : "en")}
          >
            <Languages className="w-4 h-4 mr-2" />
            {language === "en" ? "हिंदी" : "English"}
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Image & Result Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Image Preview */}
        <Card className="overflow-hidden">
          <div className="aspect-square relative bg-muted">
            <img
              src={imageUrl}
              alt="Uploaded plant"
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <p className="text-white text-sm">Uploaded Image</p>
            </div>
          </div>
        </Card>

        {/* Result Summary */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="text-sm text-muted-foreground">Crop Detected</span>
            </div>
            <CardTitle className="text-3xl">{result.cropName}</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Disease Name */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Disease Identified</p>
              <h2 className="text-2xl font-bold text-destructive">{result.diseaseName}</h2>
            </div>

            {/* Confidence */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-semibold">{result.confidence}%</span>
              </div>
              <Progress value={result.confidence} className="h-2" />
            </div>

            {/* Severity */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Severity Level</span>
              <Badge variant="outline" className={`${severityConfig[result.severity].color} gap-1`}>
                <SeverityIcon className="w-3 h-3" />
                {result.severity}
              </Badge>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">About this disease</p>
              <p className="text-sm">{result.description}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Treatment & Prevention */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Treatment */}
        <Card className="shadow-soft border-l-4 border-l-accent">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Pill className="w-5 h-5 text-accent" />
              Treatment Suggestions
            </CardTitle>
            <CardDescription>How to treat this disease</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.treatments.map((treatment, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-accent">{index + 1}</span>
                  </div>
                  <span className="text-sm">{treatment}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Prevention */}
        <Card className="shadow-soft border-l-4 border-l-primary">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Preventive Measures
            </CardTitle>
            <CardDescription>How to prevent future infections</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.preventions.map((prevention, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm">{prevention}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/upload")} className="gap-2">
              <Leaf className="w-4 h-4" />
              Scan Another Plant
            </Button>
            <Button variant="outline" className="gap-2">
              <BookOpen className="w-4 h-4" />
              Learn More About {result.diseaseName}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

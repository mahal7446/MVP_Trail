import { WeatherWidget } from "@/components/dashboard/WeatherWidget";
import { UploadSection } from "@/components/dashboard/UploadSection";
import { RecentScans } from "@/components/dashboard/RecentScans";
import { Leaf, TrendingUp, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Total Scans", value: "127", icon: Leaf, color: "text-primary" },
  { label: "Diseases Detected", value: "23", icon: Shield, color: "text-accent" },
  { label: "Accuracy Rate", value: "94%", icon: TrendingUp, color: "text-success" },
  { label: "Community Farmers", value: "5.2K", icon: Users, color: "text-sky" },
];

export const DashboardPage = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Welcome back, Farmer! 🌾
        </h1>
        <p className="text-muted-foreground">
          Upload a plant image to detect diseases instantly with AI
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="shadow-soft hover:shadow-glow transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <UploadSection />

        {/* Recent Scans */}
        <RecentScans />
      </div>

      {/* Tips Section */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 sm:p-6">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            Tips for Best Results
          </h3>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Take photos in good natural lighting
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Focus on the affected area of the plant
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Include both healthy and diseased parts if possible
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              Avoid blurry or shadowy images
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

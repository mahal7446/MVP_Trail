import { Cloud, Droplets, Wind, Sun, ThermometerSun, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface WeatherData {
  temperature: number;
  humidity: number;
  condition: string;
  windSpeed: number;
  location: string;
  recommendation: string;
}

const mockWeather: WeatherData = {
  temperature: 28,
  humidity: 75,
  condition: "Partly Cloudy",
  windSpeed: 12,
  location: "Punjab, India",
  recommendation: "High humidity – monitor for fungal diseases like leaf blight",
};

export const WeatherWidget = () => {
  const weather = mockWeather;
  const isHighRisk = weather.humidity > 70;

  return (
    <Card className="overflow-hidden border-border/50 shadow-soft">
      <div className="gradient-sky p-1">
        <CardContent className="p-4 bg-card/95 backdrop-blur-sm rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Location & Main Temp */}
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-sky/20">
                {weather.condition.includes("Cloud") ? (
                  <Cloud className="w-10 h-10 text-sky" />
                ) : (
                  <Sun className="w-10 h-10 text-sun" />
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{weather.location}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-foreground">{weather.temperature}</span>
                  <span className="text-xl text-muted-foreground">°C</span>
                </div>
                <p className="text-sm font-medium text-foreground">{weather.condition}</p>
              </div>
            </div>

            {/* Weather Stats */}
            <div className="flex gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Droplets className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Humidity</p>
                  <p className="text-lg font-semibold">{weather.humidity}%</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-muted">
                  <Wind className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Wind</p>
                  <p className="text-lg font-semibold">{weather.windSpeed} km/h</p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <div className="p-2 rounded-lg bg-accent/20">
                  <ThermometerSun className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Feels like</p>
                  <p className="text-lg font-semibold">{weather.temperature + 2}°C</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation Banner */}
          <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
            isHighRisk ? "bg-warning/10 border border-warning/30" : "bg-success/10 border border-success/30"
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 ${isHighRisk ? "text-warning" : "text-success"}`} />
            <p className={`text-sm font-medium ${isHighRisk ? "text-warning" : "text-success"}`}>
              {weather.recommendation}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Calendar,
  Leaf,
  ChevronRight,
  Trash2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

interface HistoryItem {
  id: string;
  cropName: string;
  disease: string;
  severity: "Low" | "Medium" | "High";
  date: string;
  time: string;
  imageUrl: string;
  isHealthy: boolean;
}

const mockHistory: HistoryItem[] = [
  {
    id: "1",
    cropName: "Tomato",
    disease: "Early Blight",
    severity: "Medium",
    date: "Jan 28, 2026",
    time: "10:30 AM",
    imageUrl: "/placeholder.svg",
    isHealthy: false,
  },
  {
    id: "2",
    cropName: "Rice",
    disease: "Bacterial Leaf Blight",
    severity: "High",
    date: "Jan 27, 2026",
    time: "2:15 PM",
    imageUrl: "/placeholder.svg",
    isHealthy: false,
  },
  {
    id: "3",
    cropName: "Wheat",
    disease: "Healthy",
    severity: "Low",
    date: "Jan 26, 2026",
    time: "9:00 AM",
    imageUrl: "/placeholder.svg",
    isHealthy: true,
  },
  {
    id: "4",
    cropName: "Cotton",
    disease: "Leaf Curl Virus",
    severity: "High",
    date: "Jan 25, 2026",
    time: "4:45 PM",
    imageUrl: "/placeholder.svg",
    isHealthy: false,
  },
  {
    id: "5",
    cropName: "Potato",
    disease: "Late Blight",
    severity: "Medium",
    date: "Jan 24, 2026",
    time: "11:20 AM",
    imageUrl: "/placeholder.svg",
    isHealthy: false,
  },
];

const severityColors = {
  Low: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  High: "bg-destructive/20 text-destructive border-destructive/30",
};

export const HistoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch =
      item.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.disease.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity === "all" || item.severity === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
          <Calendar className="w-7 h-7 text-primary" />
          {t('history.pageTitle')}
        </h1>
        <p className="text-muted-foreground">
          {t('history.pageSubtitle')}
        </p>
      </div>

      {/* Search & Filter */}
      <Card className="shadow-soft">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t('history.searchPlaceholder')}
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('history.filterBySeverity')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('history.allSeverities')}</SelectItem>
                <SelectItem value="Low">{t('history.low')}</SelectItem>
                <SelectItem value="Medium">{t('history.medium')}</SelectItem>
                <SelectItem value="High">{t('history.high')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <div className="space-y-3">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => (
            <Card
              key={item.id}
              className="shadow-soft hover:shadow-glow transition-all cursor-pointer group"
              onClick={() => navigate("/result", { state: { scanId: item.id } })}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-muted shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.cropName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Leaf className="w-4 h-4 text-primary shrink-0" />
                      <span className="font-semibold text-lg truncate">{item.cropName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {item.isHealthy ? (
                        <span className="flex items-center gap-1 text-success">
                          <CheckCircle className="w-4 h-4" />
                          {t('history.healthy')}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          {item.disease}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.date} {t('history.at')} {item.time}
                    </p>
                  </div>

                  {/* Severity & Arrow */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      variant="outline"
                      className={`hidden sm:flex ${severityColors[item.severity]}`}
                    >
                      {item.severity}
                    </Badge>
                    <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <Leaf className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-semibold mb-2">{t('history.noScansFound')}</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterSeverity !== "all"
                  ? t('history.adjustSearch')
                  : t('history.uploadFirst')}
              </p>
              <Button onClick={() => navigate("/upload")}>
                {t('history.uploadPlantImage')}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Summary Stats */}
      {filteredHistory.length > 0 && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{mockHistory.length}</p>
                <p className="text-sm text-muted-foreground">{t('history.totalScans')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-success">
                  {mockHistory.filter(h => h.isHealthy).length}
                </p>
                <p className="text-sm text-muted-foreground">{t('history.healthyPlants')}</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-destructive">
                  {mockHistory.filter(h => !h.isHealthy).length}
                </p>
                <p className="text-sm text-muted-foreground">{t('history.diseasedPlants')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

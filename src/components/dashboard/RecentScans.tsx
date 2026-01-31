import { useNavigate } from "react-router-dom";
import { Clock, ChevronRight, Leaf } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RecentScan {
  id: string;
  cropName: string;
  disease: string;
  severity: "Low" | "Medium" | "High";
  date: string;
  imageUrl: string;
}

const mockRecentScans: RecentScan[] = [
  {
    id: "1",
    cropName: "Tomato",
    disease: "Early Blight",
    severity: "Medium",
    date: "2 hours ago",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "2",
    cropName: "Rice",
    disease: "Bacterial Leaf Blight",
    severity: "High",
    date: "Yesterday",
    imageUrl: "/placeholder.svg",
  },
  {
    id: "3",
    cropName: "Wheat",
    disease: "Healthy",
    severity: "Low",
    date: "2 days ago",
    imageUrl: "/placeholder.svg",
  },
];

const severityColors = {
  Low: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  High: "bg-destructive/20 text-destructive border-destructive/30",
};

export const RecentScans = () => {
  const navigate = useNavigate();

  return (
    <Card className="shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Recent Scans
          </CardTitle>
          <CardDescription>Your latest plant analyses</CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/history")}>
          View All
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {mockRecentScans.map((scan) => (
          <div
            key={scan.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
            onClick={() => navigate("/result", { state: { scanId: scan.id } })}
          >
            <div className="w-12 h-12 rounded-lg bg-muted overflow-hidden shrink-0">
              <img
                src={scan.imageUrl}
                alt={scan.cropName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Leaf className="w-4 h-4 text-primary shrink-0" />
                <span className="font-medium truncate">{scan.cropName}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate">{scan.disease}</p>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0">
              <Badge variant="outline" className={severityColors[scan.severity]}>
                {scan.severity}
              </Badge>
              <span className="text-xs text-muted-foreground">{scan.date}</span>
            </div>
            
            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
          </div>
        ))}

        {mockRecentScans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Leaf className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No scans yet. Upload your first plant image!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

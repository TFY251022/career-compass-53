import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Building2,
  ExternalLink,
  Briefcase,
  FileSearch,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import icon104 from "@/assets/104-icon.png";
import type { RecommendedJob } from "@/types/job";
import { cleanDimensionText, extractCity } from "@/utils/textCleaner";

/** Score color helper */
const getScoreColor = (score: number) => {
  if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
  if (score >= 60) return "text-amber-600 bg-amber-50 border-amber-200";
  return "text-rose-600 bg-rose-50 border-rose-200";
};

const RecommendationJobCard = ({ job }: { job: RecommendedJob }) => {
  const navigate = useNavigate();
  const city = extractCity(job.full_address);
  const reason = cleanDimensionText(job.recommendation_reason);

  return (
    <Card className="w-full min-w-0 max-w-full overflow-hidden group border-border transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-medium hover:shadow-[0_8px_30px_rgba(141,73,3,0.12)]">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          {/* Title with 104 icon on the left */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <img
                src={icon104}
                alt="104人力銀行"
                className="h-6 w-6 flex-shrink-0 rounded-full shadow-sm"
              />
              <h3 className="truncate text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
                {job.job_title}
              </h3>
            </div>
            <div className="mt-1 flex min-w-0 items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm">{job.company_name}</span>
            </div>
          </div>

          {/* Match score */}
          <div className="self-start flex-shrink-0">
            <div
              className={`rounded-lg border px-3 py-1.5 text-sm font-bold ${getScoreColor(job.final_score)}`}
            >
              {job.final_score.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Recommendation reason with line-clamp */}
        {reason && <p className="line-clamp-3 break-words text-sm text-muted-foreground">{reason}</p>}

        {/* Badges: city + industry (no salary) */}
        <div className="flex min-w-0 flex-wrap gap-2">
          {city && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {city}
            </Badge>
          )}
          <Badge variant="outline" className="flex min-w-0 max-w-full items-center gap-1">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            <span className="block max-w-[10.5rem] truncate sm:max-w-none">{job.industry}</span>
          </Badge>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:gap-3">
          <Button
            size="sm"
            variant="outline"
            className="w-full justify-center gap-1 sm:w-auto"
            onClick={() => navigate(`/jobs/${job.job_id}`)}
          >
            <FileSearch className="h-3 w-3" />
            查看詳細
          </Button>
          <a href={job.source_url} target="_blank" rel="noopener noreferrer" className="block w-full sm:w-auto">
            <Button size="sm" className="w-full justify-center gap-1 sm:w-auto">
              立即投遞
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationJobCard;

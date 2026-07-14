import { ScanSearch } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function AnalysesPage() {
  return <PagePlaceholder eyebrow="Review workflow" title="Analyses" description="AI reviews from pull requests and Sentry incidents." icon={ScanSearch} tabs={["PR reviews", "Sentry incidents"]} />;
}

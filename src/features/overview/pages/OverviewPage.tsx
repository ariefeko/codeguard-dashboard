import { Gauge } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function OverviewPage() {
  return <PagePlaceholder eyebrow="Workspace" title="Overview" description="What needs your attention across CodeGuard today." icon={Gauge} />;
}

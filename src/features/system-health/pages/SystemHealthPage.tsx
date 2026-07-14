import { Activity } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function SystemHealthPage() {
  return <PagePlaceholder eyebrow="Admin & operator" title="System Health" description="Operational status without exposing raw telemetry to regular users." icon={Activity} tabs={["Jobs", "LLM usage", "Observability"]} />;
}

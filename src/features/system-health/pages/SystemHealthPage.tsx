import { Activity } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function SystemHealthPage() {
  return <PagePlaceholder eyebrow="Admin & operator" title="System Health" description="Operational status without exposing raw telemetry to regular users." icon={Activity} tabs={[
    { label: "Jobs", to: "/system-health/jobs" },
    { label: "LLM Usage", to: "/system-health/llm-usage" },
    { label: "Observability", to: "/system-health/observability" },
  ]} />;
}

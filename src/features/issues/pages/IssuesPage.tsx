import { ListChecks } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function IssuesPage() {
  return <PagePlaceholder eyebrow="Review workflow" title="Issues" description="Triage findings, document decisions, and track resolutions." icon={ListChecks} tabs={["Open", "Resolved", "Ignored"]} />;
}

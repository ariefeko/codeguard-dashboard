import { ListChecks } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function IssuesPage() {
  return <PagePlaceholder eyebrow="Review workflow" title="Issues" description="Triage findings, document decisions, and track resolutions." icon={ListChecks} tabs={[
    { label: "Open", to: "/issues/open" },
    { label: "Resolved", to: "/issues/resolved" },
    { label: "Ignored", to: "/issues/ignored" },
  ]} />;
}

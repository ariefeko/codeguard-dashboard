import { Settings } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function SettingsPage() {
  return <PagePlaceholder eyebrow="Workspace" title="Settings" description="Manage integrations, AI behavior, telemetry, and exports." icon={Settings} tabs={[
    { label: "GitHub", to: "/settings/github" },
    { label: "Sentry", to: "/settings/sentry" },
    { label: "AI & RAG", to: "/settings/ai-rag" },
    { label: "Telemetry", to: "/settings/telemetry" },
    { label: "Obsidian", to: "/settings/obsidian" },
  ]} />;
}

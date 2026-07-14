import { Settings } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function SettingsPage() {
  return <PagePlaceholder eyebrow="Workspace" title="Settings" description="Manage integrations, AI behavior, telemetry, and exports." icon={Settings} tabs={["GitHub", "Sentry", "AI & RAG", "Telemetry", "Obsidian"]} />;
}

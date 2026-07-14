import { FolderKanban } from "lucide-react";
import { PagePlaceholder } from "../../../components/shared/PagePlaceholder";

export function ProjectsPage() {
  return <PagePlaceholder eyebrow="Workspace" title="Projects" description="Repositories and integrations grouped by engineering project." icon={FolderKanban} tabs={["All projects", "Repositories", "Integrations"]} />;
}

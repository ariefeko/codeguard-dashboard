# CodeGuard Dashboard

CodeGuard Dashboard is a web interface for monitoring AI code reviews and bug analyses in a unified engineering workflow. It brings together GitHub Pull Request and Sentry Incident analyses, helps users triage issues, records resolutions, and provides visibility into the health of the CodeGuard pipeline.

The project is currently at the **scalable frontend skeleton** stage. The application shell, routing, responsive navigation, role-aware menu, and feature boundaries are in place. API data, authentication, and domain workflows will be added incrementally according to the [build tasks](docs/tasks/dashboard-build-tasks.md).

## Features and Navigation

Primary user navigation:

- **Overview** — project health summary and items that need attention
- **Projects** — project, repository, and integration context
- **Analyses** — Pull Request reviews and Sentry incidents
- **Issues** — issue triage with Open, Resolved, and Ignored states
- **Settings** — GitHub, Sentry, AI & RAG, Telemetry, and Obsidian configuration

Additional navigation for administrators and operators:

- **System Health** — Jobs, LLM Usage, and business observability events

All pages currently use placeholders. The temporary user role is set to `admin` so every route can be inspected during skeleton development.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Lucide React
- CSS with initial design tokens
- Docker with a Node.js 24 build stage
- Nginx production web server

Tailwind CSS and shadcn/ui are planned for `F02 — UI Foundation` and are not installed in the current skeleton.

## Prerequisites

The recommended development environment requires:

- Docker Engine with Compose support

Node.js does not need to be installed on the host when using the `cg` workflow. All npm, npx, Node.js, and Vite commands run in the Node.js 24 development container.

For optional native development without Docker, the host requires:

- Node.js 24.x
- npm 11+

The repository includes `.nvmrc` and `.node-version` files that pin the runtime to Node.js 24.

With `nvm`, activate the expected runtime before installing dependencies:

```bash
nvm install
nvm use
```

## Installation

Clone or open the project, then enter its directory:

```bash
cd codeguard-dashboard
```

Make the project CLI executable if the executable bit was not preserved:

```bash
chmod +x cg
```

Initialize dependencies inside the Node.js 24 container:

```bash
./cg npm ci
```

## CodeGuard CLI

The root-level `cg` script provides a Sail-like prefix for development and production commands. Use it from the project directory:

```bash
./cg help
./cg up
./cg npm install
./cg npm run typecheck
./cg shell
```

To use `cg` without the `./` prefix, install a symbolic link in the user-local binary directory. Quoting `$PWD/cg` keeps this safe when the project path contains spaces:

```bash
unalias cg 2>/dev/null || true
mkdir -p "$HOME/.local/bin"
ln -sfn "$PWD/cg" "$HOME/.local/bin/cg"
export PATH="$HOME/.local/bin:$PATH"
rehash
```

Ensure the local binary directory remains available in future zsh sessions by adding this line to `~/.zshrc`:

```bash
export PATH="$HOME/.local/bin:$PATH"
```

Commands can then be written as:

```bash
cg up
cg npm install
cg npm run build
```

The symbolic link stores the correctly quoted absolute target, so `cg` also works when it is invoked outside the project directory. The wrapper changes into the project directory automatically.

## Running the Development Server

Start the Vite development container:

```bash
./cg up
```

Or run it in the background:

```bash
./cg up -d
./cg logs
```

The development dashboard is available at:

```text
http://localhost:5173
```

Open the address in a browser. Use the sidebar to navigate between Overview, Projects, Analyses, Issues, System Health, and Settings.

Use `CODEGUARD_DEV_PORT` when port `5173` is unavailable:

```bash
CODEGUARD_DEV_PORT=5174 ./cg up
```

### Managing Dependencies

Run dependency commands through `cg` so they always use Node.js 24:

```bash
./cg npm ci
./cg npm install axios
./cg npm uninstall axios
./cg npm outdated
```

Changes to `package.json` and `package-lock.json` are written back to the project directory. Dependencies are stored in the `codeguard_node_modules` Docker volume rather than the host filesystem.

## Running with Docker

Build and start the production container:

```bash
./cg prod -d
```

Open the dashboard at:

```text
http://localhost:8080
```

Check the container and application health:

```bash
./cg ps
curl http://localhost:8080/health
```

The health endpoint returns `ok`. The Nginx configuration also falls back to `index.html` for application routes, allowing URLs such as `/analyses` and `/issues` to work after a browser refresh.

Stop and remove the container:

```bash
./cg down
```

To use a different host port:

```bash
CODEGUARD_PORT=9090 ./cg prod -d
```

The resulting application is then available at `http://localhost:9090`.

The Dockerfile provides separate development and production stages:

1. `dependencies` installs locked dependencies with Node.js 24.
2. `development` runs Vite with source bind mounts and an isolated dependency volume.
3. `build` creates the Vite production bundle.
4. `production` uses Nginx 1.28 Alpine to serve the bundle, SPA fallback, cached assets, security headers, and `/health` endpoint.

## Using the Skeleton

1. Start the development server.
2. Open **Projects** to inspect the project-context structure.
3. Open **Analyses** and switch between the PR Reviews and Sentry Incidents tabs.
4. Open **Issues** to inspect the Open, Resolved, and Ignored status structure.
5. Open **System Health** to inspect the administrator/operator-only area.
6. Resize the browser to verify the responsive sidebar on smaller screens.

The skeleton is not connected to a backend yet. Placeholders identify the routes and feature boundaries where domain UI will be implemented.

## Scripts

```bash
./cg up                 # start the Vite development container
./cg npm run typecheck  # check TypeScript without emitting files
./cg npm run build      # run typecheck and create a production build
./cg prod -d            # build and start the Nginx production container
```

Verify the project before handing off changes:

```bash
./cg npm run typecheck
./cg npm run build
```

## Project Structure

```text
.
├── docs/
│   ├── codeguard_dashboard_concept.md
│   └── tasks/
│       └── dashboard-build-tasks.md
├── docker/
│   └── nginx.conf
├── src/
│   ├── app/
│   │   ├── layout/
│   │   ├── navigation/
│   │   ├── providers/
│   │   └── router/
│   ├── components/
│   │   └── shared/
│   ├── features/
│   │   ├── analyses/
│   │   ├── issues/
│   │   ├── overview/
│   │   ├── projects/
│   │   ├── settings/
│   │   └── system-health/
│   ├── styles/
│   └── main.tsx
├── .dockerignore
├── cg
├── compose.yaml
├── Dockerfile
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

The project follows a feature-based structure. Domain code lives in `src/features`, while application configuration, routing, providers, and layout live in `src/app`.

## Documentation

- [Dashboard concept](docs/codeguard_dashboard_concept.md)
- [Build tasks and progress](docs/tasks/dashboard-build-tasks.md)

The task document is the source of truth for implementation status. Update its `Current Progress` section after a task meets its definition of done.

## Current Status

```text
[x] F01 — Scalable Application Skeleton
[x] I01 — Frontend Containerization
[ ] F02 — UI Foundation
[ ] B01 — API Foundation
```

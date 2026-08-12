File/folder structure:

<your-repo>/
└── agents/
    └── support-copilot/
        ├── artifact.yaml       ← required (registers the agent)
        ├── agent-card.json     ← optional (enrichment for the detail page)
        └── README.md           ← optional (shown on the detail page)


Things that matter: id is the permanent identity — governance history hangs off it, so pick it carefully and never change it (moving the agent to another repo is fine, renaming the id is not). type: agent must sit under agents/ — a mismatch is reported as invalid. The schema is strict: an unknown or misspelled field rejects the manifest. You can check it before pushing with:

pnpm --filter @kihub/artifact-schema validate path/to/artifact.yaml
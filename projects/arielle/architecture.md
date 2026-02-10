# AI Usage and Enablement Survey – System Architecture and Implementation Tasks

## Overview
Your project aims to build a multi‑language AI‑usage survey system that helps organisations understand who uses AI, how it is used and what skills or governance gaps exist. The system must support Norwegian and English interfaces, allow different user roles (standard user, team manager and system administrator) to log in and access role‑specific dashboards, and enable administrators to create surveys and distribute them to users. The findings will inform AI governance, security and training programmes. The stack is composed of a FastAPI backend with SQLModel and Pydantic, a PostgreSQL database, a React/TypeScript frontend styled with Tailwind CSS, and deployment orchestrated via Docker Compose with Traefik as reverse proxy.

## Architecture summary
The system follows a client–server architecture with a single‑page React frontend communicating with a FastAPI backend over a REST API. Both services run inside Docker containers behind a Traefik reverse proxy that terminates HTTPS and performs dynamic routing. The backend uses SQLModel (built on Pydantic and SQLAlchemy) to define database models and interact with PostgreSQL. User authentication is handled via JWT tokens with secure password hashing. An admin can create surveys, and managers can view statistics for their teams. Email‑based password resets are supported via Mailcatcher in development.

## Backend API (FastAPI, SQLModel and Pydantic)
*   **FastAPI service**: The backend exposes REST endpoints for authentication, user management, survey creation, survey responses and dashboard data. FastAPI integrates tightly with Pydantic, so declaring request and response models with type annotations automatically handles parsing, conversion and validation. This combination means that most concerns around parsing input, converting data types and returning descriptive validation errors are handled automatically. Each parameter—including nested Pydantic models—benefits from automatic conversion and validation.
*   **SQLModel & PostgreSQL**: SQLModel is designed by the author of FastAPI and follows the same design principles. It was created to be the most intuitive way to interact with SQL databases in FastAPI applications. Internally it is both a Pydantic model and a SQLAlchemy model; thus you get Pydantic’s automatic data validation and serialization while also leveraging the robustness and power of SQLAlchemy. Models such as `User`, `Role`, `Team`, `Survey`, `Question`, `Option` and `Response` will map directly to database tables.
*   **Authentication & authorization**: User accounts are stored with hashed passwords. The security tutorial for FastAPI explains that hashing converts a password into gibberish, yielding the same hash for the same input and making it impossible to reconstruct the original password; if a database is stolen, attackers only get the hashes. A password‑hashing library (e.g., `pwdlib` with the Argon2 algorithm) will hash and verify passwords. After a user logs in, the API returns a JSON Web Token (JWT). A JWT is a means of representing claims to be transferred between two parties; claims are encoded as a JSON object and digitally signed or encrypted. Role‑based authorization logic ensures that users can only access endpoints appropriate to their role.

## Front‑end (React, TypeScript and Tailwind)
*   **Single‑page application**: The frontend is built with React and TypeScript. It communicates with the API via `fetch`/`axios` and uses hooks for state management. Modern tooling (Vite) ensures fast development and bundling. Tailwind CSS and shadcn/ui are used to build responsive, accessible user interfaces with light and dark modes.
*   **Internationalisation**: The application must support Norwegian and English. On the frontend, the `react‑i18next` library is used for translations. A typical i18n setup involves installing `i18next` and `react‑i18next`, storing translation resources in JSON files organised by language (e.g., `public/locales/en/translation.json` and `public/locales/nb/translation.json`), initialising `i18next` with a fallback language and loading resources, and using the `useTranslation` hook to render localized strings within components. A language switcher can call `i18n.changeLanguage('en')` or `'nb'` to change languages. On the backend, FastAPI does not provide built‑in i18n; if needed, a library like Babel can load translation files. Internationalisation is essential when developing applications for a global audience; efficient translation handling ensures a seamless user experience.

## Roles & dashboards
Three roles will be defined:
*   **Standard user**: Can log in, update personal preferences (e.g., default language, tool usage preferences) and answer assigned surveys. Each user sees a personal dashboard summarising pending surveys and previous submissions.
*   **Manager**: Inherits all user abilities and additionally sees a team dashboard showing aggregated survey statistics for their team. Managers can also manage team preferences or request additional surveys.
*   **Administrator**: Full control over the system. Admins can create new surveys, assign them to teams or individuals, view global statistics, and manage user roles and teams.

## Email notifications and password recovery
An email service is required for password reset and survey notifications. During development, Mailcatcher can be used to catch outgoing emails so they can be inspected locally. In production, a real SMTP provider will replace Mailcatcher.

## Reverse proxy and deployment
A Traefik reverse proxy sits in front of the services. Traefik is a modern open‑source reverse proxy and ingress controller that integrates with existing infrastructure and configures itself dynamically. Unlike traditional proxies, it performs service discovery to dynamically configure routing and supports automatic certificate generation (ACME/Let’s Encrypt), load balancing and API‑gateway features. Traefik will handle HTTPS termination, route `/api` requests to the FastAPI backend, and serve the React static files. Docker Compose orchestrates containers for the frontend, backend, database, Traefik, and Mailcatcher. Continuous Integration and Deployment (CI/CD) is handled with GitHub Actions; tests run with Pytest and Playwright.

## Data model
Below is a simplified representation of the core entities. Relationships are shown in parentheses.

| Entity | Description and key fields |
| :--- | :--- |
| **User** | Represents a person using the system. Fields: `id`, `username`, `email`, `hashed_password`, `role_id`, `team_id`, `preferred_language`, `created_at`. Each user belongs to a Role and optionally a Team. |
| **Role** | Defines permissions (User, Manager, Admin). Fields: `id`, `name`, `description`. |
| **Team** | Groups users for reporting. Fields: `id`, `name`, `manager_id` (FK to User). A manager is also a user. |
| **Survey** | A questionnaire created by an admin. Fields: `id`, `title`, `description`, `created_by` (admin user), `status` (draft/published), `created_at`. Surveys contain many Questions. |
| **Question** | Stores individual questions. Fields: `id`, `survey_id`, `text`, `type` (e.g., single‑choice, multi‑choice, open‑ended), `order`. Depending on type, there may be multiple Options. |
| **Option** | For multiple‑choice questions. Fields: `id`, `question_id`, `text`, `value`. |
| **Response** | Represents a user’s response to a survey. Fields: `id`, `survey_id`, `user_id`, `submitted_at`. Each response has multiple Answer records. |
| **Answer** | Stores an answer to a question. Fields: `id`, `response_id`, `question_id`, `answer_text` (for open‑ended) or `option_id` (for multiple‑choice). |

This model can be extended as the system evolves (e.g., adding versions of surveys, additional entities for AI tools inventory, or certification records).

## Key workflows
*   **User registration & login**: Users sign up (admin‑provisioned or self‑signup) and authenticate via a `/login` endpoint. Passwords are hashed using Argon2 and a JWT is returned to the client. The React app stores the token (e.g., in local storage) and attaches it to API requests.
*   **Preferences & profile management**: Authenticated users can view and update their profile (name, preferred language, tool preferences, certifications) through endpoints like `GET`/`PUT` `/users/me`.
*   **Survey creation (admin only)**: An admin uses the dashboard to compose a survey: define sections, questions and options. The backend persists the survey and marks it as draft or published. Managers can schedule surveys to teams or individuals.
*   **Survey participation**: When a survey is assigned, users see it on their dashboard. They answer questions (open‑ended or multiple choice) and submit the survey. The backend records responses and answers. Surveys support branching logic based on roles or previous answers.
*   **Reporting and dashboards**:
    *   **User dashboard**: Shows pending surveys, completed surveys and a summary of personal AI usage/skills.
    *   **Manager dashboard**: Aggregates responses for the manager’s team (e.g., AI usage statistics, skill gaps) without exposing individual answers.
    *   **Admin dashboard**: Global overview of survey participation, AI tool usage distribution, cost and risk metrics, and ability to create new surveys.
*   **Password recovery**: If a user forgets their password, they request a reset. A secure token is emailed (Mailcatcher in dev) and the user sets a new password.
*   **CI/CD & testing**: Changes pushed to the repository trigger GitHub Actions workflows that run PyTest and Playwright tests. On success, Docker images are built and deployed with Docker Compose. Traefik automatically reloads configuration and obtains/up‑renews HTTPS certificates.

## Implementation task breakdown
The following tasks are sequenced to incrementally build the system. Each task can be implemented as a separate branch or issue. Future refinements (e.g., advanced analytics, AI tool inventory, certification tracking) can build upon this foundation.

### 1 – Project setup and environment
*   Initialize repository with GitHub and set up GitHub Actions for linting, testing and container builds.
*   Create a Docker‑Compose configuration with services for:
    *   `backend` (FastAPI application)
    *   `frontend` (React app served by Vite in dev and static files in prod)
    *   `db` (PostgreSQL)
    *   `traefik` (reverse proxy) configured to route `/api` to the backend and other requests to the frontend; enable automatic HTTPS certificates
    *   `mail` (Mailcatcher) for local email testing
*   Configure environment variables (e.g., database URL, secret keys, JWT settings) using `.env` files.

### 2 – Database schema and models
*   Design SQLModel classes for `User`, `Role`, `Team`, `Survey`, `Question`, `Option`, `Response` and `Answer`. Use relationships (foreign keys) to link tables.
*   Create Alembic migrations (or SQLModel’s migration support) to create tables in PostgreSQL.
*   Seed initial data: default roles (User, Manager, Admin) and perhaps demo teams.

### 3 – Authentication and authorization
*   Implement password hashing using `pwdlib` or `passlib` with Argon2. Use utility functions to hash new passwords and verify logins.
*   Implement JWT issuance and verification. When a user logs in, return a signed JWT with claims like user ID, role and expiration.
*   Create FastAPI dependencies that extract the current user from the JWT and enforce role‑based permissions (e.g., `Depends(get_current_user)` and `Depends(require_role("admin"))`).
*   Implement endpoints for registration, login (`POST /token`), password reset initiation and confirmation.

### 4 – User management & preferences
*   Implement CRUD endpoints for users and teams. Admins can create users and assign roles/teams; managers can view their team members.
*   Add user preferences such as preferred language and tool usage flags; store them in the User table.
*   Expose endpoints `GET /users/me` and `PUT /users/me` to retrieve/update a user’s profile. Ensure appropriate validation via Pydantic/SQLModel.

### 5 – Survey management
*   Implement CRUD endpoints for surveys (`POST`/`GET`/`PUT`/`DELETE` `/surveys`). Only admins can create or delete surveys.
*   Implement endpoints to add, update and reorder questions and options within a survey.
*   Add publishing and scheduling logic: an admin can publish a survey and assign it to teams or users; store assignments in a join table (e.g., `SurveyAssignment`). Managers may schedule surveys for their team.
*   Support branching logic (optional) by adding condition fields to questions; the frontend uses this to decide which questions to display.

### 6 – Survey participation and responses
*   Expose endpoints for users to retrieve their assigned surveys and submit responses (`GET /surveys/assigned`, `POST /surveys/{id}/responses`). Validate that users can only submit once per survey.
*   Record responses: create a `Response` record and associated `Answer` records for each question; handle both multiple‑choice and open‑ended answers.
*   Implement progress saving (optional) by allowing users to save partial responses and resume later.

### 7 – Dashboards and analytics
*   **User dashboard**: build API endpoints that return a user’s pending and completed surveys, along with summary data (e.g., number of surveys, average AI skill level). The React UI displays this information.
*   **Manager dashboard**: create endpoints that aggregate responses for a team (e.g., distribution of AI usage levels, common tools used, training needs). Ensure that individual answers remain anonymous.
*   **Admin dashboard**: implement endpoints that provide global statistics: total number of surveys, participation rates, costs of AI tools, data‑risk metrics, etc.
*   **Graph and chart components**: on the frontend, use a chart library (e.g., Recharts or Chart.js) to visualise aggregated data.

### 8 – Internationalisation
*   Create translation JSON files for Norwegian (nb) and English (en) containing all user‑facing strings. Organise them in `public/locales/<lang>/translation.json`.
*   Configure `i18next` in the React app by creating an `i18n.ts` file that initialises `i18next` with a fallback language, loads resources and includes a language detector.
*   Wrap the application with `I18nextProvider` and use the `useTranslation` hook to fetch translations inside components.
*   Add a language switcher so users can toggle between Norwegian and English.
*   **Backend translations (optional)**: use Babel in FastAPI to translate error messages and server‑sent text. The FastAPI i18n guide demonstrates how to load translation files and support pluralization.

### 9 – Email notifications and password recovery
*   Set up email sending using an asynchronous email library (e.g., `aiosmtplib`). In development, configure the SMTP server to point to Mailcatcher. In production, use an SMTP provider.
*   Implement password‑reset flow: generate a signed token, email a reset link, verify the token and allow the user to set a new password.
*   Optional notifications: send emails when a new survey is assigned or when results are ready.

### 10 – Testing and quality assurance
*   **Unit tests**: write Pytest tests for models, authentication logic and API endpoints.
*   **Integration tests**: use `fastapi.testclient` to test end‑to‑end flows (e.g., user registration → survey creation → response submission).
*   **End‑to‑end tests**: configure Playwright to simulate a user interacting with the web app, switching languages, answering surveys and verifying dashboards.
*   **Continuous integration**: ensure GitHub Actions runs all tests on each commit and prevents merges on failure.

### 11 – Deployment and DevOps
*   **Container images**: create Dockerfiles for the backend and frontend. Use multi‑stage builds to produce minimal production images.
*   **Traefik configuration**: define entry points and routers in a `traefik.yml` file. Enable automatic TLS certificates and HTTP→HTTPS redirection. Configure middlewares (rate‑limiting, compression) as needed.
*   **Environment management**: use `.env` files for secrets; use Docker secrets or a secret‑management system in production.
*   **Monitoring & logging**: integrate Traefik’s dashboard for real‑time metrics and configure the backend to emit structured logs. Optionally configure Prometheus/Grafana for metrics.
*   **Automated deployment**: set up GitHub Actions to build images, push them to a registry and deploy to a target environment (e.g., a VPS, Kubernetes cluster or Docker Compose host).

### 12 – Future enhancements
*   **AI tool inventory**: Extend the schema to store detailed information on AI tools used by employees (e.g., tool name, cost, licensing model, date adopted) and integrate cost tracking.
*   **Skills & certifications**: Add models to track users’ AI skill levels, completed training courses and certifications. Use the survey results to recommend training paths.
*   **Policy management**: Implement features to create and distribute AI usage policies. Provide a versioned document and track acknowledgement by users.
*   **Agentic AI experiments**: Allow developers to register autonomous agents and record experiments, building on the MCP and RAG questions in the survey.
*   **Analytics & reporting**: Build advanced analytics dashboards using a BI tool or custom charts to identify trends over time.
*   **Mobile or desktop apps**: Consider building mobile clients or offline support for survey completion.

## Conclusion
This architecture leverages the strengths of FastAPI, SQLModel and React to build a robust, secure and extensible AI‑usage survey system. SQLModel provides an intuitive ORM layer while inheriting Pydantic’s data‑validation and SQLAlchemy’s power. FastAPI and Pydantic handle request parsing and validation automatically, while secure password hashing and JWT tokens protect user accounts. The React frontend with i18next ensures a responsive multilingual UI, and Traefik provides dynamic routing, HTTPS and load balancing. By following the task breakdown above, you can incrementally implement all required features and lay a solid foundation for future enhancements.
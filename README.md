# Vortekia — Theme Park Operations Management System

## Overview

Vortekia is an all-in-one operational platform designed for theme park environments. It serves two primary audiences:

- **Customers** — browse and queue for rides, order food from restaurants, purchase souvenirs, manage their wallet, and report lost items.
- **Staff** — role-based dashboards tailored to each position, from executive leadership down to ride operators and maintenance staff.

The system enforces a multi-step approval workflow for major decisions (e.g., opening new rides, restaurants, or stores) and provides full transaction tracking, maintenance logging, real-time chat, and push notifications via Firebase.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Tauri 2 (Rust) |
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS 4, Radix UI, Shadcn/ui |
| Server state | React Query 5 |
| Backend | Rust, SeaORM, Tokio |
| Database | MySQL |
| Cache | Redis |
| Real-time / Notifications | Firebase |
| Password hashing | Argon2 |

---

## Features

### Customer

- ID-based login and wallet management
- Browse rides and join virtual queues
- Order from restaurants and purchase souvenirs from retail stores
- View full transaction history
- Report lost items

### Staff (Role-based)

| Role | Key Capabilities |
|---|---|
| CEO | Approve restaurant / store proposals |
| CFO | Approve financial transactions |
| COO | Create staff accounts, manage rides, approve ride proposals |
| Customer Service | Create customer accounts, view facilities |
| FNB Supervisor | Manage restaurant staff and view F&B transaction history |
| Retail Manager | Manage stores, souvenirs, staff assignments |
| Ride Manager | Manage rides and staff schedules |
| Ride Staff | Process ride boarding operations |
| Chef / Waiter | Kitchen and service operations |
| Sales Associate | Handle store transactions |
| Maintenance Manager | Create and assign maintenance tasks |
| Maintenance Staff | Execute and log maintenance work |
| Lost & Found Staff | Log and resolve lost item reports |

---

## Project Structure

```
Program/
├── src/                    # React frontend
│   ├── pages/              # Role-specific page components
│   ├── components/         # Shared UI components and modals
│   ├── hooks/              # Custom hooks (data fetching, forms, auth)
│   ├── lib/                # TypeScript interfaces, router config
│   └── context/            # Auth context
│
└── src-tauri/              # Rust backend
    ├── src/
    │   ├── services/       # Business logic (26 services)
    │   ├── models/         # SeaORM entity models
    │   ├── repositories/   # Database access layer
    │   └── handlers/       # Tauri IPC command handlers
    └── migration/          # SeaORM database migrations
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Rust](https://rustup.rs/) toolchain
- MySQL database server
- Redis (Docker recommended)

---

## Getting Started

**1. Install frontend dependencies**

```bash
npm install
```

**2. Start Redis via Docker**

```bash
docker-compose up -d
```

**3. Configure the backend**

Copy and edit the environment file at `src-tauri/.env`:

```
DATABASE_URL=mysql://user:password@localhost/tpa_db
REDIS_URL=redis://127.0.0.1:6379
APP_ID=<your-app-id>
```

Add your Firebase credentials to `src-tauri/config.json`.

**4. Run database migrations**

```bash
cd src-tauri/migration
cargo run -- fresh
```

**5. Start the development app**

```bash
npm run tauri dev
```

---

## Building for Production

```bash
npm run tauri build
```

The packaged application will be output to `src-tauri/target/release/bundle/`.

---

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) with the following extensions:

- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

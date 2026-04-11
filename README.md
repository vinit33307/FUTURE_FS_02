# 🚀 LeadFlow CRM - Enterprise Client Intelligence System

LeadFlow CRM is a high-performance, full-stack Client Lead Management System designed for enterprise-scale sales operations. It provides a data-driven, premium workspace utilizing predictive lead scoring, secure role-based access, and real-time activity tracking to maximize conversion rates.

---

## 📸 Application Showcases

<div align="center">
  <img src="docs/screenshots/dashboard.png" width="800" alt="Dashboard Overview" />
  <p><em>Modern Analytics Dashboard with Real-time Intelligence Hub</em></p>
  
  <img src="docs/screenshots/pipeline.png" width="800" alt="Sales Pipeline" />
  <p><em>Dynamic Drag & Drop Sales Pipeline for Visual Lead Tracking</em></p>

  <img src="docs/screenshots/leads.png" width="800" alt="Leads Management" />
  <p><em>Premium Leads Management with Integrated AI Scoring</em></p>

  <img src="docs/screenshots/email.png" width="800" alt="Email Integration" />
  <p><em>Centralized Communication Hub with Automated Inbox Categorization</em></p>
</div>

---

## 🏗️ Architectural Design (Deep Dive)

LeadFlow CRM utilizes a decoupled **Layered Architecture** to ensure scalability, maintainability, and security.

### 1. High-Level System Architecture
```mermaid
graph TD
    subgraph "Presentation Layer (Frontend)"
        UI[View Components - React/UI]
        State[State Layer - Context API / TanStack Query]
        API_Client[API Client - Axios Service]
    end

    subgraph "Application Layer (Backend)"
        Routes[Express Routes]
        Middleware[Auth & RBAC Middleware]
        Logic[Controllers - Business Logic]
        Services[Integration Services]
    end

    subgraph "Data Layer"
        Mongoose[Mongoose Models]
        DB[(MongoDB Cluster)]
    end

    UI <--> State
    State <--> API_Client
    API_Client <==> Routes
    Routes --> Middleware
    Middleware --> Logic
    Logic --> Mongoose
    Mongoose <--> DB
```

### 2. Architectural Components
-   **Frontend**: A single-page application (SPA) built with React and Vite. It utilizes a **Context-Provider pattern** for global auth and CRM state, ensuring consistent data availability across the component tree.
-   **Backend**: A RESTful API built on Node.js and Express. It implements a **Controller-Service pattern** to separate HTTP concerns from core business logic.
-   **Security**: Implements stateless **JWT Authentication** with an extra layer of **Role-Based Access Control (RBAC)** filters at the route level.

---

## 👥 Comprehensive Use Case Analysis

### 1. Sales Operations Use Case
Focuses on the daily activities of Sales Representatives to move leads through the funnel.

```mermaid
graph LR
    SR((Sales Rep))
    
    subgraph "Sales Workflow"
        UC1(Capture New Lead)
        UC2(Nurture/Contact Lead)
        UC3(Update Pipeline Stage)
        UC4(Schedule Follow-up Tasks)
        UC5(View Personal Stats)
    end
    
    SR --> UC1
    SR --> UC2
    SR --> UC3
    SR --> UC4
    SR --> UC5
```

### 2. Administrative & Managerial Control Use Case
Focuses on oversight, system health, and team performance metrics.

```mermaid
graph LR
    Admin((Admin/Manager))
    
    subgraph "System Administration"
        UC6(User Provisioning)
        UC7(Role & Permission Management)
        UC8(Global Revenue Analytics)
        UC9(Team Performance Monitoring)
        UC10(System-wide Data Export)
    end
    
    Admin --> UC6
    Admin --> UC7
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
```

### 3. Interaction & Activity Management Use Case
Covers the automated tracking system that logs every touchpoint with a lead.

```mermaid
graph LR
    System((Automation Engine))
    
    subgraph "Engagement Tracking"
        UC11(Log Status Change)
        UC12(Trigger Notifications)
        UC13(Calculate Lead Score)
        UC14(Generate Activity Feed)
    end
    
    System --> UC11
    System --> UC12
    System --> UC13
    System --> UC14
```

---

## 🔄 Exhaustive Sequential Flows

### 1. Secure Authentication Sequence (Login)
How a user establishes a secure session.

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant FE as React Application
    participant Auth as Express Auth Controller
    participant JWT as JWT Service
    participant DB as MongoDB

    User->>FE: Enter Credentials
    FE->>Auth: POST /api/auth/login
    Auth->>DB: Find User by Email
    DB-->>Auth: User Document (Hashed PW)
    Auth->>Auth: Compare Passwords (Bcrypt)
    alt Valid Credentials
        Auth->>JWT: Sign Token (Payload: id, role)
        JWT-->>Auth: JWT String
        Auth-->>FE: 200 OK + Token + UserData
        FE->>FE: Store Token in LocalStorage/Cookies
        FE->>FE: Update AuthContext State
    else Invalid
        Auth-->>FE: 401 Unauthorized
    end
```

### 2. Lead Lifecycle & Pipeline Transition
The flow of updating a lead status via Drag-and-Drop.

```mermaid
sequenceDiagram
    participant Sales as Sales Rep
    participant FE as CRM Pipeline Page
    participant API as Leads Controller
    participant Act as Activity Logger
    participant DB as MongoDB

    Sales->>FE: Drag Lead Card to 'Qualified'
    FE->>API: PUT /api/leads/:id (status: 'Qualified')
    API->>DB: Lead.findByIdAndUpdate()
    DB-->>API: Updated Lead
    API->>Act: Create Activity Record
    Act->>DB: Activity.save()
    API-->>FE: 200 OK (New State)
    FE->>FE: Refresh UI via TanStack Query
```

### 3. Automated Task & Notification Flow
```mermaid
sequenceDiagram
    participant Sys as System Logic
    participant Task as Task Controller
    participant Notif as Notification Engine
    participant DB as MongoDB
    participant FE as Frontend Dashboard

    Sys->>Task: Trigger Follow-up Task
    Task->>DB: Task.create(assignedTo)
    Task->>Notif: Trigger Alert
    Notif->>DB: Notification.save()
    DB-->>FE: (On next poll) Load New Notifications
    FE->>FE: Display UI Badge / Toast
```

---

## 📊 Data Modeling & Entity Relationships (ERD)

The database schema is optimized for relational consistency within a document-based store.

```mermaid
erDiagram
    USER ||--o{ LEAD : manages
    USER ||--o{ TASK : assigned_to
    USER ||--o{ NOTIFICATION : receives
    LEAD ||--o{ ACTIVITY : generates
    LEAD ||--o{ TASK : has
    USER ||--o{ ACTIVITY : performs

    USER {
        string id PK
        string name
        string email
        string password
        string role
    }
    LEAD {
        string id PK
        string fullName
        string company
        string email
        string status
        int leadScore
        string assignedTo FK
    }
    TASK {
        string id PK
        string title
        string description
        string status
        date dueDate
        string leadId FK
        string assignedTo FK
    }
    ACTIVITY {
        string id PK
        string type
        string description
        date timestamp
        string leadId FK
        string userId FK
    }
```

---

## 🌐 Deployment Topology

LeadFlow CRM is designed for cloud-native deployment.

```mermaid
graph LR
    User((User)) --> CDN[CloudFront / Vercel CDN]
    CDN --> FE[React SPA]
    FE --> LB[Load Balancer]
    LB --> API1[Express Instance A]
    LB --> API2[Express Instance B]
    API1 --> Redis[Redis Cache]
    API2 --> Redis
    API1 --> Mongo[(MongoDB Atlas)]
    API2 --> Mongo
```

---

## 🎨 Design System & UI/UX Principles

-   **Aesthetic**: "Premium Tech" using vibrant indigo/rose gradients, slate surfaces, and glassmorphic overlays.
-   **Typography**: `Inter` for functional data, `Outfit` for display headings.
-   **Micro-interactions**: Subtle hover states, smooth Kanban transitions, and animated dashboard charts.
-   **Accessibility**: High-contrast ratios for data points and screen-reader-friendly semantic HTML.

---

## 🛠️ Technical Deep-Dives

### 🔐 Security & RBAC
LeadFlow uses a middleware-first approach to security. The `protect` and `authorize` middlewares verify the JWT and enforce role constraints before reaching the controller.
- **Admin**: Access to all leads, stats, and user management.
- **Manager**: Access to team stats and global leads.
- **Sales Rep**: Isolated access to only their assigned leads and tasks.

### 💾 Data Synchronization & Mongoose Middleware
To bridge the gap between MongoDB's `_id` and the Frontend's expectation of `id`, we use Mongoose `toJSON` transforms:
```javascript
schema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});
```
This ensures a seamless development experience in React without manual ID mapping.

---

## ⚙️ Project Setup

### 1. Backend
```bash
cd backend
npm install
# Configure .env with MONGODB_URI & JWT_SECRET
npm run dev
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Repository Map
```text
├── backend/            # REST API (Node/Express)
│   ├── controllers/    # Request handling logic
│   ├── middleware/     # Auth, Errors, RBAC
│   ├── models/         # Mongoose Data Schemas
│   └── routes/         # API Endpoint mapping
├── frontend/           # SPA (React/Vite)
│   ├── src/context/    # State management (Auth/CRM)
│   ├── src/pages/      # Feature views
│   └── src/services/   # API abstraction layer
└── docs/               # Screenshots and assets
```

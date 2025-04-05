# NET-BRIDGE System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      Docker Environment                         │
│                                                                 │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────────┐  │
│  │               │   │               │   │                   │  │
│  │  PostgreSQL   │◄──┤   Medusa.js   │◄──┤    Next.js 14     │  │
│  │  Database     │   │   Backend     │   │    Frontend       │  │
│  │               │   │               │   │                   │  │
│  └───────┬───────┘   └───────┬───────┘   └───────────────────┘  │
│          │                   │                     ▲             │
│          │           ┌───────▼───────┐             │             │
│          │           │               │             │             │
│          └──────────►│     Redis     │─────────────┘             │
│                      │    Cache      │                           │
│                      │               │                           │
│                      └───────────────┘                           │
│                                                                 │
│  ┌───────────────┐   ┌───────────────┐                          │
│  │               │   │               │                          │
│  │  Medusa Admin │   │  PDFKit &     │                          │
│  │  Panel        │   │  Nodemailer   │                          │
│  │               │   │               │                          │
│  └───────────────┘   └───────────────┘                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Backend (Medusa.js)

```
┌─────────────────────────────────────────────────────────────┐
│                    Medusa.js Backend                        │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │               │   │               │   │               │  │
│  │  Product      │   │  Custom       │   │  Quotation    │  │
│  │  Catalog      │   │  Config       │   │  System       │  │
│  │  Module       │   │  Module       │   │  Module       │  │
│  │               │   │               │   │               │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │               │   │               │   │               │  │
│  │  API          │   │  Services     │   │  Models       │  │
│  │  Routes       │   │  Layer        │   │  Layer        │  │
│  │               │   │               │   │               │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Frontend (Next.js)

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js Frontend                        │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │               │   │               │   │               │  │
│  │  Product      │   │  Config       │   │  Quote        │  │
│  │  Browser      │   │  Builder      │   │  Management   │  │
│  │               │   │               │   │               │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │               │   │               │   │               │  │
│  │  UI           │   │  API          │   │  State        │  │
│  │  Components   │   │  Services     │   │  Management   │  │
│  │               │   │               │   │               │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Product Configuration Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Select  │────►│ Configure│────►│  Update  │────►│  Add to  │
│  Product │     │ Options  │     │  Price   │     │  Quote   │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

### Quotation Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Review  │────►│  Enter   │────►│ Generate │────►│  Send    │
│  Quote   │     │  Details │     │  PDF     │     │  Email   │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
```

## Database Schema Extensions

Beyond the standard Medusa schema, we'll add the following extensions:

### Product Extensions
- Technical specifications (CPU, RAM, storage, etc.)
- Compatibility matrices
- Configuration options

### Custom Configurator
- Configuration templates
- Option relationships
- Price calculation rules

### Quotation System
- Quote records
- Customer information
- PDF templates
- Email templates

## Integration Points

### ETB Tech Feature Integration
- Product categorization structure
- Specification format
- Configuration options
- Filtering system

### Medusa B2B Starter Integration
- Company management
- Employee roles and permissions
- Quote management workflows
- UI components and styling

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 Docker Compose Structure                    │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐  │
│  │               │   │               │   │               │  │
│  │  Backend      │   │  Frontend     │   │  Admin        │  │
│  │  Container    │   │  Container    │   │  Container    │  │
│  │               │   │               │   │               │  │
│  └───────────────┘   └───────────────┘   └───────────────┘  │
│                                                             │
│  ┌───────────────┐   ┌───────────────┐                      │
│  │               │   │               │                      │
│  │  PostgreSQL   │   │  Redis        │                      │
│  │  Container    │   │  Container    │                      │
│  │               │   │               │                      │
│  └───────────────┘   └───────────────┘                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Performance Considerations

- Redis caching for product catalog and configurations
- Optimized product filtering
- Efficient PDF generation
- Docker resource allocation

## Security Architecture

- Admin-only authentication
- API request validation
- Docker network isolation
- Environment variable security

## Development Workflow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│          │     │          │     │          │     │          │
│  Local   │────►│  Feature │────►│  Testing │────►│  Docker  │
│  Dev     │     │  Branch  │     │          │     │  Deploy  │
│          │     │          │     │          │     │          │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
``` 
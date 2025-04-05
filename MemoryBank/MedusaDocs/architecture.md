# Medusa Architecture

This document outlines the architecture of Medusa, including its core components, modules, and design patterns. Understanding this architecture is crucial for effectively extending and customizing Medusa for the NET-BRIDGE project.

## High-Level Architecture

Medusa follows a modular, service-oriented architecture that separates concerns and promotes extensibility:

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT APPLICATIONS                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │   Storefront │  │     Admin    │  │ Custom Frontend  │   │
│  │    (Next.js) │  │  Dashboard   │  │   Applications   │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ RESTful API / GraphQL
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                       MEDUSA SERVER                          │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │   API Layer │  │    Services │  │     Subscribers    │  │
│  └─────────────┘  └─────────────┘  └────────────────────┘  │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌────────────────────┐  │
│  │    Models   │  │ Repositories│  │       Plugins      │  │
│  └─────────────┘  └─────────────┘  └────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                      DATA STORAGE                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │  PostgreSQL  │  │     Redis    │  │   File Storage   │   │
│  │   Database   │  │ Cache/Queue  │  │      (S3/etc)    │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### API Layer

Medusa provides both RESTful and GraphQL APIs for interacting with the system:

- **REST API**: The primary API for client applications
- **Admin API**: Used by the admin dashboard
- **Store API**: Used by storefronts
- **GraphQL API**: An alternative to REST for more complex queries

### Services

Services are the core of Medusa's business logic, following the Dependency Injection pattern:

```typescript
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';

@Service()
export class ProductService {
  constructor(
    private manager: EntityManager,
    private productRepository
  ) {}

  async retrieve(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  // ... other methods
}
```

Key built-in services include:

- **ProductService**: Manages products, variants, and options
- **CartService**: Handles cart creation, updates, and calculations
- **OrderService**: Processes order creation and management
- **CustomerService**: Manages customer data and operations
- **PaymentService**: Processes payments and refunds
- **ShippingService**: Handles shipping options and calculations

### Repositories

Repositories manage data access and persistence using TypeORM:

```typescript
import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Product } from "../models/product";

@MedusaRepository()
@EntityRepository(Product)
export class ProductRepository extends EntityRepository<Product> {
  // Custom query methods
}
```

### Models

Models define the data structure using TypeORM entities:

```typescript
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";

@Entity() 
export class Product extends MedusaProduct {
  @Column({ type: "jsonb", nullable: true })
  custom_attributes: Record<string, any>;
}
```

### Subscribers

Subscribers listen for and react to events in the system:

```typescript
import { EventBusService } from "@medusajs/medusa";
import { Subscriber } from "medusa-extender";

@Subscriber()
export class ProductSubscriber {
  constructor(private eventBusService: EventBusService) {
    this.eventBusService.subscribe("product.created", this.handleProductCreated);
  }

  handleProductCreated = async (data) => {
    // Handle product creation event
  };
}
```

### Plugins

Plugins extend Medusa's functionality without modifying the core code:

```javascript
// medusa-config.js
module.exports = {
  plugins: [
    {
      resolve: `medusa-payment-stripe`,
      options: {
        api_key: process.env.STRIPE_API_KEY,
      },
    },
    // Custom plugins
  ],
};
```

## Dependency Injection System

Medusa uses a dependency injection container to manage service instances and dependencies:

- Services are registered in the container at startup
- Dependencies are injected into constructors
- The container resolves dependency chains automatically
- Services are typically singletons within the application lifecycle

Example dependency resolution:

```typescript
// OrderService depends on CartService
constructor(
  private readonly cartService: CartService,
  private readonly orderRepository: OrderRepository
) {}

// Medusa automatically injects these dependencies
```

## Data Flow

### API Request Flow

1. Client makes a request to an API endpoint
2. Route handler in a controller receives the request
3. Controller calls appropriate service methods
4. Service performs business logic
5. Repository handles data persistence
6. Results flow back through the chain to the client

### Event Flow

1. Service emits an event via EventBusService
2. EventBus distributes the event to subscribers
3. Subscribers react to the event
4. Additional events may be triggered

## Customization Points

Medusa provides multiple customization points:

1. **Extended Models**: Add fields to existing entities
2. **Custom Services**: Create new services or extend existing ones
3. **API Extensions**: Add new endpoints or modify existing ones
4. **Subscribers**: React to system events
5. **Plugins**: Package functionality for reuse
6. **Strategies**: Provide alternative implementations for core algorithms

## Deployment Modes

Medusa supports multiple deployment configurations:

### Combined Mode (Default)

API handlers and background workers run in the same process:

```
┌─────────────────────────────────────┐
│            Medusa Server            │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │  API Server │  │   Workers   │  │
│  └─────────────┘  └─────────────┘  │
└─────────────────────────────────────┘
```

### Split Mode

API handlers and background workers run in separate processes:

```
┌─────────────────────┐  ┌─────────────────────┐
│   Medusa API Server │  │ Medusa Worker Server│
│                     │  │                     │
│  ┌─────────────┐    │  │    ┌─────────────┐  │
│  │  API Server │    │  │    │   Workers   │  │
│  └─────────────┘    │  │    └─────────────┘  │
└─────────────────────┘  └─────────────────────┘
```

Configured via environment variables:
- API server: `MEDUSA_WORKER_MODE=api`
- Worker server: `MEDUSA_WORKER_MODE=worker`

## Development Workflow

Medusa supports a flexible development workflow:

1. **Development Mode**: Hot reloading for quick feedback
2. **Build Process**: Compiles TypeScript to JavaScript
3. **Migrations**: Database schema changes with TypeORM
4. **Seeding**: Populating the database with initial data
5. **Testing**: Unit and integration testing support

## Performance Considerations

Medusa's architecture supports performance optimization through:

1. **Horizontal Scaling**: Multiple API servers with load balancing
2. **Worker Distribution**: Background tasks across multiple servers
3. **Database Optimization**: Indexes and query performance
4. **Caching**: Redis-based caching for frequently accessed data
5. **Query Optimization**: Using relations and select statements efficiently

## Security Architecture

Medusa implements several security features:

1. **Authentication**: JWT-based auth for APIs
2. **Authorization**: Role-based access control
3. **API Rate Limiting**: Prevention of abuse
4. **Data Validation**: Input validation at API boundaries
5. **Secure Communications**: HTTPS and secure cookies

## Integration Points

Medusa is designed to integrate with external systems:

1. **Payment Providers**: Stripe, PayPal, etc.
2. **Fulfillment Services**: Shipping carriers, 3PL
3. **Notification Systems**: Email, SMS, push notifications
4. **Analytics Platforms**: For sales and performance data
5. **ERP Systems**: For inventory and order management
6. **CRM Systems**: For customer data management

Understanding these integration points is crucial for building a comprehensive B2B platform like NET-BRIDGE. 
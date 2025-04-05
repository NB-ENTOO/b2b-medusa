# Medusa Backend

This document covers the backend aspects of Medusa, including setup, configuration, and development practices relevant to our NET-BRIDGE project.

## Backend Setup

### Installation

Setting up a Medusa backend typically involves:

```bash
# Create a new Medusa project
npx create-medusa-app

# Choose to create a Medusa server
# Select your preferred starter (default or one with plugins)

# Navigate to the project directory
cd my-medusa-store

# Start the development server
npm run dev
```

Alternatively, you can manually create a Medusa project:

```bash
# Install Medusa CLI globally
npm install @medusajs/medusa-cli -g

# Create a new project
medusa new my-medusa-server

# Install dependencies
cd my-medusa-server
npm install

# Start the development server
medusa develop
```

### Directory Structure

A typical Medusa backend project has the following structure:

```
my-medusa-server/
├── src/                    # Source code
│   ├── api/                # Custom API routes
│   ├── models/             # Database models
│   ├── repositories/       # Data repositories
│   ├── services/           # Business logic
│   ├── subscribers/        # Event handlers
│   └── migrations/         # Database migrations
├── data/                   # Persistent storage
├── uploads/                # File uploads
├── medusa-config.js        # Configuration
├── package.json            # Dependencies
└── tsconfig.json           # TypeScript config
```

## Configuration

### Environment Variables

Medusa uses environment variables for configuration:

```bash
# Database
DATABASE_URL=postgres://localhost/medusa-store
DATABASE_TYPE=postgres

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=something_secret
COOKIE_SECRET=something_secret

# Medusa
MEDUSA_ADMIN_ONBOARDING_TYPE=default
STORE_CORS=http://localhost:8000,http://localhost:3000
ADMIN_CORS=http://localhost:7000,http://localhost:7001

# Optional: for worker/API split
MEDUSA_WORKER_MODE=worker  # or "api" for API server
```

### medusa-config.js

The main configuration file for Medusa:

```javascript
// medusa-config.js
const dotenv = require("dotenv");
dotenv.config();

const plugins = [
  // Plugins configuration
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: process.env.STRIPE_API_KEY,
    },
  },
];

module.exports = {
  projectConfig: {
    redis_url: process.env.REDIS_URL,
    database_url: process.env.DATABASE_URL,
    database_type: process.env.DATABASE_TYPE,
    store_cors: process.env.STORE_CORS,
    admin_cors: process.env.ADMIN_CORS,
    database_extra: { ssl: { rejectUnauthorized: false } },
  },
  plugins,
};
```

## Database Management

### Migrations

Medusa uses TypeORM for database migrations:

```bash
# Create a migration
medusa migrations create my_migration

# Run migrations
medusa migrations run

# Revert the last migration
medusa migrations revert
```

Custom migrations follow the TypeORM format:

```typescript
// src/migrations/1609132313511-add_custom_field.ts
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCustomField1609132313511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" ADD COLUMN "custom_field" text`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP COLUMN "custom_field"`
    );
  }
}
```

### Seed Data

Populating the database with initial data:

```typescript
// src/seed.ts
import { Connection } from "typeorm";
import { Product } from "@medusajs/medusa";

export const seedDatabase = async (connection: Connection) => {
  const productRepository = connection.getRepository(Product);
  
  // Create a product
  await productRepository.save({
    title: "Test Product",
    description: "A test product",
    variants: [],
    // other required fields
  });
};
```

Execute with `medusa seed --seed src/seed.ts`.

## Custom Development

### Custom Entities/Models

Extending Medusa's data models:

```typescript
// src/models/custom-product.ts
import { Entity, Column } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";

@Entity()
export class CustomProduct extends MedusaProduct {
  @Column({ type: "varchar", nullable: true })
  custom_field: string;

  @Column({ type: "jsonb", nullable: true })
  technical_specs: Record<string, any>;

  @Column({ type: "boolean", default: false })
  is_configurable: boolean;
}
```

### Custom Repositories

Extending Medusa's repositories:

```typescript
// src/repositories/custom-product.ts
import { EntityRepository, Repository } from "typeorm";
import { CustomProduct } from "../models/custom-product";

@EntityRepository(CustomProduct)
export class CustomProductRepository extends Repository<CustomProduct> {
  async findConfigurable(): Promise<CustomProduct[]> {
    return this.find({ where: { is_configurable: true } });
  }
}
```

### Custom Services

Creating business logic in services:

```typescript
// src/services/custom-product.ts
import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";
import { CustomProductRepository } from "../repositories/custom-product";

@Service()
export class CustomProductService {
  constructor(
    private manager: EntityManager,
    private customProductRepository: CustomProductRepository
  ) {}

  async retrieveConfigurableProducts(): Promise<any[]> {
    return this.customProductRepository.findConfigurable();
  }

  async addTechnicalSpec(
    productId: string,
    key: string,
    value: any
  ): Promise<void> {
    const product = await this.customProductRepository.findOne(productId);
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    if (!product.technical_specs) {
      product.technical_specs = {};
    }
    
    product.technical_specs[key] = value;
    
    await this.customProductRepository.save(product);
  }
}
```

### Custom API Routes

Adding custom API endpoints:

```typescript
// src/api/routes/custom-product.ts
import { Router } from "express";
import { CustomProductService } from "../../services/custom-product";

export default (router: Router) => {
  const customProductRouter = Router();
  router.use("/custom-products", customProductRouter);

  // GET /custom-products/configurable
  customProductRouter.get("/configurable", async (req, res) => {
    const customProductService: CustomProductService = req.scope.resolve(
      "customProductService"
    );
    
    const configurableProducts = await customProductService.retrieveConfigurableProducts();
    
    res.json({
      products: configurableProducts,
    });
  });

  // POST /custom-products/:id/technical-spec
  customProductRouter.post("/:id/technical-spec", async (req, res) => {
    const customProductService: CustomProductService = req.scope.resolve(
      "customProductService"
    );
    
    const { id } = req.params;
    const { key, value } = req.body;
    
    await customProductService.addTechnicalSpec(id, key, value);
    
    res.status(200).json({
      success: true,
    });
  });

  return router;
};
```

### Event Subscribers

Handling events with subscribers:

```typescript
// src/subscribers/custom-product.ts
import { EventBusService } from "@medusajs/medusa";
import { Subscriber } from "medusa-extender";

@Subscriber()
export class CustomProductSubscriber {
  constructor(private eventBusService: EventBusService) {
    this.eventBusService.subscribe(
      "product.created",
      this.handleProductCreated
    );
    this.eventBusService.subscribe(
      "product.updated",
      this.handleProductUpdated
    );
  }

  handleProductCreated = async (data: any) => {
    // React to product creation
    console.log("Product created:", data);
  };

  handleProductUpdated = async (data: any) => {
    // React to product updates
    console.log("Product updated:", data);
  };
}
```

## Advanced Backend Features

### Background Jobs

Medusa provides a job scheduler using Redis Bull:

```typescript
// src/services/job-scheduler.ts
import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";
import { JobSchedulerService } from "@medusajs/medusa";

@Service()
export class CustomJobService {
  constructor(
    private jobSchedulerService: JobSchedulerService,
    private manager: EntityManager
  ) {}

  async scheduleEmailJob(email: string, data: any): Promise<void> {
    await this.jobSchedulerService.create("send-email", {
      email,
      data,
    }, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 10000,
      },
    });
  }
}
```

Job processor:

```typescript
// src/jobs/send-email.ts
import { JobManager } from "@medusajs/medusa"

export const sendEmailJob = async (
  job: any,
  { container }: { container: any }
) => {
  const { email, data } = job.data
  // Logic to send email
  // e.g. call a service from the container:
  const emailService = container.resolve("emailService")
  await emailService.sendEmail(email, data)
  
  return { success: true }
}

export const sendEmailJobHandler = {
  identifier: "send-email",
  handler: sendEmailJob,
}

// Register job handler
export default async (container: any): Promise<void> => {
  const jobManager: JobManager = container.resolve("jobManager")
  jobManager.registerHandler(sendEmailJobHandler)
}
```

### Caching Strategies

Implementing caching with Redis:

```typescript
// src/services/cache.ts
import { Service } from "medusa-extender";
import { Redis } from "ioredis";

@Service()
export class CacheService {
  constructor(private redis: Redis) {}

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const data = JSON.stringify(value);
    if (ttl) {
      await this.redis.set(key, data, "EX", ttl);
    } else {
      await this.redis.set(key, data);
    }
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
```

### Authentication and Authorization

Custom authentication middleware:

```typescript
// src/api/middlewares/auth.ts
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export function customAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
```

Using the middleware:

```typescript
// src/api/routes/protected.ts
import { Router } from "express";
import { customAuthMiddleware } from "../middlewares/auth";

export default (router: Router) => {
  const protectedRouter = Router();
  router.use("/protected", customAuthMiddleware, protectedRouter);

  protectedRouter.get("/", (req, res) => {
    res.json({
      message: "This is a protected route",
      user: req.user,
    });
  });

  return router;
};
```

## Testing

### Unit Testing

Example of testing a service with Jest:

```typescript
// src/services/__tests__/custom-product.spec.ts
import { CustomProductService } from "../custom-product";

describe("CustomProductService", () => {
  let service: CustomProductService;
  let mockManager: any;
  let mockRepository: any;

  beforeEach(() => {
    mockRepository = {
      findConfigurable: jest.fn().mockResolvedValue([
        { id: "prod_1", is_configurable: true },
      ]),
      findOne: jest.fn().mockResolvedValue({
        id: "prod_1",
        technical_specs: {},
      }),
      save: jest.fn().mockImplementation((product) => Promise.resolve(product)),
    };

    mockManager = {
      transaction: jest.fn().mockImplementation((cb) => cb(mockManager)),
    };

    service = new CustomProductService(mockManager, mockRepository);
  });

  it("should retrieve configurable products", async () => {
    const result = await service.retrieveConfigurableProducts();

    expect(mockRepository.findConfigurable).toHaveBeenCalled();
    expect(result).toEqual([{ id: "prod_1", is_configurable: true }]);
  });

  it("should add technical spec to product", async () => {
    await service.addTechnicalSpec("prod_1", "cpu", "Intel i7");

    expect(mockRepository.findOne).toHaveBeenCalledWith("prod_1");
    expect(mockRepository.save).toHaveBeenCalledWith({
      id: "prod_1",
      technical_specs: { cpu: "Intel i7" },
    });
  });
});
```

### Integration Testing

Setting up integration tests:

```typescript
// src/api/__tests__/custom-product.integration.ts
import { createServer } from "../../start-server";
import supertest from "supertest";
import { DataSource } from "typeorm";

describe("Custom Product API", () => {
  let app;
  let dbConnection: DataSource;

  beforeAll(async () => {
    const { app: express, dbConnection: connection } = await createServer();
    app = express;
    dbConnection = connection;
  });

  afterAll(async () => {
    await dbConnection.destroy();
  });

  it("should return configurable products", async () => {
    const response = await supertest(app)
      .get("/custom-products/configurable")
      .expect(200);

    expect(response.body).toHaveProperty("products");
    expect(Array.isArray(response.body.products)).toBe(true);
  });
});
```

## Performance Optimization

### Query Optimization

Optimizing database queries:

```typescript
// Efficient querying with relations
const products = await this.productRepository.find({
  where: { is_configurable: true },
  relations: ["variants", "options"],
  select: ["id", "title", "thumbnail"] // Only select needed fields
});

// Pagination
const [products, count] = await this.productRepository.findAndCount({
  where: { is_configurable: true },
  take: 20,
  skip: (page - 1) * 20,
  order: { created_at: "DESC" }
});
```

### Batch Processing

Handling large datasets with batch processing:

```typescript
// src/services/import.ts
import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";

@Service()
export class ImportService {
  constructor(private manager: EntityManager) {}

  async importProducts(products: any[]): Promise<void> {
    // Process in batches of 100
    const batchSize = 100;
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      await this.manager.transaction(async (transactionManager) => {
        for (const product of batch) {
          // Process each product in the batch
          // You would call repository methods here
        }
      });
    }
  }
}
```

These patterns and examples provide a foundation for developing the NET-BRIDGE backend using Medusa's architecture and best practices. 
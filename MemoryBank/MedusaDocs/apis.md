# Medusa APIs

This document provides an overview of Medusa's API structure and usage patterns, which will be essential for our NET-BRIDGE project implementation.

## API Overview

Medusa provides several API interfaces for different application contexts:

1. **Store API**: For storefront applications (what customers interact with)
2. **Admin API**: For admin dashboard (what merchants/administrators use)
3. **Custom APIs**: For extending functionality with your own endpoints

The APIs follow RESTful principles and provide comprehensive coverage of commerce functionality.

## API Authentication

### Store API Authentication

For customer-facing functionality:

```javascript
// Customer login
const response = await medusaClient.auth.authenticate({
  email: "customer@example.com",
  password: "secure_password"
})

// The cookie is automatically saved and used for future requests

// Get customer information
const { customer } = await medusaClient.customers.retrieve()
```

### Admin API Authentication

For admin functionality:

```javascript
// Admin login
const response = await medusaClient.admin.auth.login({
  email: "admin@example.com",
  password: "admin_password"
})

// The cookie is automatically saved and used for future requests

// Get admin user information
const { user } = await medusaClient.admin.users.retrieveUser()
```

### API Keys

For headless/server-to-server communication:

```javascript
// In server-side code
const Medusa = require("@medusajs/medusa-js")

const medusaClient = new Medusa({
  baseUrl: "https://your-medusa-server.com",
  maxRetries: 3,
  apiKey: "your_api_key_here"
})
```

## API Clients

### JavaScript Client

Medusa provides an official JavaScript client for easy API integration:

```javascript
// Client-side setup
import Medusa from "@medusajs/medusa-js"

const medusa = new Medusa({
  baseUrl: "https://your-medusa-server.com",
  maxRetries: 3
})
```

### REST API Direct Usage

You can also use the REST API directly with any HTTP client:

```javascript
// Using fetch API
const response = await fetch("https://your-medusa-server.com/store/products", {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  }
})

const { products } = await response.json()
```

## Store API Endpoints

### Products

```javascript
// List products
const { products, count } = await medusaClient.products.list()

// Get a specific product by ID
const { product } = await medusaClient.products.retrieve("prod_01FVYZ4S3JBFQPK5XR5XMC0NZ3")

// Search products
const { products } = await medusaClient.products.search({
  q: "laptop"
})

// List product variants
const { variants } = await medusaClient.variants.list()
```

### Cart and Checkout

```javascript
// Create a cart
const { cart } = await medusaClient.carts.create()

// Add items to cart
const { cart } = await medusaClient.carts.lineItems.create(cartId, {
  variant_id: "variant_01FVYZ5G0TV9T7NQVDWT3V1VT5",
  quantity: 1
})

// Update cart
const { cart } = await medusaClient.carts.update(cartId, {
  email: "customer@example.com"
})

// Add shipping method to cart
const { cart } = await medusaClient.carts.addShippingMethod(cartId, {
  option_id: "so_01FVYZ6WBY6MQNXVCHCFYYH3C5"
})

// Complete cart (create order)
const { data } = await medusaClient.carts.complete(cartId)
```

### Customers

```javascript
// Register a customer
const { customer } = await medusaClient.customers.create({
  email: "customer@example.com",
  password: "secure_password",
  first_name: "John",
  last_name: "Doe"
})

// Login a customer
const { customer } = await medusaClient.auth.authenticate({
  email: "customer@example.com",
  password: "secure_password"
})

// Update a customer
const { customer } = await medusaClient.customers.update({
  first_name: "Jane"
})

// Get customer orders
const { orders } = await medusaClient.customers.listOrders()
```

### Orders

```javascript
// Retrieve an order
const { order } = await medusaClient.orders.retrieve(orderId)

// Retrieve order by cart ID
const { order } = await medusaClient.orders.retrieveByCartId(cartId)

// List a customer's orders
const { orders } = await medusaClient.customers.listOrders()
```

## Admin API Endpoints

### Products Management

```javascript
// List products (admin)
const { products } = await medusaClient.admin.products.list()

// Create a product
const { product } = await medusaClient.admin.products.create({
  title: "Enterprise Server",
  description: "High-performance server for enterprise applications",
  options: [
    { title: "CPU" },
    { title: "RAM" },
    { title: "Storage" }
  ],
  variants: [
    {
      title: "Base Configuration",
      prices: [{ amount: 199900, currency_code: "usd" }],
      options: [
        { value: "Intel Xeon E5" },
        { value: "32GB" },
        { value: "1TB SSD" }
      ],
      inventory_quantity: 10
    }
  ]
})

// Update a product
const { product } = await medusaClient.admin.products.update(productId, {
  title: "Enterprise Server Pro"
})

// Delete a product
await medusaClient.admin.products.delete(productId)
```

### Orders Management

```javascript
// List orders (admin)
const { orders } = await medusaClient.admin.orders.list()

// Update an order
const { order } = await medusaClient.admin.orders.update(orderId, {
  email: "new-email@example.com"
})

// Create a fulfillment
const { order } = await medusaClient.admin.orders.createFulfillment(orderId, {
  items: [
    {
      item_id: "item_1234",
      quantity: 1
    }
  ]
})

// Create a shipment
const { order } = await medusaClient.admin.orders.createShipment(orderId, fulfillmentId, {
  tracking_numbers: ["tracking_1234"]
})
```

### Customers Management

```javascript
// List customers (admin)
const { customers } = await medusaClient.admin.customers.list()

// Get a specific customer
const { customer } = await medusaClient.admin.customers.retrieve(customerId)

// Update a customer
const { customer } = await medusaClient.admin.customers.update(customerId, {
  first_name: "Jane",
  last_name: "Smith"
})
```

## Custom API Development

For our NET-BRIDGE project, we'll need to create custom APIs to handle specialized functionality like configuration and quotation.

### Creating a Custom API Route

```typescript
// src/api/routes/store/quotations.ts
import { Router } from "express"
import { QuotationService } from "../../../services/quotation"

export default (router: Router) => {
  const quotationRouter = Router()
  router.use("/quotations", quotationRouter)

  // POST /store/quotations
  quotationRouter.post("/", async (req, res) => {
    const { cart_id, customer_info } = req.body
    
    try {
      const quotationService: QuotationService = req.scope.resolve("quotationService")
      
      const quotation = await quotationService.createQuotation(cart_id, customer_info)
      
      res.status(200).json({ quotation })
    } catch (error) {
      res.status(400).json({ 
        message: error.message,
        code: error.code
      })
    }
  })

  // GET /store/quotations/:id
  quotationRouter.get("/:id", async (req, res) => {
    try {
      const quotationService: QuotationService = req.scope.resolve("quotationService")
      
      const quotation = await quotationService.retrieveQuotation(req.params.id)
      
      res.status(200).json({ quotation })
    } catch (error) {
      res.status(404).json({ 
        message: error.message,
        code: error.code
      })
    }
  })

  return router
}
```

### Registering a Custom API Route

In your Medusa project, create a `src/api/index.ts` file:

```typescript
// src/api/index.ts
import { Router } from "express"
import cors from "cors"
import { ConfigModule } from "@medusajs/medusa"
import { getConfigFile } from "medusa-core-utils"
import quotationsRoutes from "./routes/store/quotations"

export default (rootDirectory: string, options: ConfigModule) => {
  const router = Router()
  
  const { configModule } = getConfigFile(rootDirectory, "medusa-config")
  const { projectConfig } = configModule
  
  // Set up CORS
  const storeCorsOptions = {
    origin: projectConfig.store_cors.split(","),
    credentials: true,
  }
  
  router.use(cors(storeCorsOptions))
  
  // Add routes
  quotationsRoutes(router)
  
  return router
}
```

### Using Custom API from the Frontend

```typescript
// In your frontend application
const createQuotation = async (cartId, customerInfo) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_URL}/store/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart_id: cartId,
        customer_info: customerInfo
      }),
      credentials: "include"
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create quotation")
    }
    
    return data.quotation
  } catch (error) {
    console.error("Error creating quotation:", error)
    throw error
  }
}
```

## API Error Handling

Medusa's API returns standardized error responses:

```typescript
// Example error response
{
  "type": "invalid_request_error",
  "message": "Product with id prod_xyz not found",
  "code": "not_found"
}
```

Implementing proper error handling in client code:

```typescript
try {
  const { product } = await medusaClient.products.retrieve(productId)
  // Process product data
} catch (error) {
  if (error.response) {
    // The request was made and the server responded with an error status
    console.error("API Error:", error.response.data.message)
    
    // Handle specific error codes
    if (error.response.data.code === "not_found") {
      // Handle not found case
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network Error:", error.request)
  } else {
    // Something happened in setting up the request
    console.error("Request Error:", error.message)
  }
}
```

## API Response Pagination

Medusa APIs that return lists support pagination:

```typescript
// Get paginated products
const { products, count, limit, offset } = await medusaClient.products.list({
  limit: 20,   // Number of items per page
  offset: 0    // Starting point
})

// Calculate total pages
const totalPages = Math.ceil(count / limit)

// Get next page
const { products: nextPage } = await medusaClient.products.list({
  limit: 20,
  offset: limit  // Offset by the limit to get the next page
})
```

## API Relations and Expansion

Medusa APIs support relations for expanding nested entities:

```typescript
// Get product with variants and options expanded
const { product } = await medusaClient.products.retrieve(productId, {
  relations: ["variants", "options", "tags", "type", "collection"]
})

// List orders with expanded items and customer
const { orders } = await medusaClient.admin.orders.list({
  relations: ["items", "customer", "shipping_methods"]
})
```

## API Customization for NET-BRIDGE

For our NET-BRIDGE project, we'll need several custom API endpoints:

### 1. Configuration API

For handling custom IT equipment configurations:

```typescript
// src/api/routes/store/configurations.ts
import { Router } from "express"

export default (router: Router) => {
  const configurationsRouter = Router()
  router.use("/configurations", configurationsRouter)

  // Validate compatibility
  configurationsRouter.post("/validate", async (req, res) => {
    const { product_id, configuration } = req.body
    
    const configService = req.scope.resolve("configurationService")
    
    try {
      const validationResult = await configService.validateConfiguration(
        product_id,
        configuration
      )
      
      res.json(validationResult)
    } catch (error) {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    }
  })

  // Calculate price
  configurationsRouter.post("/calculate-price", async (req, res) => {
    const { product_id, configuration } = req.body
    
    const configService = req.scope.resolve("configurationService")
    
    try {
      const priceResult = await configService.calculatePrice(
        product_id,
        configuration
      )
      
      res.json(priceResult)
    } catch (error) {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    }
  })

  return router
}
```

### 2. Quotation API

For creating and managing quotations:

```typescript
// src/api/routes/store/quotations.ts (extended version)
import { Router } from "express"

export default (router: Router) => {
  const quotationsRouter = Router()
  router.use("/quotations", quotationsRouter)

  // Create a quotation
  quotationsRouter.post("/", async (req, res) => {
    const { cart_id, customer_info } = req.body
    
    const quotationService = req.scope.resolve("quotationService")
    
    try {
      const quotation = await quotationService.createQuotation(
        cart_id,
        customer_info
      )
      
      res.json({ quotation })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    }
  })

  // Get a quotation
  quotationsRouter.get("/:id", async (req, res) => {
    const { id } = req.params
    
    const quotationService = req.scope.resolve("quotationService")
    
    try {
      const quotation = await quotationService.retrieveQuotation(id)
      
      res.json({ quotation })
    } catch (error) {
      res.status(404).json({
        message: error.message,
        code: error.code
      })
    }
  })

  // Generate PDF
  quotationsRouter.get("/:id/pdf", async (req, res) => {
    const { id } = req.params
    
    const quotationService = req.scope.resolve("quotationService")
    
    try {
      const pdfBuffer = await quotationService.generatePDF(id)
      
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quotation-${id}.pdf"`
      })
      
      res.send(pdfBuffer)
    } catch (error) {
      res.status(404).json({
        message: error.message,
        code: error.code
      })
    }
  })

  // Send quotation email
  quotationsRouter.post("/:id/send", async (req, res) => {
    const { id } = req.params
    const { email } = req.body
    
    const quotationService = req.scope.resolve("quotationService")
    
    try {
      await quotationService.sendQuotationEmail(id, email)
      
      res.json({ success: true })
    } catch (error) {
      res.status(400).json({
        message: error.message,
        code: error.code
      })
    }
  })

  return router
}
```

## API Security Considerations

When implementing custom APIs, consider these security best practices:

1. **Authentication**: Ensure endpoints are properly protected with authentication where needed
2. **Input Validation**: Always validate user input to prevent injection attacks
3. **Rate Limiting**: Implement rate limiting to prevent abuse
4. **CORS Configuration**: Set proper CORS headers for cross-origin requests
5. **Error Handling**: Don't leak sensitive information in error messages

Example of implementing these practices:

```typescript
// Input validation middleware
const validateQuotationInput = (req, res, next) => {
  const { cart_id, customer_info } = req.body
  
  if (!cart_id) {
    return res.status(400).json({
      message: "cart_id is required",
      code: "invalid_data"
    })
  }
  
  if (!customer_info || !customer_info.email) {
    return res.status(400).json({
      message: "customer_info with email is required",
      code: "invalid_data"
    })
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(customer_info.email)) {
    return res.status(400).json({
      message: "Invalid email format",
      code: "invalid_data"
    })
  }
  
  next()
}

// Apply middleware to route
quotationsRouter.post("/", validateQuotationInput, async (req, res) => {
  // Route handler code
})
```

## API Performance Optimization

For high-performance API endpoints:

1. **Query Optimization**: Use efficient database queries
2. **Caching**: Implement caching for frequently accessed data
3. **Pagination**: Always paginate list endpoints
4. **Selective Relations**: Only request relations you need
5. **Background Processing**: Use background jobs for heavy operations

Example of implementing caching:

```typescript
// src/services/cached-product.ts
import { Service } from "medusa-extender"
import { ProductService } from "@medusajs/medusa"
import { Redis } from "ioredis"

@Service()
export class CachedProductService extends ProductService {
  constructor(
    private readonly redis: Redis,
    // other dependencies
  ) {
    super(arguments)
  }

  async retrieve(productId: string, config = {}) {
    // Try to get from cache
    const cacheKey = `product:${productId}`
    const cached = await this.redis.get(cacheKey)
    
    if (cached) {
      return JSON.parse(cached)
    }
    
    // Get from database
    const product = await super.retrieve(productId, config)
    
    // Store in cache with 5 minute expiration
    await this.redis.set(cacheKey, JSON.stringify(product), "EX", 300)
    
    return product
  }
}
```

These API patterns and examples will be crucial for implementing the custom functionality required for our NET-BRIDGE project, particularly for the product configuration system and quotation generation features. 
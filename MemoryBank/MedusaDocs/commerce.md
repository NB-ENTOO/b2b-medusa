# Medusa Commerce Modules

This document provides an overview of Medusa's commerce modules that will be essential for our NET-BRIDGE project. Understanding these modules is critical for implementing the product catalog, configuration system, and quotation functionality.

## Product Module

The Product module is central to our IT equipment e-commerce platform, providing the foundation for managing product information and inventory.

### Key Entities

- **Product**: The main entity representing a product in the catalog
- **ProductVariant**: Different variants of a product (e.g., different configurations)
- **ProductOption**: Options that can be selected for a product (e.g., RAM, CPU)
- **ProductCollection**: Groups of related products (e.g., Server, Networking Equipment)
- **ProductCategory**: Hierarchical categorization of products
- **ProductType**: Classification of product types (e.g., Server, Router)
- **ProductTag**: Tags for filtering and organizing products

### Product Service Methods

```typescript
// Common product operations
import { ProductService } from "@medusajs/medusa"

// Injected into your custom service
constructor(private productService: ProductService) {}

// Retrieve a product by ID
const product = await this.productService.retrieve(id, {
  relations: ["variants", "options"]
})

// List products with filtering
const products = await this.productService.list(
  { title: "Server" },
  {
    relations: ["variants", "options"],
    take: 10,
    skip: 0
  }
)

// Create a product
const product = await this.productService.create({
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
      prices: [{ amount: 1999, currency_code: "usd" }],
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
await this.productService.update(id, {
  title: "Enterprise Server Pro"
})

// Delete a product
await this.productService.delete(id)
```

### Product Data Model

Simplified TypeScript interface for Product entity:

```typescript
interface Product {
  id: string
  title: string
  description: string
  handle: string
  thumbnail: string
  profile_id: string
  profile: ShippingProfile
  weight: number
  length: number
  height: number
  width: number
  hs_code: string
  origin_country: string
  mid_code: string
  material: string
  collection_id: string
  collection: ProductCollection
  type_id: string
  type: ProductType
  tags: ProductTag[]
  options: ProductOption[]
  variants: ProductVariant[]
  categories: ProductCategory[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  metadata: Record<string, unknown>
}
```

### Custom Product Fields

For our IT equipment platform, we'll need to extend the Product model with additional fields:

```typescript
// src/models/product.ts
import { Entity, Column } from "typeorm"
import { Product as MedusaProduct } from "@medusajs/medusa"

@Entity()
export class Product extends MedusaProduct {
  @Column({ type: "jsonb", nullable: true })
  technical_specifications: Record<string, any>
  
  @Column({ type: "jsonb", nullable: true })
  compatibility_rules: Record<string, any>
  
  @Column({ type: "boolean", default: false })
  is_configurable: boolean
  
  @Column({ type: "varchar", nullable: true })
  manufacturer: string
  
  @Column({ type: "varchar", nullable: true })
  warranty_info: string
  
  @Column({ type: "jsonb", nullable: true })
  benchmark_scores: Record<string, number>
}
```

## Cart and Checkout Modules

The Cart module manages the shopping cart and checkout process, which we'll adapt for our quotation system.

### Key Entities

- **Cart**: Represents a shopping cart or quotation cart
- **LineItem**: Items in the cart
- **ShippingMethod**: Shipping options for the cart
- **Discount**: Discounts applied to the cart
- **GiftCard**: Gift cards applied to the cart
- **PaymentSession**: Payment methods for the cart

### Cart Service Methods

```typescript
// Common cart operations
import { CartService } from "@medusajs/medusa"

// Injected into your custom service
constructor(private cartService: CartService) {}

// Create a new cart (or quotation cart)
const cart = await this.cartService.create({
  region_id,
  customer_id,
  metadata: { is_quotation: true }
})

// Retrieve a cart
const cart = await this.cartService.retrieve(id, {
  relations: ["items", "discounts"]
})

// Add items to a cart
await this.cartService.addLineItem(cartId, {
  variant_id,
  quantity: 1,
  metadata: { configuration: { cpu: "Intel i7", ram: "32GB" } }
})

// Update a line item
await this.cartService.updateLineItem(cartId, lineItemId, {
  quantity: 2
})

// Remove a line item
await this.cartService.removeLineItem(cartId, lineItemId)

// Add a shipping method
await this.cartService.addShippingMethod(cartId, {
  option_id,
  data: {}
})

// Convert to order (or quotation)
const order = await this.cartService.createOrder(cartId, { status: "quotation" })
```

### Cart Data Model

Simplified TypeScript interface for Cart entity:

```typescript
interface Cart {
  id: string
  customer_id: string
  customer: Customer
  email: string
  billing_address_id: string
  billing_address: Address
  shipping_address_id: string
  shipping_address: Address
  items: LineItem[]
  region_id: string
  region: Region
  discounts: Discount[]
  gift_cards: GiftCard[]
  shipping_methods: ShippingMethod[]
  payment_sessions: PaymentSession[]
  payment_id: string
  payment: Payment
  completed_at: Date
  created_at: Date
  updated_at: Date
  deleted_at: Date
  metadata: Record<string, unknown>
}
```

### Customizing the Cart for Quotations

We'll extend the Cart functionality for our quotation system:

```typescript
// src/services/quotation.ts
import { Service } from "medusa-extender"
import { CartService, OrderService } from "@medusajs/medusa"
import { EntityManager } from "typeorm"

@Service()
export class QuotationService {
  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private manager: EntityManager
  ) {}

  async createQuotationCart(customerId: string, regionId: string): Promise<any> {
    const cart = await this.cartService.create({
      customer_id: customerId,
      region_id: regionId,
      metadata: {
        is_quotation: true,
        quotation_expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    })
    
    return cart
  }

  async finalizeQuotation(cartId: string): Promise<any> {
    // Convert cart to order with quotation status
    const order = await this.cartService.createOrder(cartId, {
      status: "quotation",
      metadata: {
        quotation_number: `Q-${Date.now()}`,
        quotation_date: new Date(),
      },
    })
    
    // Generate PDF and send email
    // This would be implemented with a separate service
    
    return order
  }
}
```

## Pricing Module

The Pricing module handles pricing calculations, which is crucial for our real-time configuration pricing.

### Price Lists

Price lists allow flexible pricing strategies:

```typescript
// Create a price list for enterprise customers
import { PriceListService } from "@medusajs/medusa"

// Injected into your custom service
constructor(private priceListService: PriceListService) {}

// Create a price list
const priceList = await this.priceListService.create({
  name: "Enterprise Pricing",
  description: "Special pricing for enterprise customers",
  type: "sale",
  status: "active",
  customer_groups: [{ id: "enterprise_group_id" }],
  prices: [
    {
      variant_id,
      amount: 1799,
      currency_code: "usd",
      min_quantity: 10,
    },
  ],
})

// Apply a price to a product variant
await this.priceListService.addPrices(priceListId, [
  {
    variant_id,
    amount: 1699,
    currency_code: "usd",
    min_quantity: 20,
  },
])
```

### Custom Pricing Strategies

For our configuration system, we'll need a custom pricing strategy:

```typescript
// src/services/configurable-pricing.ts
import { Service } from "medusa-extender"
import { EntityManager } from "typeorm"

@Service()
export class ConfigurablePricingService {
  constructor(private manager: EntityManager) {}

  async calculateConfigurationPrice(
    baseVariantId: string,
    configuration: Record<string, any>
  ): Promise<number> {
    // Retrieve base price
    const baseVariant = await this.manager.findOne("product_variant", {
      where: { id: baseVariantId },
    })
    
    let basePrice = baseVariant.prices[0].amount
    
    // Calculate price based on configuration options
    let additionalPrice = 0
    
    // Example: calculate CPU upgrade price
    if (configuration.cpu === "Intel Xeon Platinum") {
      additionalPrice += 500
    } else if (configuration.cpu === "AMD EPYC") {
      additionalPrice += 400
    }
    
    // Example: calculate RAM upgrade price
    if (configuration.ram === "64GB") {
      additionalPrice += 200
    } else if (configuration.ram === "128GB") {
      additionalPrice += 500
    }
    
    // Example: calculate storage upgrade price
    if (configuration.storage === "2TB SSD") {
      additionalPrice += 300
    } else if (configuration.storage === "4TB SSD") {
      additionalPrice += 700
    }
    
    return basePrice + additionalPrice
  }
}
```

## Order Module

The Order module manages orders, which we'll adapt for our quotation system.

### Key Entities

- **Order**: The main entity representing an order or quotation
- **Fulfillment**: Shipment details for an order
- **Return**: Return information for an order
- **Swap**: Exchange of items in an order
- **Claim**: Claims for damaged or missing items

### Order Service Methods

```typescript
// Common order operations
import { OrderService } from "@medusajs/medusa"

// Injected into your custom service
constructor(private orderService: OrderService) {}

// Retrieve an order
const order = await this.orderService.retrieve(id, {
  relations: ["items", "customer"]
})

// List orders with filtering
const orders = await this.orderService.list(
  { status: ["completed"] },
  {
    relations: ["items"],
    take: 10,
    skip: 0
  }
)

// Update an order
await this.orderService.update(id, {
  email: "newemail@example.com"
})

// Archive an order
await this.orderService.archive(id)

// Create a fulfillment
await this.orderService.createFulfillment(id, [
  {
    item_id,
    quantity: 1
  }
])
```

### Order Data Model

Simplified TypeScript interface for Order entity:

```typescript
interface Order {
  id: string
  status: OrderStatus
  fulfillment_status: FulfillmentStatus
  payment_status: PaymentStatus
  display_id: number
  cart_id: string
  cart: Cart
  customer_id: string
  customer: Customer
  email: string
  billing_address_id: string
  billing_address: Address
  shipping_address_id: string
  shipping_address: Address
  items: LineItem[]
  region_id: string
  region: Region
  discounts: Discount[]
  gift_cards: GiftCard[]
  payments: Payment[]
  fulfillments: Fulfillment[]
  returns: Return[]
  claims: ClaimOrder[]
  refunds: Refund[]
  swaps: Swap[]
  shipping_methods: ShippingMethod[]
  created_at: Date
  updated_at: Date
  metadata: Record<string, unknown>
}
```

### Extending Orders for Quotations

We'll extend the Order system for our quotation functionality:

```typescript
// src/models/order.ts
import { Entity, Column } from "typeorm"
import { Order as MedusaOrder } from "@medusajs/medusa"

@Entity()
export class Order extends MedusaOrder {
  @Column({ type: "boolean", default: false })
  is_quotation: boolean
  
  @Column({ type: "varchar", nullable: true })
  quotation_number: string
  
  @Column({ type: "timestamp", nullable: true })
  quotation_expiry: Date
  
  @Column({ type: "varchar", nullable: true })
  quotation_status: string
  
  @Column({ type: "jsonb", nullable: true })
  configuration_details: Record<string, any>
}
```

## Customer Module

The Customer module manages customer information, which we'll adapt for B2B scenarios.

### Key Entities

- **Customer**: Represents a customer
- **CustomerGroup**: Groups for organizing customers (e.g., Enterprise, Government)
- **Address**: Customer addresses

### Customer Service Methods

```typescript
// Common customer operations
import { CustomerService } from "@medusajs/medusa"

// Injected into your custom service
constructor(private customerService: CustomerService) {}

// Create a customer
const customer = await this.customerService.create({
  email: "customer@example.com",
  first_name: "John",
  last_name: "Doe",
  password: "secure_password",
  metadata: { company: "Acme Inc" }
})

// Retrieve a customer
const customer = await this.customerService.retrieve(id, {
  relations: ["orders"]
})

// List customers with filtering
const customers = await this.customerService.list(
  { email: "customer@example.com" },
  {
    relations: ["groups"],
    take: 10,
    skip: 0
  }
)

// Update a customer
await this.customerService.update(id, {
  first_name: "Jane"
})

// Add to customer group
await this.customerService.addToGroup(customerId, customerGroupId)
```

### Customer Data Model

Simplified TypeScript interface for Customer entity:

```typescript
interface Customer {
  id: string
  email: string
  first_name: string
  last_name: string
  billing_address_id: string
  billing_address: Address
  shipping_addresses: Address[]
  phone: string
  has_account: boolean
  orders: Order[]
  groups: CustomerGroup[]
  created_at: Date
  updated_at: Date
  deleted_at: Date
  metadata: Record<string, unknown>
}
```

### Extending Customers for B2B

For our B2B platform, we'll extend the Customer model with business information:

```typescript
// src/models/customer.ts
import { Entity, Column } from "typeorm"
import { Customer as MedusaCustomer } from "@medusajs/medusa"

@Entity()
export class Customer extends MedusaCustomer {
  @Column({ type: "varchar", nullable: true })
  company_name: string
  
  @Column({ type: "varchar", nullable: true })
  company_registration_number: string
  
  @Column({ type: "varchar", nullable: true })
  tax_id: string
  
  @Column({ type: "varchar", nullable: true })
  industry: string
  
  @Column({ type: "varchar", nullable: true })
  position: string
  
  @Column({ type: "jsonb", nullable: true })
  company_address: Record<string, any>
  
  @Column({ type: "varchar", nullable: true })
  account_manager: string
  
  @Column({ type: "varchar", nullable: true })
  credit_limit: string
  
  @Column({ type: "varchar", nullable: true })
  payment_terms: string
}
```

## These modules and their customizations provide the foundation for our NET-BRIDGE project, enabling us to build a robust IT equipment e-commerce platform with custom configuration and quotation functionality. 
# Medusa Frontend Development

This document covers frontend development for Medusa-based applications, with a focus on Next.js storefront development for our NET-BRIDGE project.

## Frontend Architecture

Medusa follows a headless architecture, allowing for flexible frontend implementations:

```
┌─────────────────────────────────────────────────────────┐
│                 FRONTEND APPLICATIONS                    │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │   Next.js   │  │    React    │  │     Custom      │  │
│  │  Storefront │  │     SPA     │  │   Applications  │  │
│  └─────────────┘  └─────────────┘  └─────────────────┘  │
│           │              │                 │            │
└───────────┼──────────────┼─────────────────┼────────────┘
            │              │                 │
            │              │                 │
            │              ▼                 │
            │     ┌─────────────────┐        │
            │     │     REST API    │        │
            └────▶│    Interface    │◀───────┘
                  └─────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  Medusa Server  │
                  └─────────────────┘
```

### Recommended Frontend Options

1. **Next.js Storefront** (recommended for NET-BRIDGE): 
   - Server-side rendering for SEO
   - Built-in TypeScript support
   - Easy API routes
   - Optimized for performance

2. **React SPA**: 
   - Client-side rendering
   - Suitable for dashboard-like interfaces
   - More flexibility in routing and state management

3. **Mobile Apps**:
   - React Native for cross-platform mobile
   - Native iOS/Android with API integration

## Next.js Storefront

### Installation and Setup

Starting a new Next.js project for Medusa:

```bash
# Create Next.js app with TypeScript
npx create-next-app@latest --typescript my-medusa-storefront

# Navigate to project
cd my-medusa-storefront

# Install Medusa JS client
npm install @medusajs/medusa-js
```

### Project Structure

A typical Next.js storefront for Medusa has the following structure:

```
my-medusa-storefront/
├── pages/                  # Route components
│   ├── index.tsx           # Home page
│   ├── products/           # Product routes
│   │   ├── index.tsx       # Products list
│   │   └── [handle].tsx    # Product details
│   ├── cart.tsx            # Cart page
│   ├── checkout.tsx        # Checkout flow
│   ├── account/            # Customer account
│   └── api/                # API routes
├── components/             # Reusable components
│   ├── layout/             # Layout components
│   ├── products/           # Product components
│   ├── cart/               # Cart components
│   └── checkout/           # Checkout components
├── lib/                    # Utilities and services
│   ├── medusa.ts           # Medusa client
│   ├── context/            # React context
│   └── hooks/              # Custom hooks
├── styles/                 # CSS and styling
├── public/                 # Static assets
├── next.config.js          # Next.js config
└── package.json            # Dependencies
```

### Medusa Client Setup

Setting up the Medusa client for API communication:

```typescript
// lib/medusa.ts
import Medusa from "@medusajs/medusa-js"

// Initialize the Medusa client
const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export const medusaClient = new Medusa({ 
  baseUrl: medusaUrl,
  maxRetries: 3
})
```

### API Communication Pattern

Fetching data from the Medusa server:

```typescript
// lib/hooks/use-products.ts
import { useEffect, useState } from "react"
import { medusaClient } from "../medusa"

export const useProducts = (options = {}) => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const { products } = await medusaClient.products.list(options)
        setProducts(products)
      } catch (err) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [options])

  return { products, isLoading, error }
}
```

### Server-Side Rendering (SSR)

Implementing server-side rendering for products:

```typescript
// pages/products/[handle].tsx
import { GetServerSideProps } from "next"
import { medusaClient } from "../../lib/medusa"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { handle } = context.params
  
  try {
    const { product } = await medusaClient.products.retrieve(handle as string)
    
    return {
      props: {
        product,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default function ProductPage({ product }) {
  // Render product details
  return (
    <div>
      <h1>{product.title}</h1>
      <p>{product.description}</p>
      {/* More product details */}
    </div>
  )
}
```

### Static Site Generation (SSG)

Using static generation for faster page loads:

```typescript
// pages/products/[handle].tsx
import { GetStaticProps, GetStaticPaths } from "next"
import { medusaClient } from "../../lib/medusa"

export const getStaticPaths: GetStaticPaths = async () => {
  const { products } = await medusaClient.products.list({ limit: 100 })
  
  return {
    paths: products.map((product) => ({ params: { handle: product.handle } })),
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { handle } = context.params
  
  try {
    const { product } = await medusaClient.products.retrieve(handle as string)
    
    return {
      props: {
        product,
      },
      revalidate: 60, // Revalidate every 60 seconds
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default function ProductPage({ product }) {
  // Render product details
}
```

## Cart and Checkout Flow

### Cart Management

Setting up a cart context for global state:

```typescript
// lib/context/cart-context.tsx
import { createContext, useContext, useReducer, useEffect } from "react"
import { medusaClient } from "../medusa"

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cart: action.payload }
    case "LOADING":
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    cart: null,
    loading: false,
  })

  const createCart = async () => {
    dispatch({ type: "LOADING", payload: true })
    
    try {
      const { cart } = await medusaClient.carts.create()
      
      localStorage.setItem("cart_id", cart.id)
      dispatch({ type: "SET_CART", payload: cart })
    } catch (error) {
      console.error(error)
    } finally {
      dispatch({ type: "LOADING", payload: false })
    }
  }

  const getCart = async () => {
    const cartId = localStorage.getItem("cart_id")
    
    if (!cartId) return createCart()
    
    dispatch({ type: "LOADING", payload: true })
    
    try {
      const { cart } = await medusaClient.carts.retrieve(cartId)
      
      dispatch({ type: "SET_CART", payload: cart })
    } catch (error) {
      console.error(error)
      localStorage.removeItem("cart_id")
      createCart()
    } finally {
      dispatch({ type: "LOADING", payload: false })
    }
  }

  const addItem = async (variantId, quantity = 1) => {
    dispatch({ type: "LOADING", payload: true })
    
    try {
      const { cart } = await medusaClient.carts.lineItems.create(state.cart.id, {
        variant_id: variantId,
        quantity,
      })
      
      dispatch({ type: "SET_CART", payload: cart })
    } catch (error) {
      console.error(error)
    } finally {
      dispatch({ type: "LOADING", payload: false })
    }
  }

  useEffect(() => {
    getCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        ...state,
        createCart,
        getCart,
        addItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider")
  }
  
  return context
}
```

### Product Card Component

Example of a product card component:

```tsx
// components/products/ProductCard.tsx
import Image from "next/image"
import Link from "next/link"
import { useCart } from "../../lib/context/cart-context"

export const ProductCard = ({ product }) => {
  const { addItem, loading } = useCart()
  
  // Get the default variant
  const variant = product.variants[0]
  
  const handleAddToCart = () => {
    addItem(variant.id)
  }
  
  return (
    <div className="product-card">
      <Link href={`/products/${product.handle}`}>
        <a>
          <div className="product-image">
            {product.thumbnail && (
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={300}
                height={300}
                objectFit="cover"
              />
            )}
          </div>
          <h3 className="product-title">{product.title}</h3>
        </a>
      </Link>
      <div className="product-price">
        {variant.prices[0].currency_code.toUpperCase()} {variant.prices[0].amount / 100}
      </div>
      <button 
        className="add-to-cart-button"
        onClick={handleAddToCart}
        disabled={loading}
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
    </div>
  )
}
```

### Cart Page

Implementing a cart page:

```tsx
// pages/cart.tsx
import { useCart } from "../lib/context/cart-context"

export default function CartPage() {
  const { cart, loading } = useCart()
  
  if (loading) {
    return <div>Loading cart...</div>
  }
  
  if (!cart || !cart.items.length) {
    return <div>Your cart is empty</div>
  }
  
  return (
    <div>
      <h1>Shopping Cart</h1>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.id} className="cart-item">
            <div className="item-details">
              <h3>{item.title}</h3>
              <p>Quantity: {item.quantity}</p>
              <p>Price: {item.unit_price / 100}</p>
              <p>Total: {item.total / 100}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Summary</h3>
        <p>Subtotal: {cart.subtotal / 100}</p>
        <p>Total: {cart.total / 100}</p>
        <button>Proceed to Checkout</button>
      </div>
    </div>
  )
}
```

## Responsive Design Implementation

### Mobile-First Approach

Implementing responsive design with mobile-first CSS:

```css
/* styles/globals.css */
/* Base styles (mobile first) */
.product-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.product-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Tablet styles */
@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

### Responsive Layout Component

Creating a responsive layout component:

```tsx
// components/layout/Layout.tsx
import { useState } from "react"
import Head from "next/head"
import Link from "next/link"
import { useCart } from "../../lib/context/cart-context"

export const Layout = ({ children, title = "NET-BRIDGE" }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { cart } = useCart()
  
  const cartItemCount = cart?.items?.length || 0
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="site-container">
        <header className="site-header">
          <div className="header-content">
            <Link href="/">
              <a className="logo">NET-BRIDGE</a>
            </Link>
            
            <button 
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? "Close" : "Menu"}
            </button>
            
            <nav className={`main-nav ${mobileMenuOpen ? "open" : ""}`}>
              <ul>
                <li><Link href="/"><a>Home</a></Link></li>
                <li><Link href="/products"><a>Products</a></Link></li>
                <li><Link href="/configure"><a>Configure</a></Link></li>
                <li><Link href="/cart"><a>Cart ({cartItemCount})</a></Link></li>
                <li><Link href="/account"><a>Account</a></Link></li>
              </ul>
            </nav>
          </div>
        </header>
        
        <main className="site-main">
          {children}
        </main>
        
        <footer className="site-footer">
          <div className="footer-content">
            <p>&copy; {new Date().getFullYear()} NET-BRIDGE. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </>
  )
}
```

## Configuration Interface

For our NET-BRIDGE platform, we'll need a custom product configuration interface:

```tsx
// pages/configure/[id].tsx
import { useState, useEffect } from "react"
import { GetServerSideProps } from "next"
import { medusaClient } from "../../lib/medusa"
import { useCart } from "../../lib/context/cart-context"

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params
  
  try {
    const { product } = await medusaClient.products.retrieve(id as string)
    
    return {
      props: {
        product,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

export default function ConfigurePage({ product }) {
  const { addItem, loading } = useCart()
  const [configuration, setConfiguration] = useState({
    cpu: product.metadata?.default_cpu || "",
    memory: product.metadata?.default_memory || "",
    storage: product.metadata?.default_storage || "",
  })
  const [totalPrice, setTotalPrice] = useState(0)
  
  // Options for configuration
  const cpuOptions = product.metadata?.cpu_options || []
  const memoryOptions = product.metadata?.memory_options || []
  const storageOptions = product.metadata?.storage_options || []
  
  // Calculate total price based on configuration
  useEffect(() => {
    // Base price from the default variant
    let price = product.variants[0].prices[0].amount
    
    // Add additional costs based on configuration
    cpuOptions.forEach(option => {
      if (option.value === configuration.cpu) {
        price += option.price_adjustment || 0
      }
    })
    
    memoryOptions.forEach(option => {
      if (option.value === configuration.memory) {
        price += option.price_adjustment || 0
      }
    })
    
    storageOptions.forEach(option => {
      if (option.value === configuration.storage) {
        price += option.price_adjustment || 0
      }
    })
    
    setTotalPrice(price / 100)
  }, [configuration, product, cpuOptions, memoryOptions, storageOptions])
  
  const handleConfigurationChange = (e) => {
    const { name, value } = e.target
    
    setConfiguration(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleAddToCart = () => {
    // Add the default variant with configuration metadata
    addItem(product.variants[0].id, 1, {
      configuration
    })
  }
  
  return (
    <div className="configure-page">
      <h1>Configure Your {product.title}</h1>
      
      <div className="configuration-form">
        <div className="form-group">
          <label htmlFor="cpu">Processor (CPU)</label>
          <select 
            id="cpu"
            name="cpu"
            value={configuration.cpu}
            onChange={handleConfigurationChange}
          >
            {cpuOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.price_adjustment > 0 && `(+$${option.price_adjustment / 100})`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="memory">Memory (RAM)</label>
          <select 
            id="memory"
            name="memory"
            value={configuration.memory}
            onChange={handleConfigurationChange}
          >
            {memoryOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.price_adjustment > 0 && `(+$${option.price_adjustment / 100})`}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="storage">Storage</label>
          <select 
            id="storage"
            name="storage"
            value={configuration.storage}
            onChange={handleConfigurationChange}
          >
            {storageOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label} {option.price_adjustment > 0 && `(+$${option.price_adjustment / 100})`}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="configuration-summary">
        <h3>Configuration Summary</h3>
        <ul>
          <li>Processor: {configuration.cpu}</li>
          <li>Memory: {configuration.memory}</li>
          <li>Storage: {configuration.storage}</li>
        </ul>
        <div className="total-price">
          <strong>Total Price: ${totalPrice.toFixed(2)}</strong>
        </div>
        <button 
          className="add-to-cart-button"
          onClick={handleAddToCart}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  )
}
```

## Quotation System UI

Implementing the quotation system UI for NET-BRIDGE:

```tsx
// pages/request-quote.tsx
import { useState } from "react"
import { useCart } from "../lib/context/cart-context"
import { medusaClient } from "../lib/medusa"

export default function RequestQuotePage() {
  const { cart } = useCart()
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    notes: ""
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmitQuoteRequest = async (e) => {
    e.preventDefault()
    
    if (!cart?.id) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Using custom API route to handle quotation creation
      const response = await fetch("/api/quotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          cart_id: cart.id,
          customer_info: customerInfo
        })
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to create quotation")
      }
      
      setSuccess(true)
      
      // Clear the cart after successful quotation
      localStorage.removeItem("cart_id")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  if (success) {
    return (
      <div className="quotation-success">
        <h1>Quotation Request Submitted</h1>
        <p>Thank you for your quotation request. Our team will review your configuration and send you a detailed quotation shortly.</p>
        <p>A confirmation email has been sent to {customerInfo.email}.</p>
      </div>
    )
  }
  
  if (!cart || !cart.items.length) {
    return (
      <div>
        <h1>Request a Quotation</h1>
        <p>Your cart is empty. Please add items to your cart to request a quotation.</p>
      </div>
    )
  }
  
  return (
    <div className="quotation-page">
      <h1>Request a Quotation</h1>
      
      <div className="quotation-container">
        <div className="cart-summary">
          <h2>Configuration Summary</h2>
          <ul className="cart-items">
            {cart.items.map((item) => (
              <li key={item.id} className="cart-item">
                <h3>{item.title}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Configuration:</p>
                <ul className="configuration-details">
                  {item.metadata?.configuration && Object.entries(item.metadata.configuration).map(([key, value]) => (
                    <li key={key}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
                <p>Price: ${item.unit_price / 100}</p>
              </li>
            ))}
          </ul>
          <div className="cart-totals">
            <p>Subtotal: ${cart.subtotal / 100}</p>
            <p>Total: ${cart.total / 100}</p>
          </div>
        </div>
        
        <div className="customer-information">
          <h2>Customer Information</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmitQuoteRequest}>
            <div className="form-group">
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="company">Company Name *</label>
              <input
                type="text"
                id="company"
                name="company"
                value={customerInfo.company}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Additional Notes</label>
              <textarea
                id="notes"
                name="notes"
                value={customerInfo.notes}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Request Quotation"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
```

## Custom API Routes

Implementing a quotation API route in Next.js:

```typescript
// pages/api/quotations.ts
import type { NextApiRequest, NextApiResponse } from "next"
import { medusaClient } from "../../lib/medusa"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }
  
  const { cart_id, customer_info } = req.body
  
  if (!cart_id || !customer_info) {
    return res.status(400).json({ message: "Missing required fields" })
  }
  
  try {
    // Call custom endpoint on the Medusa server
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/quotations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart_id,
        customer_info
      })
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || "Failed to create quotation")
    }
    
    res.status(200).json(data)
  } catch (error) {
    console.error("Error creating quotation:", error)
    res.status(500).json({ message: "Failed to create quotation" })
  }
}
```

## Performance Optimization

### Next.js Image Optimization

Using Next.js Image component for optimized images:

```tsx
// components/products/ProductImage.tsx
import Image from "next/image"

export const ProductImage = ({ product }) => {
  if (!product.thumbnail) {
    return (
      <div className="product-image-placeholder" />
    )
  }
  
  return (
    <div className="product-image">
      <Image
        src={product.thumbnail}
        alt={product.title}
        width={600}
        height={600}
        layout="responsive"
        quality={85}
        priority={false}
        loading="lazy"
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
      />
    </div>
  )
}
```

### Data Fetching Optimization

Optimizing data fetching with SWR:

```tsx
// lib/hooks/use-product.ts
import useSWR from "swr"
import { medusaClient } from "../medusa"

const fetcher = async (url) => {
  const id = url.split("/").pop()
  const { product } = await medusaClient.products.retrieve(id)
  return product
}

export const useProduct = (id) => {
  const { data, error } = useSWR(`/products/${id}`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  })
  
  return {
    product: data,
    isLoading: !error && !data,
    isError: error,
  }
}
```

## Testing Frontend Components

### Unit Testing with Jest

Setting up unit tests for components:

```tsx
// components/products/__tests__/ProductCard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react"
import { ProductCard } from "../ProductCard"
import { CartProvider } from "../../../lib/context/cart-context"

// Mock the addItem function
const mockAddItem = jest.fn()

// Mock the useCart hook
jest.mock("../../../lib/context/cart-context", () => ({
  ...jest.requireActual("../../../lib/context/cart-context"),
  useCart: () => ({
    addItem: mockAddItem,
    loading: false,
  }),
}))

describe("ProductCard", () => {
  const mockProduct = {
    id: "prod_123",
    title: "Test Product",
    description: "Test Description",
    handle: "test-product",
    thumbnail: "/test-image.jpg",
    variants: [
      {
        id: "variant_123",
        prices: [{ amount: 1000, currency_code: "usd" }],
      },
    ],
  }
  
  it("renders the product title", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Test Product")).toBeInTheDocument()
  })
  
  it("renders the product price", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("USD 10")).toBeInTheDocument()
  })
  
  it("adds the product to cart when button is clicked", () => {
    render(<ProductCard product={mockProduct} />)
    
    const button = screen.getByText("Add to Cart")
    fireEvent.click(button)
    
    expect(mockAddItem).toHaveBeenCalledWith("variant_123")
  })
})
```

### Integration Testing

Integration testing for pages:

```tsx
// pages/__tests__/products.test.tsx
import { render, screen, waitFor } from "@testing-library/react"
import ProductsPage from "../products"

// Mock the medusaClient
jest.mock("../../lib/medusa", () => ({
  medusaClient: {
    products: {
      list: jest.fn().mockResolvedValue({
        products: [
          {
            id: "prod_123",
            title: "Test Product",
            description: "Test Description",
            handle: "test-product",
            thumbnail: "/test-image.jpg",
            variants: [
              {
                id: "variant_123",
                prices: [{ amount: 1000, currency_code: "usd" }],
              },
            ],
          },
        ],
      }),
    },
  },
}))

describe("ProductsPage", () => {
  it("renders a list of products", async () => {
    render(<ProductsPage />)
    
    expect(screen.getByText("Loading products...")).toBeInTheDocument()
    
    await waitFor(() => {
      expect(screen.getByText("Test Product")).toBeInTheDocument()
    })
  })
})
```

This frontend documentation provides a comprehensive guide for developing the Next.js storefront for our NET-BRIDGE project, focusing on the product catalog, custom configuration interface, and quotation system required for our IT equipment e-commerce platform. 
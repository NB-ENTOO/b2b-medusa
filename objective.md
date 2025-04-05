NET-BRIDGE E-commerce Platform Project Instructions
Project Context and Goals
NET-BRIDGE is an enterprise-grade IT equipment e-commerce platform designed for IT solutions providers who sell enterprise equipment such as servers, storage, networking devices, and components. The client is an IT solutions provider who wants to modernize their online presence with a platform that focuses on custom configuration capabilities and quotation generation rather than traditional checkout.
Client Requirements
The client has specifically requested:
A platform that replicates the functionality of ETB Tech (https://www.etb-tech.com/) but with a modernized UI
The UI should be based on the Medusa B2B Starter Template (https://medusa-b2b-starter.vercel.app/dk)
The platform must be mobile-optimized, which is a limitation of the current ETB Tech website
No payment processing or checkout feature is needed - instead, the platform should generate PDF quotations
Quotations should be sent directly to the sales team email
The platform must run on Docker for local hosting on the client's own infrastructure
All application components must use the latest stable versions
Business Goals
Provide enterprise customers with a modern, user-friendly platform to browse and configure IT equipment
Streamline the quotation process for both customers and the sales team
Showcase detailed product specifications and configuration options
Enable customers to compare products and make informed decisions
Present the client as a professional, modern IT solutions provider
ETB Tech Website Analysis - Detailed Features
Navigation and Structure
Top Navigation Bar
Logo on the left
Search bar in the center
Contact information and cart icon on the right
Sticky navigation that remains visible when scrolling
Main Category Navigation
Servers (Dell, HP, Lenovo subcategories)
Storage (Dell EMC, NetApp, HPE subcategories)
Networking (Cisco, Juniper, Arista subcategories)
Components (CPUs, Memory, Storage Drives subcategories)
Solutions (Pre-configured bundles)
Dropdown menus for each category with featured products
Footer
Company information
Contact details
Social media links
Newsletter signup
Payment methods accepted
Trust badges and certifications
Product Listing Pages
Filtering System
Left sidebar with collapsible filter categories
Filter by brand (Dell, HP, Lenovo, etc.)
Filter by product family (PowerEdge, ProLiant, etc.)
Filter by technical specifications (CPU, RAM, Storage)
Filter by condition (New, Refurbished)
Filter by warranty options
Price range slider
Product Cards
Product image
Model number prominently displayed
Key specifications in bullet points (e.g., "2x Intel Xeon, 64GB RAM, 4x 600GB SAS")
Price displayed with "From" for configurable products
"Configure" and "Add to Cart" buttons
Stock availability indicator
Quick view option
Sorting Options
Sort by price (low to high, high to low)
Sort by name
Sort by popularity
Sort by newest arrivals
Product Detail Pages
Product Images
Multiple high-quality images
Image zoom functionality
Gallery view with thumbnails
360-degree view for some products
Product Information
Detailed product title with model number
Comprehensive specifications in tabbed format
Technical specifications table
Warranty information
Delivery information
Stock availability
SKU/Product code
Pricing Section
Base price clearly displayed
Quantity selector
"Configure" button for customizable products
"Add to Cart" button
"Request Quote" option
Product Tabs
Overview tab with product description
Specifications tab with detailed technical information
Downloads tab with datasheets and manuals
Reviews tab with customer feedback
FAQ tab with common questions
Related Products
Similar products carousel
Recently viewed products
"Customers also bought" section
Custom Configuration System
Multi-step Configuration Process
Step 1: Base configuration selection
Step 2: Processor options
Step 3: Memory configuration
Step 4: Storage options
Step 5: RAID configuration
Step 6: Network options
Step 7: Additional components
Step 8: Warranty options
Configuration Interface
Real-time price updates as options are selected
Price breakdown showing individual component costs
Compatibility checking between components
Visual indicators for recommended options
Reset configuration button
Save configuration option
Configuration Summary
Complete list of selected components
Individual component prices
Total configuration price
Option to print or save configuration
"Add to Cart" and "Request Quote" buttons
Quote Cart System
Cart Interface
List of added products with images
Configuration details for each product
Quantity adjusters
Individual and total prices
Remove item functionality
"Continue Shopping" button
"Request Quotation" button
Quotation Request Form
Company information fields
Contact person details
Delivery address
Billing address
Special requirements or notes
Preferred contact method
Terms and conditions acceptance
Technical Features
Search Functionality
Predictive search with suggestions
Search filters by category
Search results with product images and key specs
Highlighted search terms in results
Product Comparison
Side-by-side comparison of up to 4 products
Highlight differences between products
Printable comparison view
Add to cart directly from comparison
Account Features
Save configurations for later
View past quotations
Quick reorder functionality
Address book management
Mobile Experience (Limited on ETB)
Non-responsive design (to be improved in NET-BRIDGE)
Limited mobile navigation
Difficult configuration process on small screens
Medusa B2B Starter Template Features
Modern UI Design
Clean, minimalist aesthetic
Consistent color scheme and typography
Ample white space for readability
Responsive design for all screen sizes
Navigation
Hamburger menu for mobile
Mega menu for desktop
Breadcrumb navigation
Sticky header
Component Library
Custom buttons and form elements
Card components
Modal dialogs
Toast notifications
Responsive Layouts
Mobile-first approach
Flexible grid system
Adaptive typography
Touch-friendly interface elements
Technology Stack
Backend: Medusa.js 2.6.1 (latest stable version)
Frontend: Next.js 14
Admin Panel: Medusa Admin
Database: PostgreSQL
Caching: Redis
Containerization: Docker and Docker Compose
PDF Generation: PDFKit
Email: Nodemailer
Key Requirements
Product Catalog
Replicate ETB Tech's product categories: Servers, Storage, Networking, Components
Implement the same filtering options and specifications as ETB Tech
Create comprehensive seed data with real product information
Ensure detailed product specifications and images
Custom Configuration
Allow users to configure products with real-time price updates
Provide breakdown pricing for each component selection
Implement compatibility rules between components
Support the same configuration options as ETB Tech
Quotation System
Replace traditional checkout with a quotation system
Generate professional PDF quotations with product details
Send quotations directly to the sales team email
Collect customer information at the end of the quotation process
User Interface
Modernize the ETB Tech interface using the Medusa B2B Starter styling
Ensure full mobile responsiveness (ETB Tech's site lacks this)
Maintain the same functionality but with improved UI/UX
Implement product comparison features
Deployment
Create a Docker-based deployment for local hosting
Support running on the client's own compute storage and public IPs
Provide comprehensive deployment documentation
Include all necessary configuration files and scripts
Non-Requirements
No payment processing or checkout functionality
No user authentication system for customers (only admin authentication)
No third-party hosting or cloud services
Implementation Details
Data Models
Product Model
Basic information (name, description, images)
Technical specifications (processor, memory, storage, etc.)
Configuration options
Compatibility rules
Pricing information
Category Model
Hierarchical structure (main categories and subcategories)
Category-specific attributes
Filtering options
Configuration Model
Component options
Pricing rules
Compatibility constraints
Default configurations
Quotation Model
Customer information
Configured products
Pricing details
Status tracking
PDF generation
API Endpoints
Product listing and filtering
Product detail retrieval
Configuration management
Quote cart operations
Quotation generation and email sending
Frontend Components
Responsive header and navigation
Product listing with filters
Product detail with specifications
Product configurator with real-time pricing
Quote cart management
Quotation form and viewer
Docker Configuration
Multi-container setup with Docker Compose
PostgreSQL database container
Redis cache container
Medusa backend container
Next.js frontend container
Admin panel container
Volume mounts for data persistence
Network configuration for inter-service communication
Project Structure
net-bridge/
├── backend/                 # Medusa.js backend
│   ├── src/
│   │   ├── api/             # API routes
│   │   ├── models/          # Data models
│   │   ├── services/        # Business logic
│   │   ├── migrations/      # Database migrations
│   │   └── seed/            # Seed data
│   ├── Dockerfile
│   └── package.json         # Using Medusa.js 2.6.1
├── frontend/                # Next.js storefront
│   ├── components/          # UI components
│   ├── pages/               # Next.js pages
│   ├── Dockerfile
│   └── package.json
├── admin/                   # Medusa Admin panel
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Development environment
├── docker-compose.production.yml  # Production environment
├── deploy.sh                # Deployment script
├── .env                     # Environment variables
├── README.md                # Project overview
├── DEPLOYMENT.md            # Deployment instructions
└── FEATURES.md              # Feature documentation
Development Workflow
Setup Phase
Create Docker development environment
Configure Medusa.js with PostgreSQL
Set up frontend with Next.js
Configure admin panel
Implementation Phase
Create data models and database migrations
Implement product catalog and listing
Develop custom configuration feature
Create PDF quotation generation
Implement responsive mobile UI
Deployment Phase
Create production Docker configuration
Document deployment process
Create deployment script
Test deployment on local infrastructure
Testing Phase
Perform end-to-end testing
Verify mobile responsiveness
Test PDF generation and email sending
Validate Docker deployment
Deployment Instructions
Install Docker and Docker Compose
Clone the repository
Configure environment variables in .env file
Run the deployment script: ./deploy.sh
Access the platform:
Storefront: http://localhost:8000
Admin Panel: http://localhost:7000
Backend API: http://localhost:9000
Testing Checklist
Verify all services are running
Test product browsing and filtering
Test product configuration with various options
Add configured products to quote cart
Generate quotations with customer information
Verify PDF generation and email sending
Test admin panel functionality
Verify mobile responsiveness on various devices
Docker Deployment Notes
The Dockerfiles are configured to use Node.js 20-alpine for optimal performance and small image size
The yarn install --no-lockfile command is used to avoid issues with missing yarn.lock files
Environment variables are passed through docker-compose.yml to configure services
Volume mounts are used for database persistence
Health checks ensure services start in the correct order
The deployment script includes error handling and validation
Additional Notes
The platform is designed to run entirely on the client's local infrastructure
No payment processing is implemented as per requirements
The focus is on generating quotations rather than completing transactions
The UI is modernized while maintaining all the functionality of ETB Tech
All Docker configurations are designed for local deployment
For Cursor AI Implementation
Technical Implementation Guidance
Medusa.js Backend Implementation
Custom Entity Extensions
typescript
// Example of extending the Product entity in Medusa
import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Product as MedusaProduct } from "@medusajs/medusa";

@Entity() 
export class ProductSpecification extends MedusaProduct {
  @Column({ type: "jsonb", nullable: true })
  technical_specs: Record<string, any>;
  
  @Column({ type: "jsonb", nullable: true })
  configuration_options: Record<string, any>;
  
  @Column({ type: "jsonb", nullable: true })
  compatibility_rules: Record<string, any>;
}
Custom API Routes
typescript
// Example of a custom API route for product configuration
import { Router } from "express";
import { ConfigurationService } from "../services/configuration";

export default (router: Router) => {
  const configRouter = Router();
  router.use("/configurations", configRouter);
  
  configRouter.get("/:productId", async (req, res) => {
    const configService: ConfigurationService = req.scope.resolve("configurationService");
    const { productId } = req.params;
    
    const config = await configService.getProductConfiguration(productId);
    res.json({ configuration: config });
  });
  
  // Additional routes for saving configurations, calculating prices, etc.
};
Custom Services
typescript
// Example of a custom service for quotation generation
import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";
import PDFDocument from "pdfkit";
import fs from "fs";

@Service()
export class QuotationService {
  constructor(
    private readonly manager: EntityManager,
    private readonly emailService
  ) {}
  
  async generateQuotation(quoteCartId: string, customerInfo: any): Promise<string> {
    // Fetch quote cart data
    // Generate PDF
    // Send email
    // Return quotation ID
  }
  
  async createPDF(quotationData: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const buffers = [];
      
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // PDF generation logic
      doc.fontSize(25).text("NET-BRIDGE Quotation", 100, 100);
      // Add more content
      
      doc.end();
    });
  }
}
Next.js Frontend Implementation
Responsive Component Structure
jsx
// Example of a responsive product card component
import React from 'react';
import { Card, Box, Typography, Button, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export const ResponsiveProductCard = ({ product }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Card 
      sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        p: 2,
        mb: 2
      }}
    >
      <Box sx={{ width: isMobile ? '100%' : '30%', mb: isMobile ? 2 : 0 }}>
        <img 
          src={product.thumbnail} 
          alt={product.title}
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>
      
      <Box sx={{ 
        width: isMobile ? '100%' : '70%', 
        pl: isMobile ? 0 : 2,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography variant="h6">{product.title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {product.key_specs.join(' • ')}
        </Typography>
        
        <Box sx={{ 
          mt: 'auto', 
          display: 'flex', 
          justifyContent: 'space-between',
          flexDirection: isMobile ? 'column' : 'row'
        }}>
          <Typography variant="h6" color="primary">
            From ${product.price}
          </Typography>
          
          <Box sx={{ mt: isMobile ? 2 : 0 }}>
            <Button 
              variant="outlined" 
              sx={{ mr: 1 }}
              href={`/product/${product.id}`}
            >
              Details
            </Button>
            <Button 
              variant="contained"
              href={`/configure/${product.id}`}
            >
              Configure
            </Button>
          </Box>
        </Box>
      </Box>
    </Card>
  );
};
Product Configuration State Management
jsx
// Example of React context for configuration state management
import React, { createContext, useContext, useReducer } from 'react';

const ConfigurationContext = createContext();

const initialState = {
  baseProduct: null,
  selectedOptions: {},
  totalPrice: 0,
  breakdown: {}
};

function configReducer(state, action) {
  switch (action.type) {
    case 'SET_BASE_PRODUCT':
      return { ...state, baseProduct: action.payload };
    case 'SELECT_OPTION':
      return { 
        ...state, 
        selectedOptions: { 
          ...state.selectedOptions, 
          [action.payload.category]: action.payload.option 
        } 
      };
    case 'UPDATE_PRICE':
      return { 
        ...state, 
        totalPrice: action.payload.total,
        breakdown: action.payload.breakdown
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function ConfigurationProvider({ children }) {
  const [state, dispatch] = useReducer(configReducer, initialState);
  
  return (
    <ConfigurationContext.Provider value={{ state, dispatch }}>
      {children}
    </ConfigurationContext.Provider>
  );
}

export function useConfiguration() {
  return useContext(ConfigurationContext);
}
PDF Generation and Email Sending
javascript
// Backend code for PDF generation and email sending
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';
import fs from 'fs';

export async function generateQuotationPDF(quotationData) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const filePath = `/tmp/quotation-${quotationData.id}.pdf`;
    const writeStream = fs.createWriteStream(filePath);
    
    doc.pipe(writeStream);
    
    // Add company logo
    doc.image('/path/to/logo.png', 50, 45, { width: 150 });
    
    // Add title
    doc.fontSize(25)
       .text('QUOTATION', 50, 160);
    
    // Add quotation details
    doc.fontSize(10)
       .text(`Quotation #: ${quotationData.id}`, 50, 200)
       .text(`Date: ${new Date().toLocaleDateString()}`, 50, 215)
       .text(`Valid until: ${new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 50, 230);
    
    // Add customer information
    doc.fontSize(10)
       .text('Customer Information:', 50, 270)
       .text(`Company: ${quotationData.customer.company}`, 50, 285)
       .text(`Contact: ${quotationData.customer.name}`, 50, 300)
       .text(`Email: ${quotationData.customer.email}`, 50, 315)
       .text(`Phone: ${quotationData.customer.phone}`, 50, 330);
    
    // Add product table
    let y = 380;
    doc.fontSize(12).text('Products', 50, y);
    y += 20;
    
    // Table headers
    doc.fontSize(10)
       .text('Item', 50, y)
       .text('Description', 150, y)
       .text('Quantity', 350, y)
       .text('Price', 450, y);
    
    y += 20;
    
    // Table content
    quotationData.items.forEach(item => {
      doc.text(item.sku, 50, y)
         .text(item.name, 150, y)
         .text(item.quantity.toString(), 350, y)
         .text(`$${item.price.toFixed(2)}`, 450, y);
      
      y += 15;
      
      // Add configuration details if any
      if (item.configuration) {
        Object.entries(item.configuration).forEach(([key, value]) => {
          doc.text('', 50, y)
             .text(`- ${key}: ${value.name}`, 150, y)
             .text('', 350, y)
             .text(`$${value.price.toFixed(2)}`, 450, y);
          
          y += 15;
        });
      }
      
      y += 10;
    });
    
    // Add total
    doc.fontSize(12)
       .text('Total:', 350, y)
       .text(`$${quotationData.total.toFixed(2)}`, 450, y);
    
    // Add terms and conditions
    y += 50;
    doc.fontSize(10)
       .text('Terms and Conditions:', 50, y)
       .text('1. This quotation is valid for 30 days.', 50, y + 15)
       .text('2. Delivery time: 2-4 weeks after order confirmation.', 50, y + 30)
       .text('3. Payment terms: 50% advance, 50% before delivery.', 50, y + 45);
    
    // Finalize the PDF
    doc.end();
    
    writeStream.on('finish', () => {
      resolve(filePath);
    });
    
    writeStream.on('error', (error) => {
      reject(error);
    });
  });
}

export async function sendQuotationEmail(quotationData, pdfPath) {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
  
  // Send email to sales team
  await transporter.sendMail({
    from: `"NET-BRIDGE" <${process.env.SMTP_USER}>`,
    to: process.env.SALES_TEAM_EMAIL,
    subject: `New Quotation Request #${quotationData.id}`,
    html: `
      <h1>New Quotation Request</h1>
      <p>A new quotation has been requested by ${quotationData.customer.name} from ${quotationData.customer.company}.</p>
      <p>Please find the attached quotation PDF.</p>
      <p>Customer contact details:</p>
      <ul>
        <li>Email: ${quotationData.customer.email}</li>
        <li>Phone: ${quotationData.customer.phone}</li>
      </ul>
    `,
    attachments: [
      {
        filename: `quotation-${quotationData.id}.pdf`,
        path: pdfPath
      }
    ]
  });
  
  // Send confirmation email to customer
  await transporter.sendMail({
    from: `"NET-BRIDGE" <${process.env.SMTP_USER}>`,
    to: quotationData.customer.email,
    subject: `Your Quotation #${quotationData.id}`,
    html: `
      <h1>Thank you for your quotation request</h1>
      <p>Dear ${quotationData.customer.name},</p>
      <p>Thank you for your interest in our products. Please find attached your quotation.</p>
      <p>Our sales team will contact you shortly to discuss your requirements in more detail.</p>
      <p>If you have any questions, please don't hesitate to contact us.</p>
    `,
    attachments: [
      {
        filename: `quotation-${quotationData.id}.pdf`,
        path: pdfPath
      }
    ]
  });
}
Docker Configuration Best Practices
Optimized Dockerfile for Medusa Backend
dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json .
RUN yarn install --no-lockfile

# Copy application code
COPY . .

# Build the application
RUN yarn build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json .

# Set environment variables
ENV NODE_ENV=production

# Expose the port
EXPOSE 9000

# Start the application
CMD ["node", "dist/main.js"]
Docker Compose with Health Checks
yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}
      REDIS_URL: redis://redis:6379
      JWT_SECRET: ${JWT_SECRET}
      COOKIE_SECRET: ${COOKIE_SECRET}
      CORS_ORIGIN: http://localhost:8000
    ports:
      - "9000:9000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    environment:
      NEXT_PUBLIC_MEDUSA_BACKEND_URL: http://localhost:9000
      NEXT_PUBLIC_BASE_URL: http://localhost:8000
    ports:
      - "8000:8000"
    depends_on:
      - backend

  admin:
    build:
      context: ./admin
      dockerfile: Dockerfile
    environment:
      MEDUSA_BACKEND_URL: http://localhost:9000
    ports:
      - "7000:7000"
    depends_on:
      - backend

volumes:
  postgres_data:
Deployment Script with Error Handling
bash
#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists()  {
  command -v "$1" >/dev/null 2>&1
}

# Function to display error and exit
error_exit() {
  echo -e "${RED}Error: $1${NC}" >&2
  exit 1
}

# Function to display success message
success_message() {
  echo -e "${GREEN}$1${NC}"
}

# Function to display warning message
warning_message() {
  echo -e "${YELLOW}$1${NC}"
}

# Display banner
echo "========================================="
echo "   NET-BRIDGE Deployment Script         "
echo "   Using Medusa.js 2.6.1                "
echo "========================================="

# Check if Docker is installed
if ! command_exists docker; then
  error_exit "Docker is not installed.\nPlease install Docker before running this script."
fi

# Check if Docker Compose is installed
if ! command_exists docker-compose; then
  error_exit "Docker Compose is not installed.\nPlease install Docker Compose before running this script."
fi

# Check if .env file exists
if [ ! -f .env ]; then
  warning_message ".env file not found. Creating from template..."
  cp .env.template .env
  warning_message "Please update the .env file with your configuration before continuing."
  exit 0
fi

# Build and start the containers
echo "Building and starting containers..."
if docker-compose -f docker-compose.production.yml up -d --build; then
  success_message "Containers built and started successfully!"
else
  error_exit "Failed to build and start containers."
fi

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
for i in {1..30}; do
  if curl -s http://localhost:9000/health | grep -q "ok"; then
    success_message "Backend is ready!"
    break
  fi
  
  if [ $i -eq 30 ]; then
    warning_message "Backend health check timed out. It might still be starting up."
  fi
  
  echo "Waiting for backend to be ready... ($i/30) "
  sleep 2
done

# Seed the database
echo "Seeding the database..."
if docker-compose -f docker-compose.production.yml exec backend yarn seed; then
  success_message "Database seeded successfully!"
else
  warning_message "Failed to seed the database. You may need to do this manually."
fi

# Display access URLs
echo ""
echo "NET-BRIDGE is now running!"
echo "Access the platform at:"
echo "  - Storefront: http://localhost:8000"
echo "  - Admin Panel: http://localhost:7000"
echo "  - Backend API: http://localhost:9000"
echo ""
echo "Default admin credentials:"
echo "  - Email: admin@net-bridge.com"
echo "  - Password: admin"
echo ""
echo "To stop the platform, run:"
echo "  docker-compose -f docker-compose.production.yml down"
echo ""

success_message "Deployment completed successfully!"
Performance Optimization Tips
Database Indexing
typescript
// Example of optimized entity with indexes
import { Entity, Column, Index, ManyToOne, JoinColumn } from "typeorm";
import { Product } from "@medusajs/medusa";

@Entity() 
export class ProductConfiguration {
  @Column()
  @Index()
  product_id: string;
  
  @ManyToOne(() => Product)
  @JoinColumn({ name: "product_id" })
  product: Product;
  
  @Column({ type: "jsonb" })
  configuration_options: Record<string, any>;
  
  @Column()
  @Index()
  is_default: boolean;
}
React Component Optimization
jsx
// Example of optimized React component with memoization
import React, { useMemo, useCallback } from 'react';

const ProductConfigurator = ({ product, onConfigurationChange }) => {
  // Memoize configuration options to prevent unnecessary re-renders
  const configOptions = useMemo(() => {
    return product?.configuration_options || {};
  }, [product?.configuration_options]);
  
  // Memoize change handler
  const handleOptionChange = useCallback((category, option) => {
    onConfigurationChange(category, option);
  }, [onConfigurationChange]);
  
  // Render only if we have a product
  if (!product) return <div>Loading...</div>;
  
  return (
    <div className="configurator">
      <h2>Configure Your {product.name}</h2>
      
      {Object.entries(configOptions).map(([category, options]) => (
        <ConfigurationSection
          key={category}
          category={category}
          options={options}
          onChange={handleOptionChange}
        />
      ))}
    </div>
  );
};

// Use React.memo to prevent unnecessary re-renders
const ConfigurationSection = React.memo(({ category, options, onChange }) => {
  return (
    <div className="config-section">
      <h3>{category}</h3>
      <div className="options-grid">
        {options.map(option => (
          <OptionCard
            key={option.id}
            option={option}
            onSelect={() => onChange(category, option)}
          />
        ))}
      </div>
    </div>
  );
});

export default React.memo(ProductConfigurator);
API Response Caching
typescript
// Example of API caching with Redis
import { Service } from "medusa-extender";
import { EntityManager } from "typeorm";
import Redis from "ioredis";

@Service()
export class ProductService {
  constructor(
    private readonly manager: EntityManager,
    private readonly redis: Redis
  ) {}
  
  async getProductWithConfigurations(productId: string): Promise<any> {
    // Try to get from cache first
    const cacheKey = `product:${productId}:config`;
    const cachedData = await this.redis.get(cacheKey);
    
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    
    // If not in cache, fetch from database
    const product = await this.manager.findOne(Product, {
      where: { id: productId },
      relations: ["configurations"]
    });
    
    // Store in cache for 5 minutes
    await this.redis.set(
      cacheKey, 
      JSON.stringify(product), 
      "EX", 
      300
    );
    
    return product;
  }
}
Common Pitfalls and Solutions
Handling Medusa.js Custom Entities
Pitfall: Extending Medusa entities can be tricky with TypeORM
Solution: Use the medusa-extender package or create separate entities with relations
Docker Volume Permissions
Pitfall: Permission issues with mounted volumes
Solution: Set proper user permissions in Dockerfile and use named volumes
Next.js API Routes with Medusa
Pitfall: Duplicate API functionality between Next.js and Medusa
Solution: Use Next.js API routes only for frontend-specific functionality, proxy to Medusa for core e-commerce features
Mobile Responsiveness Testing
Pitfall: Inconsistent behavior across devices
Solution: Use device-specific testing with tools like Playwright or Cypress
PDF Generation Memory Issues
Pitfall: Large PDFs can cause memory problems
Solution: Stream PDFs directly to storage or response instead of keeping in memory
Security Considerations
Environment Variables
# Example .env file with security best practices
# Database
POSTGRES_USER=medusa_user
POSTGRES_PASSWORD=<strong_random_password>
POSTGRES_DB=medusa_db

# JWT and Cookie Secrets (use different strong random values)
JWT_SECRET=<random_string_at_least_32_chars>
COOKIE_SECRET=<different_random_string_at_least_32_chars>

# CORS
CORS_ORIGIN=http://localhost:8000

# Redis
REDIS_URL=redis://redis:6379

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email@example.com
SMTP_PASS=<email_password>
SMTP_SECURE=false

# Sales Team
SALES_TEAM_EMAIL=sales@your-company.com
API Rate Limiting
typescript
// Example of implementing rate limiting
import { Router } from "express";
import rateLimit from "express-rate-limit";

export default (router: Router)  => {
  // Create rate limiter
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  
  // Apply rate limiting to quotation endpoints
  const quotationRouter = Router();
  router.use("/quotations", apiLimiter, quotationRouter);
  
  // Define routes
  quotationRouter.post("/", async (req, res) => {
    // Handle quotation creation
  });
  
  return router;
};
Input Validation
typescript
// Example of input validation with Joi
import { Router } from "express";
import Joi from "joi";

export default (router: Router) => {
  const quotationRouter = Router();
  router.use("/quotations", quotationRouter);
  
  // Define validation schema
  const quotationSchema = Joi.object({
    customer: Joi.object({
      company: Joi.string().required(),
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      address: Joi.string().required()
    }).required(),
    items: Joi.array().items(
      Joi.object({
        product_id: Joi.string().required(),
        quantity: Joi.number().integer().min(1).required(),
        configuration: Joi.object().optional()
      })
    ).min(1).required()
  });
  
  // Apply validation to route
  quotationRouter.post("/", async (req, res) => {
    // Validate request body
    const { error, value } = quotationSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    // Process validated data
    // ...
  });
  
  return router;
};
These implementation details should provide Cursor AI with comprehensive guidance for developing the NET-BRIDGE e-commerce platform according to the requirements.
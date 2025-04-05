# Medusa.js Documentation Reference

## Overview
Medusa is a digital commerce platform with a built-in framework for customization that provides:
1. A suite of commerce modules with core functionalities (inventory tracking, cart calculations, payments, orders)
2. A framework for building custom business logic, APIs, data models, workflows, and third-party integrations
3. A customizable admin dashboard for merchants

This document summarizes key aspects of Medusa relevant to the NET-BRIDGE project.

## Key Features Relevant to NET-BRIDGE

### Commerce Modules
- Product catalog management
- Inventory tracking
- Cart calculations
- Order management
- These will form the foundation of our product catalog system

### Customization Framework
- Custom API endpoints for our configuration system
- Extended data models for technical specifications
- Business logic for compatibility rules
- Third-party integration for PDF generation and email

### UI Components
Medusa provides a comprehensive UI library (`@medusajs/ui`) that includes:
- Button, Card, and Form components for our configuration interface
- Toast notifications for feedback during configuration
- Tooltip components for technical specifications
- Drawer and Dialog components for the quotation flow

### Admin Dashboard
- Customizable admin experience for managing products and configurations
- Order and quotation management capabilities
- User management for the client's team

## B2B Commerce Support
Medusa has been used successfully for B2B commerce implementations (mentioned in docs), confirming its suitability for our enterprise IT equipment platform.

## Deployment Architecture
The documentation outlines a deployment architecture that aligns with our requirements:
- Node.js-based server deployment
- PostgreSQL database
- Redis for caching
- Docker containerization

## Building with Medusa

### Extending Product Models
```typescript
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
```

### Custom API Routes
```typescript
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
```

### Custom Services
```typescript
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
}
```

### UI Component Usage
```tsx
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
```

## Building and Deployment
- Build command: `npx medusa build`
- Output directories:
  - Server: `.medusa/server`
  - Admin: `.medusa/server/public/admin`
- Docker deployment with health checks for PostgreSQL and Redis

## Resources
- GitHub repository: https://github.com/medusajs/medusa
- Discord community: https://discord.gg/medusajs
- Troubleshooting guides: https://docs.medusajs.com/resources/troubleshooting/ 
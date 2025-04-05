// import { Module } from "@medusajs/framework"; // Incorrect import
import { Quotation } from "./models/quotation.model";
import { QuotationItem } from "./models/quotation-item.model";

// Define a unique key for the module
export const QUOTE_MODULE = "quoteModule";

// Export the configuration object directly
export const moduleDefinition = {
  models: [Quotation, QuotationItem],
  // We will add services, loaders, etc., here later
};

// Default export for Medusa's module loader
export default moduleDefinition; 
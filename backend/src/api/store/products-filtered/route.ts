import type { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import { Product } from "@medusajs/medusa"
import { ProductRepository } from "@medusajs/medusa/dist/repositories/product"
import { FindOptionsWhere, ILike } from "typeorm"
import { ExtendedRequest } from "@medusajs/medusa/dist/types/global"

// GET /store/products-filtered?category_id=xxx&metadata[key]=value&q=search_term...
export async function GET(
  req: ExtendedRequest<any>,
  res: MedusaResponse
): Promise<void> {
  // Resolve the repository using the correct key for the extended ProductRepository
  // Note: The exact repository class/type might vary slightly based on Medusa version/setup
  const productRepository: typeof ProductRepository = req.scope.resolve(
    "productRepository"
  )

  // Extract query parameters for filtering
  const { category_id, limit = 10, offset = 0, q, ...metadataFilters } = req.query

  // Define the base type for findOptions, including Product entity structure
  const findOptions: FindOptionsWhere<Product> = {}
  // Store combined where clauses, potentially an array for OR conditions
  let whereClauses: FindOptionsWhere<Product> | FindOptionsWhere<Product>[] = findOptions

  // Add category filter
  if (category_id) {
    // Add category filtering using a relation query
    // This syntax assumes a many-to-many relation named 'categories' on Product
    findOptions.categories = { id: String(category_id) };
  }

  // Add search term filter using ILike for case-insensitive search
  if (q) {
    const searchTerm = String(q);
    // Apply OR condition for search term across title and description
    whereClauses = [
      { ...findOptions, title: ILike(`%${searchTerm}%`) },
      { ...findOptions, description: ILike(`%${searchTerm}%`) },
    ]
  }

  // Add metadata filters
  const metadataWhereClauses: Record<string, string> = {}
  for (const key in metadataFilters) {
    if (key.startsWith('metadata[')) {
      const metadataKey = key.substring(9, key.length - 1);
      const metadataValue = metadataFilters[key] as string;
      // Add key-value pair for metadata filtering
      metadataWhereClauses[metadataKey] = metadataValue;
    }
  }

  if (Object.keys(metadataWhereClauses).length > 0) {
    // Apply metadata filters to the existing where clause(s)
    if (Array.isArray(whereClauses)) {
      // Apply to each OR condition if search (q) was used
      whereClauses = whereClauses.map(clause => ({
        ...clause,
        metadata: metadataWhereClauses
      }));
    } else {
      // Apply directly if only category/no filter was used before
      whereClauses = {
        ...whereClauses,
        metadata: metadataWhereClauses
      };
    }
  }

  try {
    // Pass the constructed findOptions to listAndCount
    const [products, count] = await productRepository.findAndCount({
        where: whereClauses,
        relations: ["categories"], // Ensure categories relation is loaded if filtered by it
        take: Number(limit),
        skip: Number(offset),
        // select: [...] // Optionally select specific fields
        // order: { ... } // Optionally add sorting
      }
    );

    res.json({
      products,
      count,
      limit: Number(limit),
      offset: Number(offset),
    });
  } catch (error) {
    console.error("Error fetching filtered products:", error);
    res.status(500).json({ message: "Internal server error fetching products" });
  }
} 
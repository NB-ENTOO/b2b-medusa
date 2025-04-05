import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/core-flows";
import {
  ExecArgs,
  IFulfillmentModuleService,
  ISalesChannelModuleService,
  IStoreModuleService,
} from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const fulfillmentModuleService: IFulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  );
  const salesChannelModuleService: ISalesChannelModuleService =
    container.resolve(ModuleRegistrationName.SALES_CHANNEL);
  const storeModuleService: IStoreModuleService = container.resolve(
    ModuleRegistrationName.STORE
  );

  const countries = ["gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    // create the default sales channel
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [
          {
            currency_code: "eur",
            is_default: true,
          },
          {
            currency_code: "usd",
          },
        ],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });
  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
    })),
  });
  logger.info("Finished seeding tax regions.");

  logger.info("Seeding stock location data...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "European Warehouse",
          address: {
            city: "Copenhagen",
            country_code: "DK",
            address_1: "",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment data...");
  const { result: shippingProfileResult } =
    await createShippingProfilesWorkflow(container).run({
      input: {
        data: [
          {
            name: "Default",
            type: "default",
          },
        ],
      },
    });
  const shippingProfile = shippingProfileResult[0];

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "European Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: [
          {
            country_code: "gb",
            type: "country",
          },
          {
            country_code: "de",
            type: "country",
          },
          {
            country_code: "dk",
            type: "country",
          },
          {
            country_code: "se",
            type: "country",
          },
          {
            country_code: "fr",
            type: "country",
          },
          {
            country_code: "es",
            type: "country",
          },
          {
            country_code: "it",
            type: "country",
          },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 2-3 days.",
          code: "standard",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: '"true"',
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          {
            currency_code: "usd",
            amount: 10,
          },
          {
            currency_code: "eur",
            amount: 10,
          },
          {
            region_id: region.id,
            amount: 10,
          },
        ],
        rules: [
          {
            attribute: "enabled_in_store",
            value: '"true"',
            operator: "eq",
          },
          {
            attribute: "is_return",
            value: "false",
            operator: "eq",
          },
        ],
      },
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding stock location data.");

  logger.info("Seeding publishable API key data...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [
        {
          title: "Webshop",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");

  logger.info("Seeding product data...");

  const {
    result: [collection],
  } = await createCollectionsWorkflow(container).run({
    input: {
      collections: [
        {
          title: "Featured",
          handle: "featured",
        },
      ],
    },
  });

  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Servers",
          is_active: true,
        },
        {
          name: "Storage",
          is_active: true,
        },
        {
          name: "Networking",
          is_active: true,
        },
        {
          name: "Components",
          is_active: true,
        },
      ],
    },
  });

  // Get category IDs
  const serversCategoryId = categoryResult.find((cat) => cat.name === "Servers")?.id!;
  const storageCategoryId = categoryResult.find((cat) => cat.name === "Storage")?.id!;
  const networkingCategoryId = categoryResult.find((cat) => cat.name === "Networking")?.id!;
  const componentsCategoryId = categoryResult.find((cat) => cat.name === "Components")?.id!;

  logger.info("Seeding placeholder product data...");

  // --- Seed Servers ---
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Rack Server Model R740",
          subtitle: "High-performance 2U rack server",
          description: "Versatile server suitable for demanding enterprise workloads, virtualization, and cloud computing. Highly configurable.",
          collection_id: collection.id, // Assuming 'collection' is defined earlier for featured items
          category_ids: [serversCategoryId],
          status: ProductStatus.PUBLISHED,
          images: [
            // Placeholder image - replace with actual later
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/server-generic.png" }
          ],
          metadata: {
            processor_type: "Intel Xeon Scalable",
            memory_gb: "64",
            storage_capacity_tb: "4",
            form_factor: "2U Rack"
          },
          // Define basic options for demonstration - real config handled separately
          options: [{ title: "Base RAM", values: [] }, { title: "Base Storage", values: [] }],
          variants: [
            {
              title: "Base Configuration",
              sku: "R740-BASE",
              options: { "Base RAM": "64GB", "Base Storage": "4TB SSD" },
              manage_inventory: false,
              prices: [{ amount: 450000, currency_code: "usd" }, { amount: 420000, currency_code: "eur" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        }
      ]
    }
  });

  // --- Seed Storage ---
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Enterprise NAS Array X4",
          subtitle: "Scalable Network Attached Storage",
          description: "Reliable and scalable NAS solution for file sharing, backup, and data archiving. Supports multiple RAID configurations.",
          category_ids: [storageCategoryId],
          status: ProductStatus.PUBLISHED,
          images: [
             { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/nas-generic.png" }
          ],
          metadata: {
            storage_type: "NAS",
            capacity_tb: "24",
            interface: "Ethernet",
            form_factor: "Tower"
          },
          options: [{ title: "Drive Configuration", values: [] }],
          variants: [
            {
              title: "Diskless",
              sku: "NAS-X4-DISKLESS",
              options: { "Drive Configuration": "Diskless" },
              manage_inventory: false,
              prices: [{ amount: 120000, currency_code: "usd" }, { amount: 110000, currency_code: "eur" }]
            },
             {
              title: "24TB (4x6TB)",
              sku: "NAS-X4-24TB",
              options: { "Drive Configuration": "4x6TB HDD" },
              manage_inventory: false,
              prices: [{ amount: 250000, currency_code: "usd" }, { amount: 230000, currency_code: "eur" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        }
      ]
    }
  });

  // --- Seed Networking ---
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Managed Network Switch S3900",
          subtitle: "48-Port Gigabit Managed Switch",
          description: "Layer 2+ managed switch with 48 Gigabit Ethernet ports and 4 SFP+ uplinks. Ideal for enterprise networks.",
          category_ids: [networkingCategoryId],
          status: ProductStatus.PUBLISHED,
          images: [
             { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/switch-generic.png" }
          ],
          metadata: {
            device_type: "Switch",
            port_count: "48",
            port_speed_gbps: "1"
          },
          options: [{ title: "Power Supply", values: [] }],
          variants: [
            {
              title: "Standard PSU",
              sku: "SW-S3900-STD",
              options: { "Power Supply": "Standard" },
              manage_inventory: false,
              prices: [{ amount: 80000, currency_code: "usd" }, { amount: 75000, currency_code: "eur" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        }
      ]
    }
  });

  // --- Seed Components ---
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Intel Xeon Gold 6248R Processor",
          subtitle: "24-Core Scalable Processor",
          description: "High-performance CPU for demanding server workloads. LGA3647 Socket.",
          category_ids: [componentsCategoryId],
          status: ProductStatus.PUBLISHED,
          images: [
             { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/cpu-generic.png" }
          ],
          metadata: {
            component_type: "CPU",
            compatibility_key: "LGA3647"
          },
          options: [{ title: "Packaging", values: [] }],
          variants: [
            {
              title: "Retail Box",
              sku: "CPU-XG-6248R",
              options: { "Packaging": "Retail" },
              manage_inventory: false,
              prices: [{ amount: 270000, currency_code: "usd" }, { amount: 250000, currency_code: "eur" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        },
        {
          title: "Samsung 32GB DDR4 ECC RAM Module",
          subtitle: "Server Memory Module 2666MHz",
          description: "Reliable ECC registered memory for server applications.",
          category_ids: [componentsCategoryId],
          status: ProductStatus.PUBLISHED,
          images: [
             { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/ram-generic.png" }
          ],
          metadata: {
            component_type: "RAM",
            compatibility_key: "DDR4-ECC-RDIMM"
          },
          options: [{ title: "Speed", values: [] }], // Example option
          variants: [
            {
              title: "2666MHz",
              sku: "RAM-SAM-32G-ECC",
              options: { "Speed": "2666MHz" },
              manage_inventory: false,
              prices: [{ amount: 15000, currency_code: "usd" }, { amount: 14000, currency_code: "eur" }]
            }
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }]
        }
      ]
    }
  });

  logger.info("Finished seeding product data.");
}

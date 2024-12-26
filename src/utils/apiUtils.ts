import { defaultHeaders, Product } from "../api/shared";

type Filter = {
  field: string;
  value: string | number;
  condition_type: string;
};

type FilterGroup = {
  filters: Filter[];
};

export const baseApiUrl =
  "http://ec2-13-53-99-251.eu-north-1.compute.amazonaws.com/";
export const baseUrl = import.meta.env.PROD ? baseApiUrl : "";
export const baseMediaUrl =
  "https://unveels.com/media/catalog/product/cache/df714aaa5e59335a5bf39a17764906ba";

export function mediaUrl(imagePath: string | undefined) {
  if (!imagePath) {
    return "https://picsum.photos/id/237/200/300";
  }
  return baseMediaUrl + imagePath;
}

/**
 * Converts an array of filter groups into a query string following the
 * `searchCriteria[filter_groups][n][filters][m][...]` pattern.
 * @param filterGroups - Array of filter groups with filters.
 * @returns A string representing the search parameters.
 */
export function buildSearchParams(filterGroups: FilterGroup[]): string {
  const params = new URLSearchParams();

  filterGroups.forEach((group, groupIndex) => {
    group.filters.forEach((filter, filterIndex) => {
      Object.entries(filter).forEach(([key, value]) => {
        const paramName = `searchCriteria[filter_groups][${groupIndex}][filters][${filterIndex}][${key}]`;
        params.append(paramName, String(value));
      });
    });
  });

  return params.toString();
}

export function extractUniqueCustomAttributes(
  products: Product[],
  attributeCode: string,
) {
  const uniqueAttributes = new Set<string>();
  for (const product of products) {
    for (const attr of product.custom_attributes) {
      if (attr.attribute_code === attributeCode) {
        uniqueAttributes.add(attr.value as string);
      }
    }
  }
  return Array.from(uniqueAttributes);
}

export const getProductAttributes = (
  product: Product,
  attributeCName: string,
) => {
  return (
    product.custom_attributes.find(
      (attr) => attr.attribute_code === attributeCName,
    )?.value ?? ""
  );
};

export async function fetchConfigurableProducts(
  results: {
    items: Array<Product>;
  },
  parentFilters: FilterGroup[] = [],
) {
  // Check if it has any configurable products
  const productFound = results.items.filter(
    (p) => p.type_id === "configurable",
  );

  if (productFound.length === 0) {
    return {
      items: results.items,
    };
  }

  // Get entity ids of the configurable products in prodcut[extension_attributes][configurable_product_links]
  const configurableProductIds = productFound
    .map((p) => p.extension_attributes.configurable_product_links ?? [])
    .flat();

  const filters = [
    ...parentFilters,
    {
      filters: [
        {
          field: "entity_id",
          value: configurableProductIds.join(","),
          condition_type: "in",
        },
      ],
    },
  ];

  const response = await fetch(
    baseUrl + "/rest/V1/products?" + buildSearchParams(filters),
    {
      headers: defaultHeaders,
    },
  );

  // Combine results with configurable products
  const filteredResults = results.items.filter(
    (product) => product.type_id === "simple",
  );

  const configrableResponse = (await response.json()) as {
    items: Array<Product>;
  };

  configrableResponse.items.forEach((item) => {
    const parentProduct = productFound.find((p) =>
      p.extension_attributes.configurable_product_links?.includes(item.id),
    );
    item.custom_attributes = [
      ...(parentProduct?.custom_attributes ?? []),
      ...item.custom_attributes,
    ];
  });

  return {
    items: [...filteredResults, ...configrableResponse.items],
  };
}

export function createSimpleAndConfigurableFilters(filters: FilterGroup[]) {
  const simpleFilters = [
    ...filters,
    {
      filters: [
        {
          field: "type_id",
          value: "simple",
          condition_type: "eq",
        },
      ],
    },
  ];

  const configurableFilters = [
    ...filters,
    {
      filters: [
        {
          field: "type_id",
          value: "configurable",
          condition_type: "eq",
        },
      ],
    },
  ];

  return { simpleFilters, configurableFilters };
}

export async function fetchAllProducts(
  results: {
    items: Array<Product>;
  },
  parentFilters: FilterGroup[] = [],
) {
  // Filter produk dengan type_id configurable dan simple
  const productFound = results.items.filter(
    (p) => p.type_id === "configurable" || p.type_id === "simple",
  );

  if (productFound.length === 0) {
    return {
      items: results.items,
    };
  }

  // Dapatkan entity_id dari produk yang bertipe configurable atau simple
  const configurableProductIds = productFound
    .map((p) => p.extension_attributes.configurable_product_links ?? [])
    .flat();

  // Dapatkan entity_id untuk produk simple juga
  const simpleProductIds = productFound
    .filter((p) => p.type_id === "simple")
    .map((p) => p.id);

  // Gabungkan configurableProductIds dan simpleProductIds
  const allProductIds = [...configurableProductIds, ...simpleProductIds];

  const filters = [
    ...parentFilters,
    {
      filters: [
        {
          field: "entity_id",
          value: allProductIds.join(","),
          condition_type: "in",
        },
      ],
    },
  ];

  const response = await fetch(
    baseUrl + "/rest/V1/products?" + buildSearchParams(filters),
    {
      headers: defaultHeaders,
    },
  );

  const configrableResponse = (await response.json()) as {
    items: Array<Product>;
  };

  configrableResponse.items.forEach((item) => {
    const parentProduct = productFound.find((p) =>
      p.extension_attributes.configurable_product_links?.includes(item.id),
    );
    item.custom_attributes = [
      ...(parentProduct?.custom_attributes ?? []),
      ...item.custom_attributes,
    ];
  });

  // Gabungkan hasil produk simple dan configurable menjadi satu array
  const allResults = [...configrableResponse.items];

  return {
    items: allResults,
  };
}
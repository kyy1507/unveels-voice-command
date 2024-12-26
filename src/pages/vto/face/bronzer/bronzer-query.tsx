import { useQuery } from "@tanstack/react-query";
import {
  faceMakeupProductTypesFilter,
  getLashMakeupProductTypeIds,
} from "../../../../api/attributes/makeups";
import { defaultHeaders, Product } from "../../../../api/shared";
import {
  baseUrl,
  buildSearchParams,
  createSimpleAndConfigurableFilters,
  fetchConfigurableProducts,
} from "../../../../utils/apiUtils";

export function useBronzerQuery({
  texture,
  hexacode,
}: {
  hexacode: string | null;
  texture: string | null;
}) {
  return useQuery({
    queryKey: ["products", "bronzers", hexacode, texture],
    queryFn: async () => {
      const { simpleFilters, configurableFilters } =
        createSimpleAndConfigurableFilters([
          {
            filters: [
              {
                field: "face_makeup_product_type",
                value: faceMakeupProductTypesFilter(["Bronzers"]),
                condition_type: "in",
              },
            ],
          },
        ]);

      if (texture) {
        simpleFilters.push({
          filters: [
            {
              field: "texture",
              value: texture,
              condition_type: "eq",
            },
          ],
        });
      }

      if (texture) {
        configurableFilters.push({
          filters: [
            {
              field: "texture",
              value: texture,
              condition_type: "eq",
            },
          ],
        });
      }

      const [simpleResponse, configurableResponse] = await Promise.all([
        fetch(
          baseUrl + "/rest/V1/products?" + buildSearchParams(simpleFilters),
          {
            headers: defaultHeaders,
          },
        ),
        fetch(
          baseUrl +
            "/rest/V1/products?" +
            buildSearchParams(configurableFilters),
          {
            headers: defaultHeaders,
          },
        ),
      ]);

      const simpleResults = (await simpleResponse.json()) as {
        items: Array<Product>;
      };

      const configurableResults = (await configurableResponse.json()) as {
        items: Array<Product>;
      };

      const combinedResults = [
        ...simpleResults.items,
        ...configurableResults.items,
      ];

      const filters = [];

      if (hexacode) {
        filters.push({
          filters: [
            {
              field: "hexacode",
              value: hexacode,
              condition_type: "finset",
            },
          ],
        });
      }


      return fetchConfigurableProducts(
        {
          items: combinedResults,
        },
        filters,
      );
    },
  });
}

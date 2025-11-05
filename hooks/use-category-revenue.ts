import { useState, useEffect } from "react";
import { categoryService, CategoryRevenueResponse } from "@/lib/api/category";

export function useCategoryRevenue() {
  const [data, setData] = useState<CategoryRevenueResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryRevenue = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await categoryService.getRevenueSummary();

        if (response.result) {
          setData(response.result);
        } else {
          setError(response.message || "Failed to fetch category revenue data");
        }
      } catch (err) {
        console.error("Error fetching category revenue:", err);
        setError("Failed to fetch category revenue data");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryRevenue();
  }, []);

  return { data, loading, error };
}

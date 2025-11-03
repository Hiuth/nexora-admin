"use client";

import { useState, useCallback } from "react";
import { PcBuildFormData } from "./pc-build-form-fields";
import { PcBuildResponse, DialogMode } from "@/types";

export function usePcBuildFormData() {
  const [formData, setFormData] = useState<PcBuildFormData>({
    productName: "",
    price: 0,
    description: "",
    status: "ACTIVE",
    categoryId: "",
    subCategoryId: "",
  });

  const handleFormDataChange = useCallback(
    (newData: Partial<PcBuildFormData>) => {
      // Always ensure price remains 0
      const dataToUpdate = { ...newData };
      if (dataToUpdate.price !== undefined) {
        dataToUpdate.price = 0;
      }
      setFormData((prev: PcBuildFormData) => ({ ...prev, ...dataToUpdate }));
    },
    []
  );

  const initializeFormData = useCallback(
    (mode: DialogMode, data?: PcBuildResponse) => {
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: 0, // Always set price to 0
          description: data.description || "",
          status: data.status,
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
        });
      } else {
        setFormData({
          productName: "",
          price: 0, // Always set price to 0
          description: "",
          status: "ACTIVE",
          categoryId: "",
          subCategoryId: "",
        });
      }
    },
    []
  );

  return {
    formData,
    handleFormDataChange,
    initializeFormData,
  };
}

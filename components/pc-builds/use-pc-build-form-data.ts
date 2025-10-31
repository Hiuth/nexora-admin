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
      setFormData((prev: PcBuildFormData) => ({ ...prev, ...newData }));
    },
    []
  );

  const initializeFormData = useCallback(
    (mode: DialogMode, data?: PcBuildResponse) => {
      if (mode === "edit" && data) {
        setFormData({
          productName: data.productName,
          price: data.price,
          description: data.description || "",
          status: data.status,
          categoryId: data.categoryId,
          subCategoryId: data.subCategoryId,
        });
      } else {
        setFormData({
          productName: "",
          price: 0,
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

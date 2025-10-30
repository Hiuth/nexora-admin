"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit2 } from "lucide-react";
import { BrandResponse } from "@/types";

interface BrandTableProps {
  brands: BrandResponse[];
  onEdit: (brand: BrandResponse) => void;
}

export function BrandTable({ brands, onEdit }: BrandTableProps) {
  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                Tên thương hiệu
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b border-border hover:bg-muted/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {brand.brandName}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(brand)}
                        className="text-primary hover:bg-primary/10"
                      >
                        <Edit2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="px-6 py-8 text-center text-muted-foreground"
                >
                  Không có thương hiệu nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

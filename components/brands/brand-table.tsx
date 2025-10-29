"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"

export function BrandTable({ brands, onEdit, onDelete }) {
  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Slug</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Description</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr key={brand.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{brand.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{brand.slug}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{brand.description}</td>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(brand.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

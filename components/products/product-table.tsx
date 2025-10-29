"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"

export function ProductTable({ products, onEdit, onDelete }) {
  const getStatusColor = (status) => {
    return status === "active" ? "text-green-500" : "text-red-500"
  }

  const getStockColor = (stock) => {
    if (stock > 50) return "text-green-500"
    if (stock > 10) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">SKU</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Brand</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{product.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.sku}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.brand}</td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">${product.price.toFixed(2)}</td>
                <td className={`px-6 py-4 text-sm font-medium ${getStockColor(product.stock)}`}>{product.stock}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      product.status === "active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(product)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(product.id)}
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

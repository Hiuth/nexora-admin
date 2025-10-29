"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Edit2, Trash2 } from "lucide-react"

export function AttributeTable({ attributes, onEdit, onDelete }) {
  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Type</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Values</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attributes.map((attribute) => (
              <tr key={attribute.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{attribute.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground capitalize">{attribute.type}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {attribute.values.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {attribute.values.map((value, idx) => (
                        <span key={idx} className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                          {value}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted-foreground/50">No values</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(attribute)}
                      className="text-primary hover:bg-primary/10"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(attribute.id)}
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

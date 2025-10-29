"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Eye } from "lucide-react"

export function OrderTable({ orders, onViewDetails, onUpdateStatus }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-500"
      case "processing":
        return "bg-orange-500/20 text-orange-500"
      case "shipped":
        return "bg-blue-500/20 text-blue-500"
      case "delivered":
        return "bg-green-500/20 text-green-500"
      case "cancelled":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-gray-500/20 text-gray-500"
    }
  }

  return (
    <Card className="border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Order ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Customer</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Items</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Total</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                <td className="px-6 py-4 text-sm text-foreground font-medium">{order.id}</td>
                <td className="px-6 py-4 text-sm">
                  <div>
                    <p className="text-foreground font-medium">{order.customer}</p>
                    <p className="text-muted-foreground text-xs">{order.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{order.date}</td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">{order.items}</td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">${order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <Eye size={16} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

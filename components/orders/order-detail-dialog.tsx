"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"

const statusOptions = ["pending", "processing", "shipped", "delivered", "cancelled"]

export function OrderDetailDialog({ isOpen, onOpenChange, order, onUpdateStatus }) {
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (order) {
      setStatus(order.status)
    }
  }, [order, isOpen])

  const handleUpdateStatus = () => {
    if (order && status !== order.status) {
      onUpdateStatus(order.id, status)
      onOpenChange(false)
    }
  }

  if (!order) return null

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
          <DialogDescription>View and manage order information</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="text-foreground font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Date</p>
              <p className="text-foreground font-medium">{order.date}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Customer Information</p>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-foreground">{order.customer}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-foreground">{order.email}</p>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Order Summary</p>
            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-sm text-muted-foreground">Items</p>
                <p className="text-foreground font-medium">{order.items}</p>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <p className="text-sm font-semibold text-foreground">Total</p>
                <p className="text-foreground font-bold">${order.total.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <div className="border-t border-border pt-4">
            <p className="text-sm font-semibold text-foreground mb-3">Update Status</p>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    <span className="capitalize">{option}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleUpdateStatus} disabled={status === order.status}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X } from "lucide-react"

export function AttributeDialog({ isOpen, onOpenChange, attribute, onSubmit }) {
  const [formData, setFormData] = useState({ name: "", type: "select", values: [] })
  const [valueInput, setValueInput] = useState("")

  useEffect(() => {
    if (attribute) {
      setFormData(attribute)
    } else {
      setFormData({ name: "", type: "select", values: [] })
    }
    setValueInput("")
  }, [attribute, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", type: "select", values: [] })
    setValueInput("")
  }

  const handleAddValue = () => {
    if (valueInput.trim()) {
      setFormData({
        ...formData,
        values: [...formData.values, valueInput.trim()],
      })
      setValueInput("")
    }
  }

  const handleRemoveValue = (index) => {
    setFormData({
      ...formData,
      values: formData.values.filter((_, i) => i !== index),
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{attribute ? "Edit Attribute" : "Add Attribute"}</DialogTitle>
          <DialogDescription>
            {attribute ? "Update the attribute details below." : "Create a new product attribute."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Attribute Name</Label>
            <Input
              id="name"
              placeholder="e.g., Color"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "select" && (
            <div className="space-y-2">
              <Label>Values</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a value"
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      handleAddValue()
                    }
                  }}
                />
                <Button type="button" variant="outline" onClick={handleAddValue}>
                  Add
                </Button>
              </div>
              {formData.values.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.values.map((value, idx) => (
                    <div
                      key={idx}
                      className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm">{value}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveValue(idx)}
                        className="hover:text-foreground transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{attribute ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

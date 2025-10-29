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

export function CategoryDialog({ isOpen, onOpenChange, category, onSubmit }) {
  const [formData, setFormData] = useState({ name: "", slug: "", description: "" })

  useEffect(() => {
    if (category) {
      setFormData(category)
    } else {
      setFormData({ name: "", slug: "", description: "" })
    }
  }, [category, isOpen])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    setFormData({ name: "", slug: "", description: "" })
  }

  const handleNameChange = (e) => {
    const name = e.target.value
    const slug = name.toLowerCase().replace(/\s+/g, "-")
    setFormData({ ...formData, name, slug })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{category ? "Edit Category" : "Add Category"}</DialogTitle>
          <DialogDescription>
            {category ? "Update the category details below." : "Create a new product category."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              placeholder="e.g., Electronics"
              value={formData.name}
              onChange={handleNameChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" placeholder="e.g., electronics" value={formData.slug} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Category description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{category ? "Update" : "Create"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

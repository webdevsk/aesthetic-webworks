"use client"

import { useEffect, useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createCategory, deleteCategory, getCategories, updateCategory } from "@/lib/actions"
import type { Category } from "@/lib/schemas"
import { Edit, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      setTitle(selectedCategory.title)
    } else {
      setTitle("")
    }
  }, [selectedCategory])

  async function fetchCategories() {
    toast.promise(
      async () => {
        const result = await getCategories()
        if ("error" in result) {
          throw new Error(result.error)
        }
        setCategories(result.data)
      },
      {
        loading: "Loading categories...",
        success: "Categories loaded",
        error: (err) => err.message || "Failed to fetch categories",
      }
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = selectedCategory
        ? await updateCategory(selectedCategory.id, { title })
        : await createCategory({ title })

      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsOpen(false)
      setSelectedCategory(null)
      setTitle("")
      toast.success(selectedCategory ? "Category updated" : "Category created")
      fetchCategories()
    } catch (error) {
      toast.error("Failed to save category")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(category: Category) {
    setIsLoading(true)
    try {
      const result = await deleteCategory(category.id)
      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsDeleteDialogOpen(false)
      setSelectedCategory(null)
      toast.success("Category deleted")
      // No need to manually fetch categories as the server action handles revalidation
    } catch (error) {
      toast.error("Failed to delete category")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button
          onClick={() => {
            setSelectedCategory(null)
            setIsOpen(true)
          }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.title}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsOpen(true)
                    }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedCategory(category)
                      setIsDeleteDialogOpen(true)
                    }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              {selectedCategory
                ? "Edit the category details below."
                : "Create a new category by entering a title below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : selectedCategory ? "Save Changes" : "Create Category"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedCategory && handleDelete(selectedCategory)} disabled={isLoading}>
              {isLoading ? "Loading..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

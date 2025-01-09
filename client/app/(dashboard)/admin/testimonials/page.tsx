"use client"

import { useEffect, useRef, useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from "@/lib/actions"
import type { Testimonial } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Edit, Plus, Trash2 } from "lucide-react"
import { X } from "lucide-react"
import { toast } from "sonner"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [keepExistingImage, setKeepExistingImage] = useState(true)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    toast.promise(
      async () => {
        const result = await getTestimonials()
        if ("error" in result) {
          throw new Error(result.error)
        }
        setTestimonials(result.data)
      },
      {
        loading: "Loading testimonials...",
        success: "Testimonials loaded",
        error: (err) => err.message || "Failed to fetch testimonials",
      }
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("authorImage") as File

    if ((keepExistingImage && selectedTestimonial?.author.image) || !imageFile || imageFile.size === 0) {
      formData.delete("authorImage")
    } else if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB")
        return
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(imageFile.type)) {
        toast.error("Only JPEG, PNG and WebP images are allowed")
        return
      }
    }

    setIsLoading(true)

    try {
      const result = selectedTestimonial
        ? await updateTestimonial(Number(selectedTestimonial.id), formData)
        : await createTestimonial(formData)

      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsOpen(false)
      setSelectedTestimonial(null)
      toast.success(selectedTestimonial ? "Testimonial updated" : "Testimonial created")
      fetchTestimonials()
    } catch (error) {
      toast.error("Failed to save testimonial")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    setIsLoading(true)
    try {
      const result = await deleteTestimonial(Number(testimonial.id))
      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsDeleteDialogOpen(false)
      setSelectedTestimonial(null)
      toast.success("Testimonial deleted")
      fetchTestimonials()
    } catch (error) {
      toast.error("Failed to delete testimonial")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setKeepExistingImage(!!selectedTestimonial?.author.image)
    }
  }, [isOpen, selectedTestimonial])

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Button
          onClick={() => {
            setSelectedTestimonial(null)
            setIsOpen(true)
          }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Testimonial
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testimonials.map((testimonial) => (
            <TableRow key={testimonial.id}>
              <TableCell>{testimonial.author.name}</TableCell>
              <TableCell>{testimonial.author.company || "-"}</TableCell>
              <TableCell className="max-w-md truncate">{testimonial.content}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedTestimonial(testimonial)
                      setIsOpen(true)
                    }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedTestimonial(testimonial)
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
            <DialogTitle>{selectedTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
            <DialogDescription>
              {selectedTestimonial
                ? "Edit the testimonial details below."
                : "Create a new testimonial by filling out the form below."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="authorName">Author Name</Label>
              <Input id="authorName" name="authorName" defaultValue={selectedTestimonial?.author.name} required />
            </div>
            <div>
              <Label htmlFor="authorCompany">Company</Label>
              <Input id="authorCompany" name="authorCompany" defaultValue={selectedTestimonial?.author.company || ""} />
            </div>
            <div>
              <Label htmlFor="authorImage">Author Image</Label>
              <div className="space-y-4">
                {selectedTestimonial?.author.image && (
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + selectedTestimonial.author.image}
                        alt="Current author image"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        Current image: {selectedTestimonial.author.image.split("/").pop()}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="keepImage"
                          checked={keepExistingImage}
                          onChange={(e) => {
                            setKeepExistingImage(e.target.checked)
                            if (e.target.checked && fileInputRef.current) {
                              fileInputRef.current.value = ""
                            }
                          }}
                        />
                        <Label htmlFor="keepImage" className="text-sm">
                          Keep existing image
                        </Label>
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={cn("space-y-2", keepExistingImage && selectedTestimonial?.author.image && "opacity-50")}>
                  <Input
                    id="authorImage"
                    name="authorImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={fileInputRef}
                    disabled={keepExistingImage && !!selectedTestimonial?.author.image}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        if (e.target.files[0].size > 1024 * 1024) {
                          toast.error("Image size must be less than 1MB")
                          e.target.value = ""
                          return
                        }
                        if (!["image/jpeg", "image/png", "image/webp"].includes(e.target.files[0].type)) {
                          toast.error("Only JPEG, PNG and WebP images are allowed")
                          e.target.value = ""
                          return
                        }
                      }
                    }}
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum file size: 1MB. Allowed formats: JPEG, PNG, WebP
                  </p>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" name="content" defaultValue={selectedTestimonial?.content} required />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : selectedTestimonial ? "Save Changes" : "Create Testimonial"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the testimonial.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedTestimonial && handleDelete(selectedTestimonial)}
              disabled={isLoading}>
              {isLoading ? "Loading..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

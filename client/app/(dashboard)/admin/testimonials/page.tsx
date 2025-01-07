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
import { Textarea } from "@/components/ui/textarea"
import { adminApi } from "@/lib/api-client"
import type { Testimonial } from "@/lib/api-client"
import { Edit, Plus, Trash2 } from "lucide-react"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    authorName: "",
    authorCompany: "",
    authorImage: null as File | null,
    content: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  useEffect(() => {
    if (selectedTestimonial) {
      setFormData({
        authorName: selectedTestimonial.author.name,
        authorCompany: selectedTestimonial.author.company || "",
        authorImage: null,
        content: selectedTestimonial.content,
      })
    } else {
      setFormData({
        authorName: "",
        authorCompany: "",
        authorImage: null,
        content: "",
      })
    }
  }, [selectedTestimonial])

  async function fetchTestimonials() {
    try {
      const data = await adminApi.testimonials.list()
      setTestimonials(data)
    } catch (error) {
      console.error("Failed to fetch testimonials:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("authorName", formData.authorName)
    formDataToSend.append("authorCompany", formData.authorCompany)
    if (formData.authorImage) {
      formDataToSend.append("authorImage", formData.authorImage)
    }
    formDataToSend.append("content", formData.content)

    try {
      if (selectedTestimonial) {
        await adminApi.testimonials.update(Number(selectedTestimonial.id), formDataToSend)
      } else {
        await adminApi.testimonials.create(formDataToSend)
      }

      setIsOpen(false)
      setSelectedTestimonial(null)
      setFormData({
        authorName: "",
        authorCompany: "",
        authorImage: null,
        content: "",
      })
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to save testimonial:", error)
    }
  }

  async function handleDelete(testimonial: Testimonial) {
    try {
      await adminApi.testimonials.delete(Number(testimonial.id))
      setIsDeleteDialogOpen(false)
      setSelectedTestimonial(null)
      fetchTestimonials()
    } catch (error) {
      console.error("Failed to delete testimonial:", error)
    }
  }

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
            <TableHead>Image</TableHead>
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
                {testimonial.author.image ? (
                  <img
                    src={testimonial.author.image}
                    alt={testimonial.author.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  "No image"
                )}
              </TableCell>
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
              <Input
                id="authorName"
                value={formData.authorName}
                onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="authorCompany">Author Company</Label>
              <Input
                id="authorCompany"
                value={formData.authorCompany}
                onChange={(e) => setFormData({ ...formData, authorCompany: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="authorImage">Author Image</Label>
              <Input
                id="authorImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    authorImage: e.target.files?.[0] || null,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {selectedTestimonial ? "Save Changes" : "Create Testimonial"}
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
            <AlertDialogAction onClick={() => selectedTestimonial && handleDelete(selectedTestimonial)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

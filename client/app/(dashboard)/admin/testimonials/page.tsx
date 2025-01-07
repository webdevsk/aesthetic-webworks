"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

interface Testimonial {
  id: string
  author: {
    name: string
    company?: string
    image?: string
  }
  content: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    authorName: "",
    authorCompany: "",
    authorImage: null as File | null,
    content: "",
  })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  async function fetchTestimonials() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`)
      const data = await response.json()
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          authorName: "",
          authorCompany: "",
          authorImage: null,
          content: "",
        })
        fetchTestimonials()
      }
    } catch (error) {
      console.error("Failed to create testimonial:", error)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Testimonials</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Testimonial</DialogTitle>
              <DialogDescription>Create a new testimonial by filling out the form below.</DialogDescription>
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
                Create Testimonial
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Author</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Image</TableHead>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

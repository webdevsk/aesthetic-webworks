"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Plus } from "lucide-react"

interface Project {
  id: number
  title: string
  slug: string
  image?: string
  isLatest: boolean
  categories: string[]
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    image: null as File | null,
    isLatest: false,
    categories: [] as string[],
  })

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  async function fetchProjects() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`)
      const data = await response.json()
      setProjects(data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  async function fetchCategories() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
      const data = await response.json()
      setCategories(data.map((cat: any) => cat.title))
    } catch (error) {
      console.error("Failed to fetch categories:", error)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("title", formData.title)
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }
    formDataToSend.append("isLatest", String(formData.isLatest))
    formDataToSend.append("categories", formData.categories.join(","))

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects`, {
        method: "POST",
        body: formDataToSend,
      })

      if (response.ok) {
        setIsOpen(false)
        setFormData({
          title: "",
          image: null,
          isLatest: false,
          categories: [],
        })
        fetchProjects()
      }
    } catch (error) {
      console.error("Failed to create project:", error)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>Create a new project by filling out the form below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      image: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isLatest"
                  checked={formData.isLatest}
                  onCheckedChange={(checked) => setFormData({ ...formData, isLatest: checked as boolean })}
                />
                <Label htmlFor="isLatest">Mark as Latest Project</Label>
              </div>
              <div>
                <Label>Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={formData.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              categories: [...formData.categories, category],
                            })
                          } else {
                            setFormData({
                              ...formData,
                              categories: formData.categories.filter((cat) => cat !== category),
                            })
                          }
                        }}
                      />
                      <Label htmlFor={category}>{category}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <Button type="submit" className="w-full">
                Create Project
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Latest</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.categories.join(", ")}</TableCell>
              <TableCell>{project.isLatest ? "Yes" : "No"}</TableCell>
              <TableCell>
                {project.image ? (
                  <img src={project.image} alt={project.title} className="h-16 w-16 rounded object-cover" />
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

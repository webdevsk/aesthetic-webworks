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
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { adminApi } from "@/lib/api-client"
import type { Project } from "@/lib/api-client"
import { Edit, Plus, Trash2 } from "lucide-react"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
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

  useEffect(() => {
    if (selectedProject) {
      setFormData({
        title: selectedProject.title,
        image: null,
        isLatest: selectedProject.isLatest,
        categories: selectedProject.categories,
      })
    } else {
      setFormData({
        title: "",
        image: null,
        isLatest: false,
        categories: [],
      })
    }
  }, [selectedProject])

  async function fetchProjects() {
    try {
      const data = await adminApi.projects.list()
      setProjects(data)
    } catch (error) {
      console.error("Failed to fetch projects:", error)
    }
  }

  async function fetchCategories() {
    try {
      const data = await adminApi.categories.list()
      setCategories(data.map((cat) => cat.title))
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
      if (selectedProject) {
        await adminApi.projects.update(selectedProject.id, formDataToSend)
      } else {
        await adminApi.projects.create(formDataToSend)
      }

      setIsOpen(false)
      setSelectedProject(null)
      setFormData({
        title: "",
        image: null,
        isLatest: false,
        categories: [],
      })
      fetchProjects()
    } catch (error) {
      console.error("Failed to save project:", error)
    }
  }

  async function handleDelete(project: Project) {
    try {
      await adminApi.projects.delete(project.id)
      setIsDeleteDialogOpen(false)
      setSelectedProject(null)
      fetchProjects()
    } catch (error) {
      console.error("Failed to delete project:", error)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button
          onClick={() => {
            setSelectedProject(null)
            setIsOpen(true)
          }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Categories</TableHead>
            <TableHead>Latest</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
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
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedProject(project)
                      setIsOpen(true)
                    }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setSelectedProject(project)
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
            <DialogTitle>{selectedProject ? "Edit Project" : "Add New Project"}</DialogTitle>
            <DialogDescription>
              {selectedProject
                ? "Edit the project details below."
                : "Create a new project by filling out the form below."}
            </DialogDescription>
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
              {selectedProject ? "Save Changes" : "Create Project"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => selectedProject && handleDelete(selectedProject)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

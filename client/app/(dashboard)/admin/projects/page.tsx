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
import { MultiCombobox } from "@/components/ui/multi-combobox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createCategory, createProject, deleteProject, getCategories, getProjects, updateProject } from "@/lib/actions"
import type { Category, Project } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Edit, Plus, Trash2, X } from "lucide-react"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [keepExistingImage, setKeepExistingImage] = useState(true)

  useEffect(() => {
    fetchProjects()
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      setSelectedCategories(selectedProject.categories || [])
    } else {
      setSelectedCategories([])
    }
  }, [selectedProject])

  async function fetchCategories() {
    const result = await getCategories()
    if ("error" in result) {
      toast.error(result.error)
      return
    }
    setCategories(result.data)
  }

  async function fetchProjects() {
    toast.promise(
      async () => {
        const result = await getProjects()
        if ("error" in result) {
          throw new Error(result.error)
        }
        setProjects(result.data)
      },
      {
        loading: "Loading projects...",
        success: "Projects loaded",
        error: (err) => err.message || "Failed to fetch projects",
      }
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("image") as File

    // Remove image field if no new image is provided or if keeping existing image
    if ((keepExistingImage && selectedProject?.image) || !imageFile || imageFile.size === 0) {
      formData.delete("image")
    } else if (imageFile && imageFile.size > 0) {
      if (imageFile.size > 1024 * 1024) {
        toast.error("Image size must be less than 1MB")
        setIsLoading(false)
        return
      }

      const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
      if (!allowedTypes.includes(imageFile.type)) {
        toast.error("Only JPEG, PNG and WebP images are allowed")
        setIsLoading(false)
        return
      }
    }

    // Add categories to form data
    formData.delete("categories")
    for (const category of selectedCategories) {
      formData.append("categories", category)
    }

    try {
      // Create any new categories first
      const newCategories = selectedCategories.filter((category) => !categories.find((c) => c.title === category))

      await Promise.all(
        newCategories.map(async (title) => {
          const result = await createCategory({ title })
          if ("error" in result) {
            throw new Error(`Failed to create category: ${result.error}`)
          }
        })
      )
      // Then create/update the project
      const result = selectedProject
        ? await updateProject(Number(selectedProject.id), formData)
        : await createProject(formData)

      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsOpen(false)
      setSelectedProject(null)
      setSelectedCategories([])
      toast.success(selectedProject ? "Project updated" : "Project created")
      fetchProjects()
      fetchCategories()
    } catch (error) {
      toast.error("Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(project: Project) {
    setIsLoading(true)
    try {
      const result = await deleteProject(Number(project.id))
      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsDeleteDialogOpen(false)
      setSelectedProject(null)
      toast.success("Project deleted")
      fetchProjects()
    } catch (error) {
      toast.error("Failed to delete project")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      setKeepExistingImage(!!selectedProject?.image)
    }
  }, [isOpen, selectedProject])

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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.categories?.join(", ") || "-"}</TableCell>
              <TableCell>{project.isLatest ? "Yes" : "No"}</TableCell>
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
              <Input id="title" name="title" defaultValue={selectedProject?.title} required />
            </div>
            <div>
              <Label htmlFor="categories">Categories</Label>
              <MultiCombobox
                items={categories.map((category) => ({
                  value: category.title,
                  label: category.title,
                }))}
                selectedValues={selectedCategories}
                onSelect={setSelectedCategories}
                placeholder="Select or create categories..."
                emptyText="No categories found."
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="space-y-4">
                {selectedProject?.image && (
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={process.env.NEXT_PUBLIC_API_URL + selectedProject.image}
                        alt="Current project image"
                        className="h-full w-full rounded-md object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Current image: {selectedProject.image.split("/").pop()}</p>
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
                <div className={cn("space-y-2", keepExistingImage && selectedProject?.image && "opacity-50")}>
                  <Input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    ref={fileInputRef}
                    disabled={keepExistingImage && !!selectedProject?.image}
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
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="isLatest" name="isLatest" defaultChecked={selectedProject?.isLatest} />
              <Label htmlFor="isLatest">Latest Project</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : selectedProject ? "Save Changes" : "Create Project"}
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
            <AlertDialogAction onClick={() => selectedProject && handleDelete(selectedProject)} disabled={isLoading}>
              {isLoading ? "Loading..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

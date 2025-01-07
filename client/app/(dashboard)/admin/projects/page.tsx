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
import { createProject, deleteProject, getProjects, updateProject } from "@/lib/actions"
import type { Project } from "@/lib/actions"
import { Edit, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

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

    const formData = new FormData(e.currentTarget)
    const imageFile = formData.get("image") as File

    if (imageFile && imageFile.size > 0) {
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
      const result = selectedProject ? await updateProject(selectedProject.id, formData) : await createProject(formData)

      if ("error" in result) {
        toast.error(result.error)
        return
      }

      setIsOpen(false)
      setSelectedProject(null)
      toast.success(selectedProject ? "Project updated" : "Project created")
      fetchProjects()
    } catch (error) {
      toast.error("Failed to save project")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleDelete(project: Project) {
    setIsLoading(true)
    try {
      const result = await deleteProject(project.id)
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
            <TableHead>Slug</TableHead>
            <TableHead>Latest</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.slug}</TableCell>
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
              <Label htmlFor="image">Image</Label>
              <Input id="image" name="image" type="file" accept="image/jpeg,image/png,image/webp" />
              <p className="mt-1 text-sm text-muted-foreground">
                Maximum file size: 1MB. Allowed formats: JPEG, PNG, WebP
              </p>
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

"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Project, User } from "@/models/models";
import AddProjectButton from "./addProjectButton";
import {
  IconCircleDashedCheck,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useToast } from "@/hooks/use-toast";

interface props {
  user: User;
  admin: string;
}

const ProjectsSection: React.FC<props> = ({ user, admin }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Deleting Project
  const deleteProject = async (project: Project) => {
    try {
      const response = await fetch("/api/projects", {
        method: "DELETE",
        body: JSON.stringify({
          _id: project._id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      toast({title: "Project Deleted!"});
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  // Marking Project Complete
  // Deleting Project
  const completedProject = async (project: Project) => {
    try {
      const response = await fetch("/api/projects", {
        method: "PUT",
        body: JSON.stringify({
          _id: project._id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      });
      toast({title: "Project Marked as completed!"});
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      {user?.email === admin && <AddProjectButton />}
      {loading ? (
        <div className="w-full flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project: Project) => (
            <div
              key={project._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={`https://utfs.io/f/${project.image}`}
                alt={project.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center justify-between">
                  {project.title}
                  {user?.email === admin && (
                    <div className="space-x-4">
                      <button
                        className="text-blue-500 hover:text-blue-700 transition"
                        onClick={() => completedProject(project)}
                        title="Mark as Complete"
                      >
                        <IconCircleDashedCheck size={20} />
                      </button>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            className="text-red-500 hover:text-red-700 transition"
                            title="Delete Project"
                          >
                            <IconTrash size={20} />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="font-medium leading-none">
                                Delete this Project
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Are your sure want to delete this Project?
                              </p>
                            </div>
                            <div className="grid gap-2">
                              <Button onClick={() => deleteProject(project)}>
                                Yes
                              </Button>
                              <Button>No</Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Lead: {project.leadName} (
                  <a
                    href={`mailto:${project.leadEmail}`}
                    className="text-blue-500"
                  >
                    {project.leadEmail}
                  </a>
                  )
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Start Date: {new Date(project.startDate).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  End Date:{" "}
                  {project.completed
                    ? new Date(project.endDate).toLocaleDateString()
                    : "Ongoing"}
                </p>
                <div
                  className={`mt-4 px-3 py-1 rounded-full text-sm font-medium ${
                    project.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {project.completed ? "Completed" : "Ongoing"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectsSection;

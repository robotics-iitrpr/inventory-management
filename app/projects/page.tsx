import ProjectsSection from "@/components/projectsSection";
import { User } from "@/models/models";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const ProjectsPage = async () => {
  const user = await currentUser();

  const curUser: User = {
    id: user?.id!,
    name: user?.fullName!,
    email: user?.primaryEmailAddress?.emailAddress!,
  };
  return <ProjectsSection user={curUser} admin={process.env.ADMIN!} />;
};

export default ProjectsPage;

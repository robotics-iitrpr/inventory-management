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
  const admins = process.env.ADMIN?.split(",");
  let isAdmin = false;
  admins!.forEach((admin) => {
    if (curUser.email === admin) {
      isAdmin = true;
    }
  });
  return <ProjectsSection user={curUser} isAdmin={isAdmin} />;
};

export default ProjectsPage;

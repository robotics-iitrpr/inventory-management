import AddInventoryButton from "@/components/addInventoryButton";
import InventoryTable from "@/components/InventoryTable";
import { User } from "@/models/models";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const InventoryPage = async () => {
  const user = await currentUser();

  const curUser: User = {
    id: user?.id!,
    name: user?.fullName!,
    email:user?.primaryEmailAddress?.emailAddress!
  }
  const admins = process.env.ADMIN?.split(',');
  let isAdmin = false;
  admins!.forEach((admin) => {
    if (curUser.email === admin) {
      isAdmin = true;
    }
  });
  return (
    <div className="mt-10 mx-5 rounded-xl p-3 shadow-lg border border-gray-200 relative mb-5">
      {isAdmin && (
        <AddInventoryButton />
      )}
      <InventoryTable user={curUser} isAdmin={isAdmin}/>
    </div>
  );
};

export default InventoryPage;

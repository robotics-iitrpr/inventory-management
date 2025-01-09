import AddInventoryButton from "@/components/addInventoryButton";
import InventoryTable from "@/components/InventoryTable";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const InventoryPage = async () => {
  const user = await currentUser();
  return (
    <div className="mt-10 mx-5 rounded-xl p-3 border border-black">
      {user?.primaryEmailAddress?.emailAddress === process.env.ADMIN && (
        <AddInventoryButton />
      )}
      <InventoryTable email={user?.primaryEmailAddress?.emailAddress!} admin={process.env.ADMIN!}/>
    </div>
  );
};

export default InventoryPage;

import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { IconTrash } from "@tabler/icons-react";
import { Component, User } from "@/models/models";

interface props {
  user: User;
  component: Component;
}

const DeleteInventoryButton: React.FC<props> = ({ user, component }) => {
  const deleteInventory = async () => {
    try {
      const response = await fetch(`/api/inventory`, {
        method: "DELETE",
        body: JSON.stringify({
          _id: component._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="bg-red-700">
          <IconTrash />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Delete this Inventory</h4>
            <p className="text-sm text-muted-foreground">
              Are your sure want to delete this Inventory?
            </p>
          </div>
          <div className="grid gap-2">
            <Button onClick={deleteInventory}>Yes</Button>
            <Button>No</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DeleteInventoryButton;

"use client";

import React, { useEffect, useState } from "react";
import { Tabs } from "@chakra-ui/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { IconInfoCircle } from "@tabler/icons-react";
import { format } from "date-fns";

const RequestsTabular = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // getting Requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/requests");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Filter and set specific requests
        setPendingRequests(
          data.requests.filter((req: any) => req.status === "Pending")
        );
        setApprovedRequests(
          data.requests.filter((req: any) => req.status === "Approved")
        );
        setRejectedRequests(
          data.requests.filter((req: any) => req.status === "Rejected")
        );
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to load requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Function to update request status
  const updateRequestStatus = async (
    requestId: string,
    quantityNeeded: number,
    status: string,
    componentId: string
  ) => {
    let alreadyBeingUsed = 0;
    if (status === "Approved") {
      // Checking Stock
      try {
        const response = await fetch("/api/inventory");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Find the component in the inventory
        const component = data.inventory.find(
          (item: any) => item._id === componentId
        );

        if (!component) {
          return {
            success: false,
            message: "Component not found in inventory.",
          };
        }

        // Check stock availability
        if (component.inStock - component.inUse >= quantityNeeded) {
          alreadyBeingUsed = component.inUse;
        } else {
          // Insufficient stock
          
          alert(`Insufficient stock. Available: ${component.inStock - component.inUse}, Required: ${quantityNeeded}.`);
          return;
        }
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    }
    else
      return;

    // Updating Stock
    try {
      const response = await fetch(`/api/inventory`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: 0,
          _id: componentId,
          quantity: alreadyBeingUsed + quantityNeeded,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update status.");
      }

      alert(result.message);
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message);
    }

    // Updating status
    try {
      const response = await fetch(`/api/request`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ _id: requestId, status: status, task: 0 }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update status.");
      }
    } catch (err: any) {
      console.error("Error updating status:", err);
      alert(err.message);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Tabs.Root defaultValue="pending" className="w-full">
      <Tabs.List className="flex justify-around bg-gray-100 rounded-md p-2">
        <Tabs.Trigger
          value="pending"
          className="px-6 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
        >
          Pending
        </Tabs.Trigger>
        <Tabs.Trigger
          value="approved"
          className="px-6 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
        >
          Approved
        </Tabs.Trigger>
        <Tabs.Trigger
          value="rejected"
          className="px-6 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-200 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-md"
        >
          Rejected
        </Tabs.Trigger>
      </Tabs.List>

      {/* Pending Tab */}
      <Tabs.Content
        value="pending"
        className="p-6 mt-4 bg-gray-50 rounded-md text-gray-700 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4">Pending Requests</h2>
        {pendingRequests.length > 0 ? (
          <ul className="space-y-4">
            {pendingRequests.map((req: any) => (
              <li
                key={req._id}
                className="p-4 bg-white shadow-md rounded-md border border-gray-200"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Name: <span className="font-normal">{req.name}</span>
                    </p>
                    <p className="font-semibold text-gray-800">
                      Component:{" "}
                      <span className="font-normal">{req.component}</span> (x
                      {req.quantity})
                    </p>
                    <p className="font-semibold text-gray-800">
                      Return Date:{" "}
                      <span className="font-normal">
                        {format(new Date(req.date), "dd-MM-yyyy")}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center">
                      Purpose:
                      <span
                        className="ml-2 text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]"
                        title={req.purpose}
                      >
                        {req.purpose}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger>
                        <IconInfoCircle />
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="p-4 bg-white shadow-md border border-gray-300 rounded-md"
                      >
                        <p className="font-semibold">Name: {req.name}</p>
                        <p>Email: {req.email}</p>
                        <p>Phone: {req.phone}</p>
                        <p>
                          Component: {req.component} (x{req.quantity})
                        </p>
                        <p>Purpose: {req.purpose}</p>
                        <p>Return: {req.date}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() =>
                      updateRequestStatus(
                        req._id,
                        req.quantity,
                        "Approved",
                        req.inventoryId
                      )
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600"
                  >
                    ✓ Approve
                  </button>
                  <button
                    onClick={() =>
                      updateRequestStatus(
                        req._id,
                        req.quantity,
                        "Rejected",
                        req.inventoryId
                      )
                    }
                    className="px-4 py-2 bg-red-500 text-white rounded-md shadow hover:bg-red-600"
                  >
                    ✕ Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No pending requests.</p>
        )}
      </Tabs.Content>

      {/* Approved Tab */}
      <Tabs.Content
        value="approved"
        className="p-6 mt-4 bg-gray-50 rounded-md text-gray-700 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4">Approved Requests</h2>
        {approvedRequests.length > 0 ? (
          <ul className="space-y-4">
            {approvedRequests.map((req: any) => (
              <li
                key={req._id}
                className="p-4 bg-white shadow-md rounded-md border border-gray-200"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Name: <span className="font-normal">{req.name}</span>
                    </p>
                    <p className="font-semibold text-gray-800">
                      Component:{" "}
                      <span className="font-normal">{req.component}</span> (x
                      {req.quantity})
                    </p>
                    <p className="font-semibold text-gray-800">
                      Return Date:{" "}
                      <span className="font-normal">
                        {format(new Date(req.date), "dd-MM-yyyy")}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center">
                      Purpose:
                      <span
                        className="ml-2 text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]"
                        title={req.purpose}
                      >
                        {req.purpose}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger>
                        <IconInfoCircle />
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="p-4 bg-white shadow-md border border-gray-300 rounded-md"
                      >
                        <p className="font-semibold">Name: {req.name}</p>
                        <p>Email: {req.email}</p>
                        <p>Phone: {req.phone}</p>
                        <p>
                          Component: {req.component} (x{req.quantity})
                        </p>
                        <p>Purpose: {req.purpose}</p>
                        <p>Return: {format(new Date(req.date), "dd-MM-yyyy")}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No approved requests.</p>
        )}
      </Tabs.Content>

      {/* Rejected Tab */}
      <Tabs.Content
        value="rejected"
        className="p-6 mt-4 bg-gray-50 rounded-md text-gray-700 shadow-sm"
      >
        <h2 className="text-lg font-bold mb-4">Rejected Requests</h2>
        {rejectedRequests.length > 0 ? (
          <ul className="space-y-4">
            {rejectedRequests.map((req: any) => (
              <li
                key={req._id}
                className="p-4 bg-white shadow-md rounded-md border border-gray-200"
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Name: <span className="font-normal">{req.name}</span>
                    </p>
                    <p className="font-semibold text-gray-800">
                      Component:{" "}
                      <span className="font-normal">{req.component}</span> (x
                      {req.quantity})
                    </p>
                    <p className="font-semibold text-gray-800">
                      Return Date:{" "}
                      <span className="font-normal">
                        {format(new Date(req.date), "dd-MM-yyyy")}
                      </span>
                    </p>
                    <p className="font-semibold text-gray-800 flex items-center">
                      Purpose:
                      <span
                        className="ml-2 text-gray-600 text-ellipsis overflow-hidden whitespace-nowrap max-w-[200px]"
                        title={req.purpose}
                      >
                        {req.purpose}
                      </span>
                    </p>
                  </div>
                  <div>
                    <Popover>
                      <PopoverTrigger>
                        <IconInfoCircle />
                      </PopoverTrigger>
                      <PopoverContent
                        side="right"
                        align="start"
                        className="p-4 bg-white shadow-md border border-gray-300 rounded-md"
                      >
                        <p className="font-semibold">Name: {req.name}</p>
                        <p>Email: {req.email}</p>
                        <p>Phone: {req.phone}</p>
                        <p>
                          Component: {req.component} (x{req.quantity})
                        </p>
                        <p>Purpose: {req.purpose}</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rejected requests.</p>
        )}
      </Tabs.Content>
    </Tabs.Root>
  );
};

export default RequestsTabular;

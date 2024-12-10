import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import Layout from "../components/Layout";
import { EntityTypesTable } from "./entity-types/EntityTypesTable";
import { CreateEntityTypeDialog } from "./entity-types/CreateEntityTypeDialog";
import { fetchEntityTypes, createEntityType } from "@/api/entityManagement";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const EntityManagementPage = () => {
  const [entityTypes, setEntityTypes] = useState([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch entity types on component mount
  useEffect(() => {
    const loadEntityTypes = async () => {
      try {
        const response = await fetchEntityTypes();
        setEntityTypes(
          response.result || [
            // Hardcoded sample data for initial design
            {
              id: 1,
              value: "user",
              label: "User",
              description: "System users and access management",
              total_entities: 25,
              created_at: "2024-01-15",
            },
            {
              id: 2,
              value: "role",
              label: "Role",
              description: "User roles and permissions",
              total_entities: 10,
              created_at: "2024-02-01",
            },
            {
              id: 3,
              value: "department",
              label: "Department",
              description: "Organizational departments",
              total_entities: 15,
              created_at: "2024-03-10",
            },
          ]
        );
      } catch (error) {
        console.error("Failed to fetch entity types", error);
        toast({
          title: "Error",
          description: "Failed to load entity types",
          variant: "destructive",
        });
      }
    };
    loadEntityTypes();
  }, []);

  // Create a new entity type
  const handleCreateEntityType = async (newEntityTypeData) => {
    try {
      const response = await createEntityType(newEntityTypeData);

      // Update local state with new entity type
      setEntityTypes((prevTypes) => [...prevTypes, response.result]);

      toast({
        description: "Entity Type Created Successfully",
      });

      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create entity type", error);
      toast({
        title: "Error",
        description: "Failed to create entity type.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Entity Management</h1>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Entity Type
          </Button>
        </div>

        <EntityTypesTable
          entityTypes={entityTypes}
          onUpdateEntityTypes={setEntityTypes}
        />

        <CreateEntityTypeDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreate={handleCreateEntityType}
        />
      </div>
    </Layout>
  );
};

export default EntityManagementPage;

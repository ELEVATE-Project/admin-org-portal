import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  fetchEntityTypes,
  fetchEntitiesByType,
  createEntityType,
  createEntity,
  inheritEntityType,
} from "@/api/entityManagement";
import Layout from "../components/Layout";
import CreateEntityTypeDialog from "./CreateEntityTypeDialog";
import { toast } from "@/hooks/use-toast";

const EntityManagementPage = () => {
  const [entityTypes, setEntityTypes] = useState([]);
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [entities, setEntities] = useState([]);
  const [newEntityType, setNewEntityType] = useState({ value: "", label: "" });
  const [newEntity, setNewEntity] = useState({
    value: "",
    label: "",
    entity_type_id: null,
  });

  // Fetch entity types on component mount
  useEffect(() => {
    const loadEntityTypes = async () => {
      try {
        const response = await fetchEntityTypes();
        setEntityTypes(response.result);
      } catch (error) {
        console.error("Failed to fetch entity types", error);
      }
    };
    loadEntityTypes();
  }, []);

  // Fetch entities when an entity type is selected
  const handleEntityTypeSelect = async (entityType) => {
    try {
      setSelectedEntityType(entityType);
      const response = await fetchEntitiesByType(entityType.id);
      setEntities(response.result.data);
    } catch (error) {
      console.error("Failed to fetch entities", error);
    }
  };

  // Create a new entity type
  const handleCreateEntityType = async (newEntityTypeData) => {
    try {
      const response = await createEntityType(newEntityTypeData);

      // Update local state with new entity type
      setEntityTypes((prevTypes) => [...prevTypes, response.result]);

      toast({
        description: "Created",
      });
      window.location.reload();
      // loadEntityTypes();
    } catch (error) {
      console.error("Failed to create entity type", error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive",
      });
    }
  };

  // Create a new entity
  const handleCreateEntity = async () => {
    try {
      const entityToCreate = {
        ...newEntity,
        entity_type_id: selectedEntityType.id,
      };
      const response = await createEntity(entityToCreate);
      setEntities([...entities, response.result]);
      setNewEntity({ value: "", label: "" });
    } catch (error) {
      console.error("Failed to create entity", error);
    }
  };

  // Inherit entity type
  const handleInheritEntityType = async (sourceType, targetLabel) => {
    try {
      await inheritEntityType({
        entity_type_value: sourceType,
        target_entity_type_label: targetLabel,
      });
      // Refresh entity types or show success message
    } catch (error) {
      console.error("Failed to inherit entity type", error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-4">Entity Management</h1>

        {/* Entity Types Section */}
        <Card>
          <CardHeader>
            <CardTitle>Entity Types</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Create Entity Type Dialog */}
            <CreateEntityTypeDialog onCreate={handleCreateEntityType} />

            {/* Entity Types List */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              {entityTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={
                    selectedEntityType?.id === type.id ? "default" : "outline"
                  }
                  onClick={() => handleEntityTypeSelect(type)}
                >
                  {type.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Entities Section */}
        {selectedEntityType && (
          <Card>
            <CardHeader>
              <CardTitle>Entities for {selectedEntityType.label}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Create Entity Dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Create Entity</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Create New Entity for {selectedEntityType.label}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entityValue" className="text-right">
                        Value
                      </Label>
                      <Input
                        id="entityValue"
                        value={newEntity.value}
                        onChange={(e) =>
                          setNewEntity({ ...newEntity, value: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="entityLabel" className="text-right">
                        Label
                      </Label>
                      <Input
                        id="entityLabel"
                        value={newEntity.label}
                        onChange={(e) =>
                          setNewEntity({ ...newEntity, label: e.target.value })
                        }
                        className="col-span-3"
                      />
                    </div>
                    <Button onClick={handleCreateEntity}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Entities Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {entities.map((entity) => (
                    <TableRow key={entity.id}>
                      <TableCell>{entity.id}</TableCell>
                      <TableCell>{entity.value}</TableCell>
                      <TableCell>{entity.label}</TableCell>
                      <TableCell>{entity.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Inherit Entity Type */}
        <Card>
          <CardHeader>
            <CardTitle>Inherit Entity Type</CardTitle>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Inherit Entity Type</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Inherit Entity Type</DialogTitle>
                </DialogHeader>
                {/* You would implement a form here to select source and target entity types */}
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EntityManagementPage;

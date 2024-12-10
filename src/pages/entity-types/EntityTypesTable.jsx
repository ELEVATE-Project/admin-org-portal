import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Eye, Pencil, Trash2, GitFork } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteEntityType } from "@/api/entityManagement";
import { EntitiesListDialog } from "./EntitiesListDialog";
import { InheritEntityTypeDialog } from "./InheritEntityTypeDialog";

export const EntityTypesTable = ({
  entityTypes,
  onUpdateEntityTypes,
  onInheritSuccess,
}) => {
  const [selectedEntityType, setSelectedEntityType] = useState(null);
  const [isEntitiesDialogOpen, setIsEntitiesDialogOpen] = useState(false);
  const [isInheritDialogOpen, setIsInheritDialogOpen] = useState(false);

  const handleViewEntities = (entityType) => {
    setSelectedEntityType(entityType);
    setIsEntitiesDialogOpen(true);
  };

  const handleDeleteEntityType = async (id) => {
    await deleteEntityType(id);
    onUpdateEntityTypes(entityTypes.filter((type) => type.id !== id));
  };

  const handleInheritClick = (entityType) => {
    setSelectedEntityType(entityType);
    setIsInheritDialogOpen(true);
  };

  const handleEntitiesDialogClose = () => {
    setIsEntitiesDialogOpen(false);
    setSelectedEntityType(null);
  };

  const handleInheritDialogClose = () => {
    setIsInheritDialogOpen(false);
    setSelectedEntityType(null);
  };

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Model Names</TableHead>
              <TableHead>Data Type</TableHead>
              <TableHead>Filterable</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entityTypes.map((type) => (
              <TableRow
                key={type.id}
                className="cursor-pointer hover:bg-accent"
              >
                <TableCell>{type.label}</TableCell>
                <TableCell>{type.value}</TableCell>
                <TableCell>
                  {type.model_names.map((modelName) => (
                    <span
                      key={modelName}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-1"
                    >
                      {modelName}
                    </span>
                  ))}
                </TableCell>
                <TableCell>{type.data_type}</TableCell>
                <TableCell>{type.allow_filtering ? "Yes" : "No"}</TableCell>
                <TableCell>{type.created_at}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => handleViewEntities(type)}
                      >
                        <Eye className="mr-2 h-4 w-4" /> View Entities
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleInheritClick(type)}
                        className="text-blue-500"
                      >
                        <GitFork className="mr-2 h-4 w-4" /> Inherit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleDeleteEntityType(type.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {isEntitiesDialogOpen && selectedEntityType && (
        <EntitiesListDialog
          open={isEntitiesDialogOpen}
          onOpenChange={handleEntitiesDialogClose}
          entityType={selectedEntityType}
        />
      )}
      {isInheritDialogOpen && selectedEntityType && (
        <InheritEntityTypeDialog
          open={isInheritDialogOpen}
          onOpenChange={handleInheritDialogClose}
          entityType={selectedEntityType}
          onInheritSuccess={onInheritSuccess}
        />
      )}
    </>
  );
};

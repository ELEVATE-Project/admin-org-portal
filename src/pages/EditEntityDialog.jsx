import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const EditEntityDialog = ({
  open,
  onOpenChange,
  onEdit,
  entityType,
  initialEntity,
}) => {
  const [entity, setEntity] = useState({
    value: "",
    label: "",
    status: "ACTIVE",
  });

  // Populate form with initial entity data
  useEffect(() => {
    if (initialEntity) {
      setEntity({
        value: initialEntity.value,
        label: initialEntity.label,
        status: initialEntity.status,
      });
    }
  }, [initialEntity]);

  const handleSubmit = () => {
    onEdit(entity);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Entity for {entityType.label}</DialogTitle>
          <DialogDescription>
            Modify details of the existing entity
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value
            </Label>
            <Input
              id="value"
              value={entity.value}
              onChange={(e) =>
                setEntity((prev) => ({
                  ...prev,
                  value: e.target.value,
                }))
              }
              placeholder="Unique identifier"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right">
              Label
            </Label>
            <Input
              id="label"
              value={entity.label}
              onChange={(e) =>
                setEntity((prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="Display name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select
              value={entity.status}
              onValueChange={(value) =>
                setEntity((prev) => ({
                  ...prev,
                  status: value,
                }))
              }
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

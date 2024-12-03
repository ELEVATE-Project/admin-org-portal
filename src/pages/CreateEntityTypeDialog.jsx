import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiSelect } from "@/components/ui/multi-select";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const CreateEntityTypeDialog = ({ onCreate }) => {
  const [openState, setOpenState] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const [newEntityType, setNewEntityType] = useState({
    value: "",
    label: "",
    status: "ACTIVE",
    data_type: "STRING",
    allow_filtering: true,
    has_entities: true,
    allow_custom_entities: true,
    model_names: ["UserExtension", "Session"],
    required: true,
  });

  // Data type options
  const dataTypeOptions = ["STRING", "NUMBER", "BOOLEAN", "DATE"];

  // Model name options (can be expanded)
  const modelNameOptions = ["UserExtension", "Session"];

  const handleInputChange = (field, value) => {
    setNewEntityType((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear validation errors when user starts typing
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newEntityType.value.trim()) {
      errors.value = "Value is required";
    }
    if (!newEntityType.label.trim()) {
      errors.label = "Label is required";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreate = () => {
    if (validateForm()) {
      onCreate(newEntityType);
      resetForm(); // Reset the form
      setOpenState(false);
    }
  };
  const resetForm = () => {
    setNewEntityType({
      value: "",
      label: "",
      status: "ACTIVE",
      data_type: "STRING",
      allow_filtering: true,
      has_entities: true,
      allow_custom_entities: true,
      model_names: ["UserExtension", "Session"],
      required: true,
    });
    setValidationErrors({});
  };

  return (
    <Dialog
      open={openState}
      onOpenChange={(isOpen) => {
        setOpenState(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-blue-50 hover:bg-blue-100">
          Create Entity Type
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Create New Entity Type
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Configure a new entity type with specific attributes and settings.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Value */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right font-semibold">
              Value*
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Unique identifier for the entity type
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="col-span-3">
              <Input
                id="value"
                value={newEntityType.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className={`${validationErrors.value ? "border-red-500" : ""}`}
                required
              />
              {validationErrors.value && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.value}
                </p>
              )}
            </div>
          </div>

          {/* Label */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="label" className="text-right font-semibold">
              Label*
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Display name for the entity type
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="col-span-3">
              <Input
                id="label"
                value={newEntityType.label}
                onChange={(e) => handleInputChange("label", e.target.value)}
                className={`${validationErrors.label ? "border-red-500" : ""}`}
                required
              />
              {validationErrors.label && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.label}
                </p>
              )}
            </div>
          </div>

          {/* Data Type */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="data_type" className="text-right font-semibold">
              Data Type
            </Label>
            <Select
              value={newEntityType.data_type}
              onValueChange={(value) => handleInputChange("data_type", value)}
              className="col-span-3"
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select data type" />
              </SelectTrigger>
              <SelectContent>
                {dataTypeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Regex (Optional) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="regex" className="text-right font-semibold">
              Regex
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="ml-2 h-4 w-4 text-gray-500" />
                  </TooltipTrigger>
                  <TooltipContent>
                    Optional regular expression for validation
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <Input
              id="regex"
              value={newEntityType.regex}
              onChange={(e) => handleInputChange("regex", e.target.value)}
              className="col-span-3"
              placeholder="Optional regex validation"
            />
          </div>

          {/* Model Names (Multi-select) */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model_names" className="text-right font-semibold">
              Model Names
            </Label>
            <MultiSelect
              options={modelNameOptions}
              value={newEntityType.model_names}
              onChange={(selected) =>
                handleInputChange("model_names", selected)
              }
              className="col-span-3 max-h-56 overflow-y-auto relative z-50"
              selectedItemsContainerClassName="flex flex-wrap gap-2"
            />
          </div>

          {/* Checkboxes Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow_filtering"
                  checked={newEntityType.allow_filtering}
                  onCheckedChange={(checked) =>
                    handleInputChange("allow_filtering", checked)
                  }
                />
                <Label htmlFor="allow_filtering" className="font-medium">
                  Allow Filtering
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Enable filtering on this entity type
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has_entities"
                  checked={newEntityType.has_entities}
                  onCheckedChange={(checked) =>
                    handleInputChange("has_entities", checked)
                  }
                />
                <Label htmlFor="has_entities" className="font-medium">
                  Has Entities
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Indicates if this entity type contains sub-entities
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allow_custom_entities"
                  checked={newEntityType.allow_custom_entities}
                  onCheckedChange={(checked) =>
                    handleInputChange("allow_custom_entities", checked)
                  }
                />
                <Label htmlFor="allow_custom_entities" className="font-medium">
                  Allow Custom Entities
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Permit creation of custom entities for this type
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="required"
                  checked={newEntityType.required}
                  onCheckedChange={(checked) =>
                    handleInputChange("required", checked)
                  }
                />
                <Label htmlFor="required" className="font-medium">
                  Required
                </Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="ml-2 h-4 w-4 text-gray-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Mark this entity type as mandatory
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setOpenState(false);
              resetForm();
            }}
            className="mr-2"
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Entity Type
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntityTypeDialog;

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Layout from "../components/Layout";
import {
  fetchNotificationTemplates,
  updateNotificationTemplate,
  createNotificationTemplate,
  deleteNotificationTemplate,
} from "@/api/notificationTemplates";
// Zod schema for notification template validation
const notificationTemplateSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters"),
  type: z.string().min(1, "Type is required"),
  subject: z.string().min(1, "Subject is required"),
  body: z.string().min(10, "Body must be at least 10 characters"),
  email_header: z.string().optional(),
  email_footer: z.string().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  organization_id: z.string().optional(),
});

const NotificationTemplateManagement = () => {
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form hook for creating/editing templates
  const form = useForm({
    resolver: zodResolver(notificationTemplateSchema),
    defaultValues: {
      code: "",
      type: "",
      subject: "",
      body: "",
      email_header: "",
      email_footer: "",
      status: "active",
      organization_id: "",
    },
  });

  // Fetch notification templates
  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      // Replace with actual API call
      const data = await fetchNotificationTemplates();
      // Assuming the response has a 'result' key
      setTemplates(data.result || []);
    } catch (error) {
      console.error("Failed to fetch templates", error);
      toast({
        title: "Error",
        description: "Failed to fetch notification templates",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  // Create/Update template submission handler
  const onSubmit = async (values) => {
    try {
      const result = selectedTemplate
        ? await updateNotificationTemplate(selectedTemplate.id, values)
        : await createNotificationTemplate(values);

      fetchTemplates();
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Success",
        description: selectedTemplate
          ? "Template updated successfully"
          : "Template created successfully",
      });

      /*       toast({
        title: "Success",
        description: result.message || "Failed to submit template",
      }); */
    } catch (error) {
      console.error("Template submission failed", error);
      toast({
        title: "Error",
        description: error.response.data.message || "Failed to submit template",
        variant: "destructive",
      });
    }
  };

  // Delete template handler
  const handleDeleteTemplate = async (templateId) => {
    try {
      const response = await deleteNotificationTemplate(templateId);

      fetchTemplates();
      toast({
        title: "Success",
        description: "Template deleted successfully",
      });
    } catch (error) {
      console.error("Template deletion failed", error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  // Open edit dialog with template data
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    form.reset({
      ...template,
      organization_id: template.organization_id || "",
    });
    setIsDialogOpen(true);
  };

  // Open create new template dialog
  const handleCreateNew = () => {
    setSelectedTemplate(null);
    form.reset({
      code: "",
      type: "",
      subject: "",
      body: "",
      email_header: "",
      email_footer: "",
      status: "active",
      organization_id: "",
    });
    setIsDialogOpen(true);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <Layout>
      {" "}
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notification Templates</CardTitle>
            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="mr-2 h-4 w-4" /> Create Template
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Organization</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      <Loader2 className="mx-auto animate-spin" />
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>{template.code}</TableCell>
                      <TableCell>{template.type}</TableCell>
                      <TableCell>{template.subject}</TableCell>
                      <TableCell>
                        <span
                          className={`
                        px-2 py-1 rounded-full text-xs 
                        ${
                          template.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }
                      `}
                        >
                          {template.status}
                        </span>
                      </TableCell>
                      <TableCell>{template.organization_id || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedTemplate ? "Edit Template" : "Create New Template"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter template code"
                            {...field}
                            disabled={!!selectedTemplate}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notification Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="push">
                              Push Notification
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter notification body"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email_header"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Header</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional email header"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email_footer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Footer</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional email footer"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="organization_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization ID</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Optional organization ID"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {selectedTemplate ? "Update Template" : "Create Template"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default NotificationTemplateManagement;

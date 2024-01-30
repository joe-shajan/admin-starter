"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "./ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Sections } from "@/types";
import { useEffect } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "section name must be at least 4 characters.",
  }),
  id: z.string(),
  type: z.string({
    required_error: "Please select an type.",
  }),
  file: z.optional(
    z.custom<File>((v) => v instanceof File, {
      message: "file is required",
    })
  ),
  text: z.optional(
    z.string({
      required_error: "Please enter the text",
    })
  ),
  embedUrl: z.optional(
    z.string({
      required_error: "Please add the url",
    })
  ),
});

type SectionFormProps = {
  selectedSection: Sections | null;
  setSelectedSection: (section: Sections | null) => void;
};

export function SectionForm({
  selectedSection,
  setSelectedSection,
}: SectionFormProps) {
  const isEditing = !!selectedSection;
  const section = selectedSection;
  console.log(isEditing);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      id: "",
      type: "",
      file: undefined,
      text: "",
      embedUrl: "",
    },
  });

  useEffect(() => {
    if (selectedSection) {
      form.setValue("name", selectedSection.name);
      form.setValue("id", selectedSection.id);
      form.setValue("type", selectedSection.type);

      if (selectedSection.url && type === "EMBEDED") {
        form.setValue("embedUrl", selectedSection.url);
      }
      if (selectedSection.text) {
        form.setValue("text", selectedSection.text);
      }

      // form.setValue("name",selectedSection.)
    }
  }, [selectedSection]);

  // Assuming you're using React Query, update your mutation hook as follows:

  const deleteMutation = useMutation({
    mutationFn: (sectionId: string) => {
      return axios.delete(`/api/sections/${sectionId}`);
    },
    onSuccess: (response) => {
      setSelectedSection(null);
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast({
        title: "Section deleted successfully",
      });
      // Handle any additional logic after successful deletion
    },
    onError: (error) => {
      console.log(error);
      toast({
        title: "Error deleting section",
      });
    },
  });

  // Call this mutation function when you want to delete a section
  // For example, onClick of a delete button in your UI:

  const handleDeleteSection = (sectionId: string) => {
    deleteMutation.mutate(sectionId);
  };

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return axios.put("/api/sections", data);
      } else {
        return axios.post("/api/sections", data);
      }
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(response.data, null, 2)}
            </code>
          </pre>
        ),
      });
      // router.push("/auth/login");
    },
    onError: () => {
      // toast({ error: "some thing went wrong" });
      // toast.error("Signup failed");
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("id", data.id);
    formData.append("type", data.type);
    if (data.file) {
      formData.append("file", data.file);
    }
    if (data.text) {
      formData.append("text", data.text);
    }
    if (data.embedUrl) {
      formData.append("embedUrl", data.embedUrl);
    }

    mutation.mutate(formData);
  }

  const type = form.watch("type");
  return (
    <div className="border p-6 w-4/5 rounded">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <div className="flex gap-10 w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Section Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your section display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isEditing ? (
              <FormField
                control={form.control}
                name="id"
                render={({ field: { value, onChange } }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Section id</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ID"
                        value={value}
                        onChange={onChange}
                        disabled
                      />
                    </FormControl>
                    <FormDescription>
                      Add this ID in your HTML element
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
            <FormField
              control={form.control}
              name="type"
              render={({ field: { value, onChange } }) => (
                <>
                  {isEditing ? (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="type" disabled value={value} />
                      </FormControl>
                      <FormDescription>This is your type.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  ) : (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <Select onValueChange={onChange} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IMAGE">Image</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                          <SelectItem value="TEXT">Text</SelectItem>
                          <SelectItem value="EMBEDED">Embeded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of your section
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                </>
              )}
            />
          </div>

          {type === "IMAGE" || type === "VIDEO" ? (
            <Controller
              name="file"
              control={form.control}
              render={({ field: { ref, name, onBlur, onChange } }) => (
                <input
                  type="file"
                  accept={`${type === "IMAGE" ? "image/*" : "video/*"}`}
                  ref={ref}
                  name={name}
                  onBlur={onBlur}
                  onChange={(e) => {
                    onChange(e.target.files?.[0]);
                  }}
                />
              )}
            />
          ) : null}
          {type === "TEXT" ? (
            <FormField
              control={form.control}
              name="text"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Text</FormLabel>
                  <FormControl>
                    <Input placeholder="Text" {...field} />
                  </FormControl>
                  <FormDescription>This is your content</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {type === "EMBEDED" ? (
            <FormField
              control={form.control}
              name="embedUrl"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Embeded URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Embeded code" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your video Embeded code.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
          {mutation.isLoading ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Updating" : "Submiting"}
            </Button>
          ) : (
            <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
          )}
        </form>
        {isEditing ? (
          <>
            {deleteMutation.isLoading ? (
              <Button variant="destructive" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting
              </Button>
            ) : (
              <Button
                variant="destructive"
                className="ms-2"
                onClick={() => handleDeleteSection(selectedSection.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </>
        ) : null}
      </Form>
      <div className="w-2/3 h-2/3">
        {section?.type === "IMAGE" && section.url ? (
          <div className="w-full relative pt-[50%] mt-2">
            <Image
              src={section.url}
              alt="profile"
              objectFit="cover"
              fill
              className="w-full h-full top-0 left-0 object-contain rounded-md"
            />
          </div>
        ) : null}

        {section?.type === "VIDEO" && section.url ? (
          <div className="w-full h-full mt-2 rounded-md overflow-hidden">
            <video src={section.url} autoPlay loop muted></video>
          </div>
        ) : null}

        {section?.type === "TEXT" && section.text ? (
          <div className="w-full h-28 p-1  mt-2 border rounded-md">
            <p>{section.text}</p>
          </div>
        ) : null}

        {section?.type === "EMBEDED" && section.url ? (
          <div className="w-full  mt-2  overflow-hidden rounded-md">
            {/* <p>{section.url}</p> */}
            <iframe
              width="100%"
              height="100%"
              src={section.url}
              allow="accelerometer; encrypted-media; gyroscope"
            ></iframe>
          </div>
        ) : null}
      </div>
    </div>
  );
}

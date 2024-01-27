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
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "section name must be at least 4 characters.",
  }),
  id: z.string().min(4, {
    message: "section name must be at least 4 characters.",
  }),
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

export function SectionForm() {
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

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/api/sections", data);
    },
    onSuccess: (response) => {
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="flex justify-between w-full">
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
          <FormField
            control={form.control}
            name="id"
            render={({ field }: { field: any }) => (
              <FormItem>
                <FormLabel>Section id</FormLabel>
                <FormControl>
                  <Input placeholder="ID" {...field} />
                </FormControl>
                <FormDescription>
                  Add this ID in your HTML element
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
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
          />
        </div>
        <div>{type}</div>
        {type === "IMAGE" || type === "VIDEO" ? (
          <Controller
            name="file"
            control={form.control}
            render={({ field: { ref, name, onBlur, onChange } }) => (
              <input
                type="file"
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

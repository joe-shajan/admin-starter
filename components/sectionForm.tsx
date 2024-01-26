"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import Link from "next/link";

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
});

export function SectionForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      return axios.post("/api/sections", data);
    },
    onSuccess: () => {
      console.log("success");

      // toast.success("Signup successfull now Log in");
      // router.push("/auth/login");
    },
    onError: () => {
      // toast.error("Signup failed");
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

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
                  <Input placeholder="About" {...field} />
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
                    <SelectItem value="LINK">Link</SelectItem>
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
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

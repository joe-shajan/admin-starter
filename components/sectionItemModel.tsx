import useModal from "@/hooks/useModal";
import React, { useEffect } from "react";
import Modal from "./Modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Section } from "@prisma/client";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import type { SectionItem } from "@/types";
import { useParams } from "next/navigation";

type Props = {
  isOpen: boolean;
  toggle: () => void;
  selectedSectionItem: SectionItem | null;
};

const FormSchema = z.object({
  heading1: z.string().min(4, {
    message: "section headding 1 must be at least 4 characters.",
  }),
  heading2: z.optional(
    z.string().min(4, {
      message: "section headding 2 must be at least 4 characters.",
    })
  ),
  text1: z.string().min(4, {
    message: "section text must be at least 4 characters.",
  }),
  text2: z.optional(
    z.string().min(4, {
      message: "section text must be at least 4 characters.",
    })
  ),
  contentType: z.string({
    required_error: "Please select an type.",
  }),
  file: z.optional(
    z.custom<File>((v) => v instanceof File, {
      message: "file is required",
    })
  ),
  url: z.optional(
    z.string({
      required_error: "Please add the url",
    })
  ),
});

export const SectionItemModel = ({
  isOpen,
  toggle,
  selectedSectionItem,
}: Props) => {
  const queryClient = useQueryClient();
  const { sectionId } = useParams();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      heading1: "",
      heading2: "",
      text1: "",
      text2: "",
      file: undefined,
      contentType: "",
      url: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (selectedSectionItem) {
        return axios.put(
          `/api/sections/${sectionId}/section-item/${selectedSectionItem.id}`,
          data
        );
      } else {
        return axios.post(`/api/sections/${sectionId}/section-item`, data);
      }
    },
    onSuccess: (response) => {
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["sections"] });
      toggle();
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
    console.log(data);

    const formData = new FormData();
    formData.append("heading1", data.heading1);
    formData.append("text1", data.text1);
    formData.append("contentType", data.contentType);

    if (data.heading2) {
      formData.append("heading2", data.heading2);
    }

    if (data.text2) {
      formData.append("text2", data.text2);
    }

    if (data.url) {
      formData.append("url", data.url);
    }

    if (data.file) {
      formData.append("file", data.file);
    }

    mutation.mutate(formData);
  }

  useEffect(() => {
    console.log(selectedSectionItem);
    if (selectedSectionItem) {
      if (selectedSectionItem.heading1) {
        form.setValue("heading1", selectedSectionItem.heading1);
      }
      if (selectedSectionItem.heading2) {
        form.setValue("heading2", selectedSectionItem.heading2);
      }
      if (selectedSectionItem.text1) {
        form.setValue("text1", selectedSectionItem.text1);
      }
      if (selectedSectionItem.text2) {
        form.setValue("text2", selectedSectionItem.text2);
      }
      if (selectedSectionItem.contentType) {
        form.setValue("contentType", selectedSectionItem.contentType);
      }
      if (selectedSectionItem.url) {
        form.setValue("url", selectedSectionItem.url);
      }
      // form.setValue("sectionType", selectedSection.sectionType);
      // form.setValue("name",selectedSection.)
    }
  }, [selectedSectionItem]);

  return (
    <div>
      <Modal isOpen={isOpen} toggle={toggle}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-8 flex flex-col gap-4"
          >
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="heading1"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Headding 1</FormLabel>
                    <FormControl>
                      <Input placeholder="headding1" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="heading2"
                render={({ field }: { field: any }) => (
                  <FormItem>
                    <FormLabel>Headding 2</FormLabel>
                    <FormControl>
                      <Input placeholder="headding2" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="text1"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Text 1</FormLabel>
                  <FormControl>
                    <Input placeholder="text1" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="text2"
              render={({ field }: { field: any }) => (
                <FormItem>
                  <FormLabel>Text 2</FormLabel>
                  <FormControl>
                    <Input placeholder="text2" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-4">
              <div className="w-1/3">
                <FormField
                  control={form.control}
                  name="contentType"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Content Type</FormLabel>
                      <Select onValueChange={onChange} defaultValue={value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="IMAGE">Image</SelectItem>
                          <SelectItem value="VIDEO">Video</SelectItem>
                          <SelectItem value="EMBEDDED">Embedded</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-2/3">
                <Controller
                  name="file"
                  control={form.control}
                  render={({ field: { ref, name, onBlur, onChange } }) => (
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="file">
                        {/* {type === "IMAGE" ? "Image" : "Video"} */}
                        Video
                      </Label>
                      <Input
                        id="file"
                        type="file"
                        accept={`video/*`}
                        // accept={`${type === "IMAGE" ? "image/*" : "video/*"}`}
                        ref={ref}
                        name={name}
                        onBlur={onBlur}
                        onChange={(e) => {
                          onChange(e.target.files?.[0]);
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
            <div className="flex justify-center items-center">
              {mutation.isLoading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {"Saving"}
                </Button>
              ) : (
                <Button type="submit">{"Save"}</Button>
              )}
            </div>
          </form>
        </Form>
      </Modal>
    </div>
  );
};

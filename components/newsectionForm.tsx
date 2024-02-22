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
import { Section, SectionItem } from "@/types";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";
import { Label } from "./ui/label";
import useModal from "@/hooks/useModal";
import { SectionItemModel } from "./sectionItemModel";
import { SectionWithItems } from "@/services";

const FormSchema = z.object({
  name: z.string().min(4, {
    message: "section name must be at least 4 characters.",
  }),
  sectionType: z.string({
    required_error: "Please select an type.",
  }),
});

type SectionFormProps = {
  selectedSection?: SectionWithItems | undefined;
  isEditing: boolean;
};

export function SectionForm({ selectedSection, isEditing }: SectionFormProps) {
  const { isOpen, toggle, openModal, closeModal } = useModal();
  const [selectedSectionItem, setSelectedSectionItem] =
    useState<SectionItem | null>(null);

  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      sectionType: "",
    },
  });

  useEffect(() => {
    if (isEditing && selectedSection) {
      form.setValue("name", selectedSection.name);
      form.setValue("sectionType", selectedSection.sectionType);

      // form.setValue("name",selectedSection.)
    }
  }, [selectedSection]);

  const mutation = useMutation({
    mutationFn: (data: any) => {
      if (isEditing) {
        return axios.put("/api/sections", data);
      } else {
        return axios.post("/api/sections", data);
      }
    },
    onSuccess: (response) => {
      form.reset();
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
    formData.append("sectionType", data.sectionType);

    mutation.mutate(formData);
  }

  const sectionType = form.watch("sectionType");

  return (
    <div className="flex flex-col h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full md:flex space-y-6 md:space-y-0 justify-between"
        >
          {isEditing ? (
            <FormItem>
              <FormLabel>Section id</FormLabel>
              <FormControl>
                <Input
                  placeholder="ID"
                  value={selectedSection?.id}
                  // onChange={onChange}
                  disabled
                />
              </FormControl>
              <FormDescription>
                Add this ID in your HTML element
              </FormDescription>
              <FormMessage />
            </FormItem>
          ) : null}

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
            name="sectionType"
            render={({ field: { value, onChange } }) => (
              <>
                {isEditing ? (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input placeholder="sectionType" disabled value={value} />
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
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="MULTIPLE">Multiple</SelectItem>
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
      <hr className="my-5" />
      <div className="overflow-y-auto h-2/3">
        <div className="flex justify-end">
          <Button onClick={openModal}>Add section Item</Button>
        </div>
        {selectedSection?.sectionItems.map((item) => (
          <div
            key={item.id}
            className="w-full flex shadow-xl rounded-lg p-8 mt-4"
          >
            <div className="w-9/12  flex flex-col gap-3">
              <h1>{item.heading1}</h1>
              <h1>{item.heading2}</h1>
              <p>{item.text1}</p>
              <p>{item.text2}</p>
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedSectionItem(item);
                    openModal();
                  }}
                >
                  edit
                </Button>
                <Button>delete</Button>
              </div>
            </div>
            <div className="w-3/12 relative">
              <Image
                alt="profile"
                objectFit="contain"
                fill
                className="w-full h-full top-0 left-0 rounded-md"
                src="https://img.freepik.com/free-photo/glowing-spaceship-orbits-planet-starry-galaxy-generated-by-ai_188544-9655.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1708387200&semt=sph"
              ></Image>
            </div>
          </div>
        ))}
      </div>
      <SectionItemModel
        isOpen={isOpen}
        toggle={toggle}
        selectedSectionItem={selectedSectionItem}
      />
    </div>
  );
}

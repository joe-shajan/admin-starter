"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { Loader } from "@/components/Loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const FormEl = () => {
  const form = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
  });

  const router = useRouter();

  const mutation = useMutation({
    mutationFn: (data: ValidationSchema) => {
      return signIn("credentials", { redirect: false, ...data });
    },
    onSuccess: () => {
      toast.success("login successfull");
      router.push("/");
    },
    onError: (error) => {
      console.log(error);

      toast.error("login failed");
    },
  });

  function onSubmit(data: ValidationSchema) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form
        className="px-8 pt-6 pb-8 mb-4 space-y-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="admin@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="*********" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-6 text-center">
          <Button className="w-full " type="submit">
            {mutation.isLoading ? <Loader /> : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

const LoginPage = () => {
  return (
    <div className="max-w-xl mx-auto my-auto w-full">
      <div className="flex justify-center my-12">
        <div className="w-full lg:w-10/12 bg-white p-5 rounded-lg shadow">
          <h3 className="pt-4 text-2xl text-center font-semibold">Login</h3>
          <FormEl />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;

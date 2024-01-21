"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components";
import { signIn } from "next-auth/react";
import { Loader } from "@/components/Loader";

const validationSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({
    message: "Must be a valid email",
  }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});

type ValidationSchema = z.infer<typeof validationSchema>;

const Form = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ValidationSchema>({
    // @ts-ignore
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

  return (
    <form
      className="px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit((formData) => mutation.mutate(formData))}
    >
      <div className="mb-4">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <input
          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
            errors.email && "border-red-500"
          } rounded appearance-none focus:outline-none focus:shadow-outline`}
          id="email"
          type="email"
          placeholder="joe@gmail.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.email?.message}
          </p>
        )}
      </div>

      <div className="mb-4 md:mr-2 md:mb-0">
        <label
          className="block mb-2 text-sm font-bold text-gray-700"
          htmlFor="password"
        >
          Password
        </label>
        <input
          className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
            errors.password && "border-red-500"
          } rounded appearance-none focus:outline-none focus:shadow-outline`}
          id="password"
          type="password"
          placeholder="********"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.password?.message}
          </p>
        )}
      </div>

      <div className="my-6 text-center">
        <Button className="w-full " type="submit">
          {mutation.isLoading ? <Loader /> : "Login"}
        </Button>
      </div>
      <hr className="mb-6 border-t" />

      <div className="text-center">
        <Link
          className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
          href="/auth/signup"
        >
          {"Don't have an accout? Create new"}
        </Link>
      </div>
    </form>
  );
};

const LoginPage = () => {
  return (
    <div className="max-w-xl mx-auto my-auto w-full">
      <div className="flex justify-center my-12">
        <div className="w-full lg:w-11/12 bg-white p-5 rounded-lg shadow-xl">
          <h3 className="pt-4 text-2xl text-center font-bold">Login</h3>
          <Form />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default LoginPage;

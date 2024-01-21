"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components";
import { Loader } from "@/components/Loader";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const validationSchema = z
  .object({
    name: z.string().min(1, { message: "name is required" }),
    phoneNumber: z.string().regex(phoneRegex, "Invalid Number!"),
    email: z.string().min(1, { message: "Email is required" }).email({
      message: "Must be a valid email",
    }),
    password: z
      .string()
      .min(6, { message: "Password must be atleast 6 characters" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm Password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password don't match",
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
      return axios.post("/api/auth/signup", data);
    },
    onSuccess: () => {
      toast.success("Signup successfull now Log in");
      router.push("/auth/login");
    },
    onError: () => {
      toast.error("Signup failed");
    },
  });

  return (
    <form
      className="px-8 pt-6 pb-8 mb-4"
      onSubmit={handleSubmit((formData) => mutation.mutate(formData))}
    >
      <div className="mb-4 md:flex md:justify-between">
        <div className="mb-4 md:mr-2 md:mb-0">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="name"
          >
            Name
          </label>
          <input
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
              errors.name && "border-red-500"
            } rounded appearance-none focus:outline-none focus:shadow-outline`}
            id="name"
            type="text"
            placeholder="Name"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.name?.message}
            </p>
          )}
        </div>
        <div className="md:ml-2">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="phoneNumber"
          >
            Phone
          </label>
          <input
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
              errors.phoneNumber && "border-red-500"
            } rounded appearance-none focus:outline-none focus:shadow-outline`}
            id="phoneNumber"
            type="text"
            placeholder="9074758634"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.phoneNumber?.message}
            </p>
          )}
        </div>
      </div>
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
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs italic text-red-500 mt-2">
            {errors.email?.message}
          </p>
        )}
      </div>
      <div className="mb-4 md:flex md:justify-between">
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
            {...register("password")}
          />
          {errors.password && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.password?.message}
            </p>
          )}
        </div>
        <div className="md:ml-2">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="c_password"
          >
            Confirm Password
          </label>
          <input
            className={`w-full px-3 py-2 text-sm leading-tight text-gray-700 border ${
              errors.confirmPassword && "border-red-500"
            } rounded appearance-none focus:outline-none focus:shadow-outline`}
            id="c_password"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-xs italic text-red-500 mt-2">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6 text-center">
        <Button className="w-full " type="submit">
          {mutation.isLoading ? <Loader /> : "Sign up"}
        </Button>
      </div>
      <hr className="mb-6 border-t" />

      <div className="text-center">
        <Link
          className="inline-block text-sm text-blue-500 align-baseline hover:text-blue-800"
          href="/auth/login"
        >
          Already have an account? Login!
        </Link>
      </div>
    </form>
  );
};

const RegisterPage = () => {
  return (
    <div className="max-w-xl mx-auto my-auto w-full">
      <div className="flex justify-center my-12">
        <div className="w-full lg:w-11/12 bg-white p-5 rounded-lg shadow-xl">
          <h3 className="pt-4 text-2xl text-center font-bold">
            Create New Account
          </h3>
          <Form />
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default RegisterPage;

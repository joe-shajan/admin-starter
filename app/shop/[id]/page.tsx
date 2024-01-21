"use client";

import { Button } from "@/components";
import "./shop.css";
import ProductsTable from "@/components/products/ProductsTable";
import useModal from "@/hooks/useModal";
import Modal from "@/components/Modal";
import { CreateProduct } from "@/components/products/CreateProduct";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getProducts, getUserRole } from "@/services";
import { useEffect, useState } from "react";
import { Product } from "@/types";

import { updateTotalProducts } from "@/redux/features/paginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Pagination from "@/components/products/Pagination";
import { Loader } from "@/components/Loader";

export default function Page({ params }: any) {
  const { id } = params;
  const { isOpen, toggle, openModal, closeModal } = useModal();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const currentPage = useAppSelector((state) => state.paginationReducer);
  const dispatch = useAppDispatch();

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["products", currentPage.page],
    queryFn: () => getProducts(id, currentPage.page),
  });

  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: () => getUserRole(id),
  });

  useEffect(() => {
    if (editingProduct) {
      openModal();
    } else {
      closeModal();
    }
  }, [closeModal, editingProduct, openModal]);

  if (error) {
    return <div>could not fetch products</div>;
  }

  if (data?.totalProductsCount) {
    dispatch(updateTotalProducts(data?.totalProductsCount));
  }

  return (
    <>
      <Modal isOpen={isOpen} toggle={toggle}>
        <CreateProduct
          userRole={userRole || "MANAGER"}
          toggle={toggle}
          shopId={id}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          refetch={refetch}
        />
      </Modal>
      <div className="flex md:flex-row flex-col md:justify-between md:items-center px-4 md:px-12 lg:px-28 mt-6 mb-2">
        <div className="text-2xl font-semibold text-center md:text-left md:mb-0 mb-6">
          Products
        </div>
        {userRole === "ADMIN" ? (
          <div className="flex gap-3 justify-end">
            <Link href={`/shop/${id}/team`}>
              <Button className="bg-slate-200 text-black hover:bg-slate-300">
                Manage users
              </Button>
            </Link>
            <Button onClick={toggle}>Add New Product</Button>
          </div>
        ) : null}
      </div>

      {isLoading ? (
        <div className="text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
          <Loader size="xl" />
        </div>
      ) : data?.products?.length ? (
        <>
          <ProductsTable
            shopId={id}
            products={data.products}
            userRole={userRole || "MANAGER"}
            setEditingProduct={setEditingProduct}
            refetch={refetch}
          />
          {isRefetching ? (
            <div className="text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[50px]">
              <Loader size="xl" />
            </div>
          ) : null}
          <Pagination />
        </>
      ) : (
        <div className="text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
          There are no products in this shop.
        </div>
      )}
    </>
  );
}

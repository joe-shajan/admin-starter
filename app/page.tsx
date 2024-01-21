"use client";

import { Button } from "@/components";
import { Loader } from "@/components/Loader";
import Modal from "@/components/Modal";
import { CreateShop } from "@/components/shop/CreateShop";
import ShopCard from "@/components/shop/ShopCard";
import useModal from "@/hooks/useModal";
import { getAllShops } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function Home() {
  const { isOpen, toggle } = useModal();
  const { data: session } = useSession();

  const { data, isLoading, error } = useQuery({
    queryKey: ["shops"],
    queryFn: () => getAllShops(),
  });

  return (
    <>
      {session ? (
        <>
          <Modal isOpen={isOpen} toggle={toggle}>
            <CreateShop toggle={toggle} />
          </Modal>
          <div className="flex md:flex-row flex-col md:justify-between md:items-center px-4 md:px-12 lg:px-28 mt-6 mb-2">
            <div className="text-2xl font-semibold text-center md:text-left md:mb-0 mb-6">
              All Shops
            </div>
            <div className="flex justify-end">
              <Button onClick={toggle}>Create New Shop</Button>
            </div>
          </div>
          <div className="container my-4 mx-auto px-4 md:px-12 lg:px-28">
            <div className="flex flex-wrap -mx-1 lg:-mx-4 gap-3 md:gap-0">
              {error ? (
                <div className=" text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
                  could not fetch shops
                </div>
              ) : isLoading ? (
                <div className=" text-lg  container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
                  <Loader size="xl" />
                </div>
              ) : data?.length ? (
                data.map((shop) => <ShopCard key={shop.id} shop={shop} />)
              ) : (
                <div className="text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
                  No shops found create new.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className=" text-lg container my-2 mx-auto px-4 md:px-12 lg:px-28 flex justify-center items-center h-[400px]">
          Login to continue
        </div>
      )}
    </>
  );
}

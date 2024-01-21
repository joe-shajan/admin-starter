import Link from "next/link";
import React from "react";
import { Shop } from "@/types";
import { MdOutlineDescription } from "react-icons/md";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiNavigation } from "react-icons/bi";
import { BsShop } from "react-icons/bs";

type Props = {
  shop: Shop;
};

const ShopCard = ({ shop }: Props) => {
  return (
    <div className="my-1 px-1 w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/4">
      <Link href={`/shop/${shop.id}`}>
        <article className="bg-gray-50 overflow-hidden rounded-lg shadow-md hover:shadow-lg border-slate-100 border p-3 md:p-0 text-slate-700">
          <header className="leading-tight p-2 pb-1">
            <div className="text-xl font-semibold flex items-center justify-center gap-3">
              <span>
                <BsShop />
              </span>
              <span>{shop.name}</span>
            </div>
            <div className="  flex items-center gap-1 text-grey-darker text-sm mt-4 px-0 md:px-2 ">
              <MdOutlineDescription />
              <p className="font-semibold">{shop.bio}</p>
            </div>
          </header>

          <footer className="flex flex-col gap-1 leading-none px-2 md:px-4 pb-2 ">
            <div className="flex items-center gap-1 text-sm">
              <HiOutlineLocationMarker />
              <span className="font-semibold">{shop.address}</span>
            </div>
            <div className="text-sm flex items-center gap-1">
              <BiNavigation />
              <span className="font-semibold">{shop.latitude}</span> ,
              <span className="font-semibold">{shop.longitude}</span>
            </div>
          </footer>
        </article>
      </Link>
    </div>
  );
};

export default ShopCard;

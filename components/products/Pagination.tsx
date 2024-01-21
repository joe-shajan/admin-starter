import { previous, next } from "@/redux/features/paginationSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import React from "react";

type Props = {};

const Pagination = (props: Props) => {
  const { start, end, totalProducts } = useAppSelector(
    (state) => state.paginationReducer
  );
  const dispatch = useAppDispatch();
  return (
    <div className="flex flex-col items-center mb-4">
      <span className="text-sm text-gray-700 flex gap-1">
        Showing
        <span className="font-semibold text-gray-900 ">{start}</span>
        to
        <span className="font-semibold text-gray-900 ">{end}</span>
        of
        <span className="font-semibold text-gray-900 ">{totalProducts}</span>
        Products
      </span>
      <div className="inline-flex mt-2 xs:mt-0 gap-1">
        <button
          onClick={() => dispatch(previous())}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-200 bg-black rounded hover:bg-gray-900 hover:text-white"
        >
          <svg
            className="w-3.5 h-3.5 mr-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 5H1m0 0 4 4M1 5l4-4"
            />
          </svg>
          Prev
        </button>
        <button
          onClick={() => dispatch(next())}
          className="flex items-center justify-center px-3 h-8 text-sm font-medium text-gray-200 bg-black rounded hover:bg-gray-900 hover:text-white"
        >
          Next
          <svg
            className="w-3.5 h-3.5 ml-2"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 5h12m0 0L9 1m4 4L9 9"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;

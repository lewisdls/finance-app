"use client";

import Link from "next/link";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { MdHomeFilled } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { RiBillFill } from "react-icons/ri";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path && "active-link";
  };

  const [isShort, setIsShort] = useState(false);

  return (
    <div
      className={`z-50 sticky bottom-0 lg:top-0 lg:left-0 lg:h-screen flex flex-col rounded-t-xl lg:rounded-l-none lg:rounded-r-3xl bg-[#201F24] text-white ${
        isShort ? "lg:w-[100px]" : "lg:w-[300px]"
      } transition-all duration-300`}
    >
      <p
        id="logo"
        className={`hidden lg:block text-2xl font-bold p-6 ${
          isShort ? "lg:px-4 self-center" : "self-start"
        }`}
      >
        {isShort ? "d" : "dosantos"}
      </p>
      <div className="flex flex-col justify-between h-full">
        <div className="flex justify-center gap-6 lg:flex-col lg:gap-2">
          <Link
            href="/"
            className={`font-semibold text-sm flex flex-col lg:flex-row items-center gap-3 py-3 lg:py-4 lg:pr-0 mt-2 lg:mt-0 transition-all duration-300 lg:border-l-[3px] border-transparent ${isActive(
              "/"
            )} ${
              isShort
                ? "lg:mr-0 justify-center px-6 lg:px-0"
                : "lg:mr-6 justify-start px-6 lg:pl-6"
            }`}
          >
            <MdHomeFilled className={`icon text-2xl`} />
            <p className={`hidden md:block ${isShort && "lg:hidden"}`}>Overview</p>
          </Link>
          <Link
            href="/transactions"
            className={`font-semibold text-sm flex flex-col lg:flex-row items-center gap-3 py-3 lg:py-4 lg:pr-0 mt-2 lg:mt-0 transition-all duration-300 lg:border-l-[3px] border-transparent ${isActive(
              "/transactions"
            )} ${
              isShort
                ? "lg:mr-0 justify-center px-6 lg:px-0"
                : "lg:mr-6 justify-start px-6 lg:pl-6"
            }`}
          >
            <GrTransaction className="icon text-2xl" />
            <p className={`hidden md:block ${isShort && "lg:hidden"}`}>Transactions</p>
          </Link>
          <Link
            href="/bills"
            className={`font-semibold text-sm flex flex-col lg:flex-row items-center gap-3 py-3 lg:py-4 lg:pr-0 mt-2 lg:mt-0 transition-all duration-300 lg:border-l-[3px] border-transparent ${isActive(
              "/bills"
            )} ${
              isShort
                ? "lg:mr-0 justify-center px-6 lg:px-0"
                : "lg:mr-6 justify-start px-6 lg:pl-6"
            }`}
          >
            <RiBillFill className="icon text-2xl" />
            <p className={`hidden md:block ${isShort && "lg:hidden"}`}>
              Recurring Bills
            </p>
          </Link>
        </div>
        <div
          className="hidden lg:flex items-center gap-1 p-6 cursor-pointer w-fit"
          onClick={() => setIsShort(!isShort)}
        >
          {isShort ? (
            <div>
              <IoMdArrowDropright className="text-2xl" />{" "}
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <IoMdArrowDropleft className="text-2xl" />{" "}
              <p className="font-medium">Minimize Menu</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;

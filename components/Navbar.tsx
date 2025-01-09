"use client";

import React from "react";
import MaxWidthWrapper from "./MaxWidthWrapper";
import Link from "next/link";
import { Button } from "./ui/button";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import Hamburger_Menu from "./ui/HamburgerMenu";
import { IconBellRinging } from "@tabler/icons-react";

interface Props {
  admin: String;
}

const NavBar: React.FC<Props> = ({ admin }) => {
  const { user } = useUser();
  const route = usePathname();

  return (
    <nav className="sticky h-14 inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg translate-all">
      <MaxWidthWrapper>
        <div className="flex justify-between pl-2 pr-2 items-center h-full w-full">
          <div className="flex h-full items-center gap-2">
            <Link href="/">
              <img
                src="/robo-logo.png"
                className="lg:h-10 lg:w-10 h-8 w-8 rounded-full"
              />
            </Link>
            <Link href="/" className="font-bold text-2xl">
              Inventory Management
            </Link>
          </div>

          <div className="items-center space-x-4 sm:flex">
            {user ? null : (
              <Button
                variant={"ghost"}
                asChild
                className="border-[color:var(--secondary-500)] border sm:border-0"
              >
                <Link href="/sign-in" className="text-lg font-bold">
                  Sign In
                </Link>
              </Button>
            )}

            {user ? null : (
              <span
                className="h-6 w-px bg-gray-200 hidden sm:flex"
                aria-hidden="true"
              />
            )}

            {user ? (
              <div className="flex h-full items-center gap-1 space-x-4">
                <div className="hidden md:flex h-full items-center justify-center space-x-1">
                  {user.primaryEmailAddress?.emailAddress === admin && (
                    <Button variant={"ghost"} className="">
                      <IconBellRinging className="w-20 h-20" />
                    </Button>
                  )}
                  <Button
                    variant={"ghost"}
                    asChild
                    className={
                      "border-[color:var(--secondary-500)] border sm:border-0" +
                      (route === "/dashboard" ? " bg-slate-200" : "")
                    }
                  >
                    <Link href="/inventory" className="text-lg font-bold">
                      Inventory
                    </Link>
                  </Button>
                  {user.primaryEmailAddress?.emailAddress === admin && (
                    <Button
                      variant={"ghost"}
                      asChild
                      className={
                        "border-[color:var(--secondary-500)] border sm:border-0" +
                        (route === "/dashboard" ? " bg-slate-200" : "")
                      }
                    >
                      <Link href="/issued" className="text-lg font-bold">
                        Issued
                      </Link>
                    </Button>
                  )}
                  <SignOutButton>
                    <Button>Signout</Button>
                  </SignOutButton>
                </div>
                <Hamburger_Menu />
              </div>
            ) : (
              <Button className="hidden sm:flex" asChild>
                <Link href="/sign-up" className="text-lg font-bold">
                  Let&apos;s get started
                </Link>
              </Button>
            )}
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
};

export default NavBar;

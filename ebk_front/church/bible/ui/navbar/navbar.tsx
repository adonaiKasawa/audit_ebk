"use client";
import React, { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from "@heroui/navbar";
import NextLink from "next/link";
import { Input } from "@heroui/input";
import {
  MicrophoneIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@heroui/avatar";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import { Session } from "next-auth";
import { useSearchParams } from "next/navigation";

import NavLinks from "../sidebar/nav-links";
import { NotificationUI } from "../notification/notification.ui";
import { ThemeSwitch } from "../theme-switch";

import ProfilUser from "./profil.user";

import { MailIcon } from "@/ui/icons";
import { PrivilegesEnum } from "@/app/lib/config/enum";
import { SearchIcon } from "@/ui/icons";

export const Navbar = ({ session }: { session: Session | null }) => {
  const searchParams = useSearchParams();
  const s_query = searchParams.get("s_query");
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const searchInput = (
    <form action={`/search`} className="col-span-8 rounded-md">
      <Input
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        defaultValue={`${s_query ? s_query : ""}`}
        endContent={<MicrophoneIcon style={{ width: 24, height: 24 }} />}
        labelPlacement="outside"
        name="s_query"
        placeholder="Recherche..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
      />
    </form>
  );

  function getNumberNotification(notifications: any[]): number {
    let nombre = 0;

    for (let index = 0; index < notifications.length; index++) {
      const element = notifications[index];

      if (!element.status) nombre++;
    }

    return nombre;
  }

  return (
    <>
      <NextUINavbar maxWidth="xl" position="sticky" isMenuOpen={isMenuOpen} onMenuOpenChange={setIsMenuOpen}>
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href={"/"}
            >
              <Avatar
                className="rounded-md bg-transparent"
                size="md"
                src="/ecclessia.png"
              />
              <p className="font-bold text-inherit">EcclesiaBook</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="hidden lg:flex md:flex xl:flex sm:flex basis-1/5 sm:basis-full  w-full"
          justify="center"
        >
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

          <NavbarItem className="lg:flex">{searchInput}</NavbarItem>

          <NavbarItem className="lg:flex">
            {session && session.user ? (
              <>
                <div className="flex justify-between items-center space-x-2">
                  {session.user.privilege_user ===
                    PrivilegesEnum.ADMIN_EGLISE && (
                    <Link href="https://church.ecclesiabook.org">
                      <PlusCircleIcon className="w-6 cursor-pointer text-foreground" />
                    </Link>
                  )}
                  <NotificationUI
                    numberNotification={getNumberNotification([])}
                  />
                  <ProfilUser session={session} />
                </div>
              </>
            ) : (
              <>
                <Button as={Link} href="/api/auth/signin" variant="bordered">
                  Se connecter
                </Button>
              </>
            )}
          </NavbarItem>
        </NavbarContent>

        <NavbarContent className="flex pl-4" justify="end">
          <NavbarMenuToggle />
        </NavbarContent>

        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-2">
            <NavbarMenuItem>
              <div className="flex justify-between w-full items-center space-x-2">
                <ThemeSwitch />
                <>
                  {session && session.user && (
                    <div className="flex justify-between space-x-2">
                      {session.user.privilege_user ===
                        PrivilegesEnum.ADMIN_EGLISE && (
                        <Link href={"/church"}>
                          <PlusCircleIcon className="w-6 cursor-pointer text-foreground" />
                        </Link>
                      )}
                      <NotificationUI
                        numberNotification={getNumberNotification([])}
                      />
                    </div>
                  )}
                </>
                <div className="lg:flex w-full">
                  {searchInput}
                </div>
              </div>
            </NavbarMenuItem>

            <NavbarMenuItem>
              <div className="flex justify-center w-full">
                {session && session.user ? (
                  <>
                    <div className="flex justify-between space-x-2">
                      <ProfilUser session={session} />
                    </div>
                  </>
                ) : (
                  <Button as={Link} href="/api/auth/signin" variant="bordered">
                    Se connecter
                  </Button>
                )}
              </div>
            </NavbarMenuItem>
            <NavbarMenuItem>
              <div className="flex flex-col justify-center align-middle w-full px-4 py-2">
                {session && session.user && (
                  <>
                    <div className="flex flex-row space-x-2 my-1 align-middle">
                      <UserIcon style={{ width: 24, height: 24 }} />
                      <p>
                        {session.user.nom} {session.user.prenom}
                      </p>
                    </div>
                    <div className="flex flex-row space-x-2 my-1 align-middle">
                      <MailIcon style={{ width: 24, height: 24 }} />
                      <p>{session.user.email}</p>
                    </div>
                  </>
                )}
              </div>
            </NavbarMenuItem>
            <NavbarMenuItem >
              <NavLinks  onClose={() => setIsMenuOpen(false)}/>
            </NavbarMenuItem>
          </div>
        </NavbarMenu>
      </NextUINavbar>
    </>
  );
};

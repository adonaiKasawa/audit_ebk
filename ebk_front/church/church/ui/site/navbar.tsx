import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { Link } from "@heroui/link";

import { file_url } from "@/app/lib/request/request";
import { Eglise } from "@/app/lib/config/interface";

export default function NavbarSite({ eglise }: { eglise: Eglise }) {
  // const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { theme } = useTheme();

  const menuItems = ["A propos", "Notre équipe", "Nous contacter"];

  return (
    <Navbar
      shouldHideOnScroll
      style={{
        borderBottom: `1px solid ${theme == "dark" ? "white" : "black"}`,
      }}
      // onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent>
        {/* <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        /> */}
        <NavbarBrand>
          <Image
            alt={`Photo de l'eglise ${eglise?.nom_eglise}`}
            height={50}
            src={`${file_url + eglise.photo_eglise}`}
            style={{ marginRight: 5 }}
            width={50}
          />
          <p className="font-bold text-inherit">{eglise?.nom_eglise || ""}</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        <NavbarItem>
          <Link color="foreground" href="#a_propos">
            A propos
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link aria-current="page" color="foreground" href="#notre_equipe">
            Notre equipe
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#nous_contacter">
            Nous contacter
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}

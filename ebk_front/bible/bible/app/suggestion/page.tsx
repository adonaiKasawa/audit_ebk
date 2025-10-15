"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Textarea } from "@heroui/input";
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import Link from "next/link";
import { Image } from "@heroui/image";

import { createSuggestionApi } from "../lib/actions/suggestion/suggestion.req";

import Alert from "@/ui/modal/alert";
import { ThemeSwitch } from "@/ui/theme-switch";

export default function SuggestionsPage() {
  const [suggestion, setSuggestion] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [openAlert, setOpenAlert] = useState<boolean>(false);
  const [alertMsg, setAlertMsg] = useState<string>("");

  const handleSubmit = async () => {
    if (suggestion) {
      setLoading(true);
      const create = await createSuggestionApi(suggestion);

      setLoading(false);
      if (
        !create.hasOwnProperty("statusCode") &&
        !create.hasOwnProperty("message")
      ) {
        setOpenAlert(true);
        setAlertMsg(
          "Merci d'avoir partagé tes suggestions et tes commentaires ! Nous apprécions ton aide pour que EcclesiaBooK reste sûr et amusant.",
        );
      } else {
        setAlertMsg("Une erreur se produite lors de la création du prière.");
        setOpenAlert(true);
      }
    } else {
      setAlertMsg("Le champt est obligatoire");
      setOpenAlert(true);
    }
  };

  return (
    <>
      <div className="font-sans antialiased min-h-full flex flex-col [overflow-anchor:none]">
        <div className="relative z-50 w-full flex-none text-sm font-semibold leading-6 text-justify">
          <Navbar>
            <NavbarBrand>
              <Link href="/">
                <Image alt="Logo" height={32} src="/ecclessia.png" width={32} />
              </Link>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="end">
              <NavbarItem>
                <Link
                  className="text-gray-500"
                  href="/legacy?v=mentions_legale"
                >
                  Mention legale
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link className="text-gray-500" href="/legacy?v=privacy">
                  politique de confidentialité
                </Link>
              </NavbarItem>
              <NavbarItem>
                <Link className="text-gray-500" href="/legacy?v=terms_of_use">
                  Terms conditions
                </Link>
              </NavbarItem>
            </NavbarContent>
            <ThemeSwitch />
          </Navbar>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="relative mx-auto max-w-[37.5rem] pt-20 text-center pb-12">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
                Avis & Suggestions
              </h1>
            </div>
          </div>

          <div className="relative px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-[40rem] prose-sm prose prose-slate prose-a:font-semibold prose-a:text-sky-500 hover:prose-a:text-sky-600">
              <p>
                Nous vous remercions vivement de prendre le temps de nous faire
                part de vos suggestions et commentaires. Votre contribution est
                essentielle au maintien de la sécurité et du caractère ludique
                d&apos;EcclesiaBook.
              </p>
              <p>
                Votre avis éclairé nous est d&apos;une grande utilité. Merci de
                nous aider à améliorer continuellement EcclesiaBook.
              </p>

              <Textarea
                className="my-8"
                label="Votre suggestion"
                placeholder="Votre suggestion"
                value={suggestion}
                variant="bordered"
                onChange={(e) => {
                  setSuggestion(e.target.value);
                }}
              />
              <Button
                className="text-white"
                color="primary"
                isLoading={loading}
                onClick={() => {
                  handleSubmit();
                }}
              >
                Envoyer
              </Button>
            </div>
            <Alert
              alertBody={<p>{alertMsg}</p>}
              alertTitle={"Message"}
              isOpen={openAlert}
              onClose={() => {
                setOpenAlert(false);
              }}
              onOpen={() => {
                setOpenAlert(true);
              }}
            />
          </div>

          <footer
            className="flex w-full"
            style={{ position: "fixed", bottom: 0, justifyContent: "center" }}
          >
            <div className="flex w-full justify-center items-center p-8">
              <div className="sm:flex sm:items-center sm:justify-end">
                <p className="text-sm text-gray-500">
                  © 2023 EcclesiaBooK. Tous droits réservés.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

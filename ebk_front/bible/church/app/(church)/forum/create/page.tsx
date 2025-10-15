"use client";

import React, { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";

import Alert from "@/ui/modal/alert";
import { createForumChurchApi } from "@/app/lib/actions/church/church";

export default function CreateForum() {
  const [image, setImage] = useState<string>("/ecclessia.png");
  const [picture, setPicture] = useState<any>();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isOpen, setOpen] = useState<boolean>(false);
  const [res, setRes] = useState<{ title: string; msg: string }>({
    title: "",
    msg: "",
  });

  const handleChange = (event: React.ChangeEvent) => {
    const reader = new FileReader();
    const { files } = event.target as HTMLInputElement;

    if (files && files.length !== 0) {
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(files[0]);
      setPicture(files[0]);
    }
  };

  const handleCreateForum = async () => {
    if (title) {
      setIsLoading(true);
      const forum = new FormData();

      forum.append("title", title);
      forum.append("description", description);
      if (picture) forum.append("picture", picture);
      const create = await createForumChurchApi(forum);

      setIsLoading(false);

      if (create.hasOwnProperty("statusCode")) {
        if (
          create.statusCode === 400 ||
          create.statusCode === 404 ||
          create.statusCode === 401
        ) {
          setRes({
            title: "Donnée incorrecte",
            msg: "Le titre ne doit pas etre vide.",
          });
          setOpen(true);
        }
      } else {
        //document.location = "/church/forum";
        console.log("create forum: ", create);
        
      }
    } else {
      setRes({
        title: "Donnée incorrecte",
        msg: "Le titre ne doit pas etre vide",
      });
      setOpen(true);
    }
  };

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-3" />
      <div className="col-span-12 sm:col-span-6">
        <Card>
          <CardHeader>Creer un forum</CardHeader>
          <CardBody>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                handleCreateForum();
              }}
            >
              <div className="flex flex-col w-full flex-wrap md:flex-nowrap gap-4">
                <Input
                  required
                  placeholder="Titre"
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                  }}
                />
                <textarea
                  className="bg-default-100 rounded-lg p-2"
                  placeholder="Déscription"
                  rows={4}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
                <Input
                  accept="image/*"
                  type="file"
                  onChange={(e) => handleChange(e)}
                />
                <div className="flex">
                  <Image
                    alt={`${image}`}
                    height={100}
                    src={image}
                    width={100}
                  />
                  {/* <Button isIconOnly type="button" className="right-8 bg-primary z-10">
                    <PiUploadSimpleLight size={30} className="w-20 text-white" />
                  </Button> */}
                </div>
              </div>
              <Button
                className="mt-4 bg-primary text-white"
                isLoading={isLoading}
                type="submit"
              >
                Creer
              </Button>
            </form>
            <Alert
              alertBody={<p>{res.msg}</p>}
              alertTitle={res.title}
              isOpen={isOpen}
              onClose={() => setOpen(false)}
              onOpen={() => setOpen(true)}
            />
          </CardBody>
        </Card>
      </div>
      <div className="col-span-3" />
    </div>
  );
}

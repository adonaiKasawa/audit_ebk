"use client";

import React, { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CiHome } from "react-icons/ci";
import { Session } from "next-auth";
import { RiBook3Fill } from "react-icons/ri";
import { GiBookCover } from "react-icons/gi";
import { FaRegEdit } from "react-icons/fa";
import { Tab, Tabs } from "@heroui/tabs";
import { Divider } from "@heroui/divider";

import { GalleryIcon, MusicIcon, VideoIcon } from "@/ui/icons";
import CardVideoFileUI, {
  CardAudioFileUI,
  CardBibleStudyUI,
  CardBookFileUI,
  CardEgliseUI,
  CardForumUI,
  CardPictureFileUI,
} from "@/ui/card/card.ui";
import {
  Eglise,
  ItemBibleStudy,
  ItemPicture,
  ItemVideos,
  SearchIterface,
} from "@/app/lib/config/interface";
import { findSearchApi } from "@/app/lib/actions/search";

export default function ClientPage({ session }: { session: Session | null }) {
  const searchParams = useSearchParams();
  const s_query = searchParams.get("s_query");
  const [select, setSelect] = useState<string | number>("tout");
  // const [pending, setPending] = useState<boolean>();
  const [search, setSearch] = useState<SearchIterface>();

  const handelFindSearch = useCallback(async () => {
    if (s_query !== null) {
      const search = await findSearchApi(s_query);

      if (!search.hasOwnProperty("statusCode")) {
        setSearch(search);
      }
    }
  }, [s_query, setSearch]);

  const sortBySize = (search: any) => {
    const sortedProperties = Object.keys(search).sort((a, b) => {
      return search[b].length - search[a].length;
    });

    return sortedProperties;
  };

  const renderProperty = (property: any, search: any) => {
    const items = search[property];
    const limitedItems = items.slice(0, 10);

    // Rendu conditionnel en fonction du type de propriété
    switch (property) {
      case "images":
        return (
          <div className="mt-4">
            <p className="text-xl">Images</p>
            <div className="grid  grid-cols-3">
              {limitedItems.map((item: ItemPicture) => (
                <CardPictureFileUI
                  key={`${item.createdAt}${item.id}`}
                  picture={item}
                  session={session}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "audios":
        return (
          <div className="mt-4">
            <p className="text-xl">Audios</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: ItemVideos) => (
                <CardAudioFileUI
                  key={`${item.createdAt}${item.id}`}
                  isLink
                  audio={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "videos":
        return (
          <div className="mt-4">
            <p className="text-xl">Vidéos</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: ItemVideos) => (
                <CardVideoFileUI
                  key={`${item.createdAt}${item.id}`}
                  video={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "livre":
        return (
          <div className="mt-4">
            <p className="text-xl">Livres</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: ItemVideos) => (
                <CardBookFileUI
                  key={`${item.createdAt}${item.id}`}
                  book={item}
                  session={session}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "eglise":
        return (
          <div className="mt-4">
            <p className="text-xl">Église</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: Eglise) => (
                <CardEgliseUI
                  key={`${item.createdAt}${item.id_eglise}`}
                  eglise={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "bibleStudy":
        return (
          <div className="mt-4">
            <p className="text-xl">Étude biblique</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: ItemBibleStudy) => (
                <CardBibleStudyUI
                  key={`${item.createdAt}${item.id}`}
                  bibleStudy={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "forum":
        return (
          <div className="mt-4">
            <p className="text-xl">Forum</p>
            <div className="grid grid-cols-3 gap-4">
              {limitedItems.map((item: any) => (
                <CardForumUI key={`${item.createdAt}${item.id}`} forum={item} />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      default:
        return null;
    }
  };

  const AllSearchResults = () => {
    const sortedProperties = sortBySize(search);

    return (
      <div>
        {sortedProperties.map((property) => {
          return <div key={property}>{renderProperty(property, search)}</div>;
        })}
      </div>
    );
  };

  const SearchResults = () => {
    switch (select) {
      case "tout":
        return AllSearchResults();
      case "audios":
        return (
          <div className="mt-4">
            <p className="text-xl">Audios</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.audios.map((item: ItemVideos) => (
                <CardAudioFileUI
                  key={`${item.createdAt}${item.id}`}
                  isLink
                  audio={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "videos":
        return (
          <div className="mt-4">
            <p className="text-xl">Vidéos</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.videos.map((item: ItemVideos) => (
                <CardVideoFileUI
                  key={`${item.createdAt}${item.id}`}
                  video={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "photos":
        return (
          <div className="mt-4">
            <p className="text-xl">Images</p>
            <div className="grid  grid-cols-3">
              {search?.images.map((item: ItemPicture) => (
                <CardPictureFileUI
                  key={`${item.createdAt}${item.id}`}
                  picture={item}
                  session={session}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "books":
        return (
          <div className="mt-4">
            <p className="text-xl">Livres</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.livre.map((item: ItemVideos) => (
                <CardBookFileUI
                  key={`${item.createdAt}${item.id}`}
                  book={item}
                  session={session}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "forum":
        return (
          <div className="mt-4">
            <p className="text-xl">Forum</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.forum.map((item: any) => (
                <CardForumUI key={`${item.createdAt}${item.id}`} forum={item} />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "bibleSutdy":
        return (
          <div className="mt-4">
            <p className="text-xl">Étude biblique</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.bibleStudy.map((item: ItemBibleStudy) => (
                <CardBibleStudyUI
                  key={`${item.createdAt}${item.id}`}
                  bibleStudy={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      case "eglise":
        return (
          <div className="mt-4">
            <p className="text-xl">Église</p>
            <div className="grid grid-cols-3 gap-4">
              {search?.eglise.map((item: Eglise) => (
                <CardEgliseUI
                  key={`${item.createdAt}${item.id_eglise}`}
                  eglise={item}
                />
              ))}
            </div>
            <Divider className="mt-4" />
          </div>
        );
      default:
        break;
    }
  };

  useEffect(() => {
    handelFindSearch();
  }, [handelFindSearch]);

  return (
    <div>
      <Tabs
        aria-label="Options"
        color="primary"
        selectedKey={select}
        variant="bordered"
        onSelectionChange={(k) => {
          setSelect(k);
        }}
      >
        <Tab
          key="tout"
          title={
            <div className="flex items-center space-x-2">
              <span>Tout</span>
            </div>
          }
        />
        <Tab
          key="photos"
          title={
            <div className="flex items-center space-x-2">
              <GalleryIcon />
              <span>Photos</span>
            </div>
          }
        />
        <Tab
          key="audios"
          title={
            <div className="flex items-center space-x-2">
              <MusicIcon />
              <span>Music</span>
            </div>
          }
        />
        <Tab
          key="videos"
          title={
            <div className="flex items-center space-x-2">
              <VideoIcon />
              <span>Videos</span>
            </div>
          }
        />
        <Tab
          key="books"
          title={
            <div className="flex items-center space-x-2">
              <RiBook3Fill size={24} />
              <span>Livres</span>
            </div>
          }
        />
        <Tab
          key="forum"
          title={
            <div className="flex items-center space-x-2">
              <FaRegEdit size={24} />
              <span>Forums</span>
            </div>
          }
        />
        <Tab
          key="bibleSutdy"
          title={
            <div className="flex items-center space-x-2">
              <GiBookCover size={24} />
              <span>Étude biblique</span>
            </div>
          }
        />

        <Tab
          key="eglise"
          title={
            <div className="flex items-center space-x-2">
              <CiHome size={24} />
              <span>Église</span>
            </div>
          }
        />
      </Tabs>
      <div>{search && SearchResults()}</div>
    </div>
  );
}

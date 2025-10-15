"use client";
import React, { useCallback, useRef, useState } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
  MapRef,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Tab, Tabs } from "@heroui/tabs";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Input } from "@heroui/input";
import { Image } from "@heroui/image";
import { Link } from "@heroui/link";

import { CardEgliseFromMapUI, CardEgliseUI } from "../../../ui/card/card.ui";
import { Eglise, EglisePaginated } from "../../lib/config/interface";

import { SearchIcon } from "@/ui/icons";
import { file_url } from "@/app/lib/request/request";

export default function ListChurchClientPage({
  initData,
}: {
  initData: EglisePaginated;
}) {
  const [eglise] = useState<EglisePaginated>(initData);
  const [selected, setSelected] = useState<string | number>("Eglise");
  const [popupInfo, setPopupInfo] = useState<Eglise | null>(null);
  const EgliseLocalised = eglise.items.filter(
    (item) =>
      item.localisation_eglise !== null &&
      (item.localisation_eglise[0] !== "0" ||
        item.localisation_eglise[1] !== "0"),
  );
  const [onSearch, setOnSearch] = useState<string>("");
  const [egliseSearched, setEgliseSearched] = useState<Eglise[]>([]);

  const mapRef = useRef<MapRef>(null);
  const onSelectCity = useCallback(
    ({ longitude, latitude }: { longitude: number; latitude: number }) => {
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 2000 });
    },
    [],
  );

  const handelFindInMaps = async (localisation_eglise: string[] | null) => {
    if (localisation_eglise !== null) {
      onSelectCity({
        latitude: parseFloat(localisation_eglise[0]),
        longitude: parseFloat(localisation_eglise[1]),
      });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between">
        <p className="text-[16px] md:text-3xl">Liste des églises de Eclessiabook</p>
        <div>
          <Tabs
            aria-label="Options"
            selectedKey={selected}
            onSelectionChange={setSelected}
          >
            <Tab key={"Eglise"} title="Eglise" />
            <Tab key={"Map"} title="Retrouver sur la Maps" />
          </Tabs>
        </div>
      </div>

      {selected === "Eglise" ? (
        <div className="grid grid-cols-12 gap-x-4 gap-y-4 gap-2">
          <div className="col-span-3" />
          <div className="col-span-12 md:col-span-6 sm:col-span-12">
            {eglise.items.length > 0 &&
              eglise.items?.map((item: Eglise) => (
                <CardEgliseUI key={item.id_eglise} eglise={item} />
              ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-4 mt-4">
          <div className="hidden col-span-0 md:col-span-2 md:flex">
            <ScrollShadow
              hideScrollBar
              className="sticky top-0 bottom-0 h-[300px]"
            >
              {eglise.items.length > 0 &&
                eglise.items?.map((item: Eglise) => {
                  if (
                    item.localisation_eglise !== null &&
                    (item.localisation_eglise[0] !== "0" ||
                      item.localisation_eglise[1] !== "0")
                  ) {
                    return (
                      <CardEgliseFromMapUI
                        key={item.id_eglise}
                        eglise={item}
                        handelFindInMaps={handelFindInMaps}
                      />
                    );
                  }
                })}
            </ScrollShadow>
          </div>
          <div className="col-span-6 md:col-span-4 sm:col-span-6">
            <div className="sticky top-0 bottom-0 h-screen">
              <div className="w-full p-8 flex flex-col justify-center items-center absolute top-0 z-30">
                <Input
                  isClearable
                  classNames={{
                    label: "text-black/50 dark:text-white/90",
                    input: [
                      "bg-transparent",
                      "text-black/90 dark:text-white/90",
                      "placeholder:text-default-700/50 dark:placeholder:text-white/60",
                    ],
                    innerWrapper: "bg-transparent",
                    inputWrapper: [
                      "shadow-xl",
                      "bg-default-200/50",
                      "dark:bg-default/60",
                      "backdrop-blur-xl",
                      "backdrop-saturate-200",
                      "hover:bg-default-200/70",
                      "dark:hover:bg-default/70",
                      "group-data-[focus=true]:bg-default-200/50",
                      "dark:group-data-[focus=true]:bg-default/60",
                      "!cursor-text",
                    ],
                  }}
                  label="Search"
                  placeholder="Tapez pour rechercher..."
                  radius="lg"
                  startContent={
                    <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
                  }
                  value={onSearch}
                  onChange={(e) => {
                    setOnSearch(e.target.value);
                    setEgliseSearched(
                      EgliseLocalised.filter((r) =>
                        r.nom_eglise
                          .toLowerCase()
                          .includes(e.target.value.toLowerCase()),
                      ),
                    );
                  }}
                />
                {egliseSearched.length > 0 && onSearch.length > 0 && (
                  <ScrollShadow className="w-1/2 h-[340px] px-4 bg-transparent bg-default-200/50 dark:bg-default/60 backdrop-blur-xl backdrop-saturate-200 mt-4 rounded-md z-30">
                    {egliseSearched.map((item) => (
                      <button
                        key={item.id_eglise}
                        className="grid grid-cols-4 mt-4 border-b border-b-default pb-1 cursor-pointer"
                        onClick={() => {
                          handelFindInMaps(item.localisation_eglise);
                        }}
                      >
                        <Image
                          alt={`${file_url}${item?.photo_eglise}`}
                          className="object-cover rounded"
                          height={50}
                          src={`${file_url}${item?.photo_eglise}`}
                          style={{
                            width: 50,
                            height: 50,
                          }}
                          width={50}
                        />
                        <div className="col-span-3 flex flex-col justify-center">
                          <h2 className="truncate text-sm uppercase font-bold">
                            {item.nom_eglise}
                          </h2>
                          <p className="truncate text-xs font-bold">
                            {item.adresse_eglise}
                          </p>
                        </div>
                      </button>
                    ))}
                  </ScrollShadow>
                )}
              </div>
              <Map
                ref={mapRef}
                initialViewState={{
                  latitude: -4.334587233146941,
                  longitude: 15.310509409975381,
                  zoom: 13,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken="pk.eyJ1IjoiYWhva2EiLCJhIjoiY2wxa3VlNnk3MDRkbTNjbXllbmtmM3RrdyJ9.Mn74G-jrOwNmOI3v-ljhhA"
                style={{
                  width: "100%",
                  height: "550px",
                  marginTop: 20,
                  borderRadius: 15,
                }}
              >
                <GeolocateControl position="bottom-right" />
                <FullscreenControl position="bottom-right" />
                <NavigationControl position="bottom-right" />
                {/* <ScaleControl /> */}
                {eglise.items.length > 0 &&
                  eglise.items?.map((item: Eglise) => {
                    if (item.localisation_eglise !== null) {
                      return (
                        <Marker
                          key={item.id_eglise}
                          anchor="bottom"
                          latitude={parseFloat(item.localisation_eglise[0])}
                          longitude={parseFloat(item.localisation_eglise[1])}
                          onClick={(e) => {
                            // If we let the click event propagates to the map, it will immediately close the popup
                            // with `closeOnClick: true`
                            e.originalEvent.stopPropagation();
                            setPopupInfo(item);
                          }}
                        >
                          <Image
                            alt={item.photo_eglise}
                            height={35}
                            src={`${file_url}${item.photo_eglise}`}
                            width={35}
                          />
                        </Marker>
                      );
                    }
                  })}
                {popupInfo && (
                  <Popup
                    anchor="top"
                    latitude={Number(popupInfo.localisation_eglise[0])}
                    longitude={Number(popupInfo.localisation_eglise[1])}
                    onClose={() => setPopupInfo(null)}
                  >
                    <div>
                      <Link
                        href={`/c/@${popupInfo.username_eglise}`}
                        target="_new"
                      >
                        {popupInfo.nom_eglise}
                        {popupInfo.adresse_eglise}@{popupInfo.username_eglise}
                      </Link>
                    </div>
                    <Image
                      alt="photo_eglise"
                      height={200}
                      src={`${file_url}${popupInfo.photo_eglise}`}
                      width={200}
                    />
                  </Popup>
                )}
              </Map>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

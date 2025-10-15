import * as React from "react";
import Map, { Marker } from "react-map-gl";

import { MapsInterface } from "@/app/lib/config/interface";
import "mapbox-gl/dist/mapbox-gl.css";

export default function Maps({
  coordinate,
}: {
  adress: string;
  coordinate: MapsInterface;
}) {
  return (
    <Map
      initialViewState={{
        latitude: coordinate?.x || -4.334587233146941,
        longitude: coordinate?.y || 15.310509409975381,
        zoom: 13,
      }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken="pk.eyJ1IjoiYWhva2EiLCJhIjoiY2wxa3VlNnk3MDRkbTNjbXllbmtmM3RrdyJ9.Mn74G-jrOwNmOI3v-ljhhA"
      style={{
        width: "100%",
        height: "550px",
      }}
    >
      <Marker
        key="marker"
        latitude={coordinate?.x || -4.334587233146941}
        longitude={coordinate?.y || 15.310509409975381}
      />
    </Map>
  );
}

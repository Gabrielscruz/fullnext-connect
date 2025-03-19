"use client";

import { useState } from "react";
import { Controls } from "./Controls";

interface VideoProps {
  id: string
  url: string;
}
export function Video({ id, url }: VideoProps) {
  const [isTheaterMode, setIsTheaterMode] = useState<boolean>(false);
  return (
    <div
      className={`animated-transition ${
        isTheaterMode
          ? "absolute z-10 top-0 right-0 left-0 bottom-0 max-md:relative w-full h-full"
          : ""
      }`}
    >
      <video
        id={id}
        src={url}
        controls
        className={isTheaterMode ? "w-full h-full" : "w-full h-auto text-primary "}
      >
        <source src={url} type="video/mp4" />
      </video>
      <Controls isTheaterMode={isTheaterMode} setIsTheaterMode={setIsTheaterMode}/>
 
    </div>
  );
}

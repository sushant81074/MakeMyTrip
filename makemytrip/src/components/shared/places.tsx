"use client";

import React, { useEffect, useRef, useState } from "react";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Image from "next/image";
import beach from "@/public/beach.png";
import airplane from "@/public/airplane.jpg";
import boats from "@/public/boats.png";
import camping from "@/public/camping.png";
import castles from "@/public/castles.png";
import cities from "@/public/cities.png";
import desert from "@/public/desert.png";
import farms from "@/public/farms.png";
import hitorical from "@/public/hitorical.png";
import islands from "@/public/islands.png";
import lakes from "@/public/lakes.png";
import play from "@/public/play.png";
import rooms from "@/public/rooms.png";
import skiing from "@/public/skiing.png";
import skiinout from "@/public/skiinout.png";
import surfing from "@/public/surfing.png";
import topoftheworld from "@/public/topoftheworld.png";
import tower from "@/public/tower.png";
import trading from "@/public/trading.png";
import { ArrowLeft, ArrowRight } from "lucide-react";

const routes = [
  {
    name: "Beach",
    icon: beach,
    path: "/",
  },
  {
    name: "Planes",
    icon: airplane,
    path: "/airplane",
  },
  {
    name: "Boats",
    icon: boats,
    path: "/boats",
  },
  {
    name: "Camping",
    icon: camping,
    path: "/camping",
  },
  {
    name: "Castles",
    icon: castles,
    path: "/castles",
  },
  {
    name: "Cities",
    icon: cities,
    path: "/cities",
  },
  {
    name: "Desert",
    icon: desert,
    path: "/desert",
  },
  {
    name: "Farms",
    icon: farms,
    path: "/farms",
  },
  {
    name: "Hitorical",
    icon: hitorical,
    path: "/hitorical",
  },
  {
    name: "Islands",
    icon: islands,
    path: "/islands",
  },
  {
    name: "Lakes",
    icon: lakes,
    path: "/lakes",
  },
  {
    name: "Play",
    icon: play,
    path: "/play",
  },
  {
    name: "Rooms",
    icon: rooms,
    path: "/rooms",
  },
  {
    name: "Skiing",
    icon: skiing,
    path: "/skiing",
  },
  {
    name: "Ski-In/Out",
    icon: skiinout,
    path: "/skiinout",
  },
  {
    name: "Surfing",
    icon: surfing,
    path: "/surfing",
  },
  {
    name: "Top Of The World",
    icon: topoftheworld,
    path: "/topoftheworld",
  },
  {
    name: "Tower's",
    icon: tower,
    path: "/tower",
  },
  {
    name: "Tranding",
    icon: trading,
    path: "/trading",
  },
];

const Places = () => {
  const pathName = usePathname();
  console.log(pathName);

  const [value, setValue] = useState("Home");
  const [hideButtons, setHideButtons] = useState(false);
  const parentRef = useRef(null);
  const scrollRef = useRef(null);

  // handleScroll Function ----->
  const handleScroll = (direction) => {
    const { current } = scrollRef;

    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;

    if (direction === "left") {
      current.scrollLeft -= scrollAmount;
    } else {
      current.scrollLeft += scrollAmount;
    }
  };

  // isScrollable Function----->
  const isScrollable = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;

    if (current?.scrollWidth >= parent?.offsetWidth) {
      setHideButtons(false);
    } else {
      setHideButtons(true);
    }
  };

  useEffect(() => {
    isScrollable();
    window.addEventListener("resize", isScrollable);
    return () => {
      window.removeEventListener("resize", isScrollable);
    };
  }, []);

  return (
    <div
      ref={parentRef}
      className="px-6 py-4 rounded-md bg-neutral-100 flex gap-4 items-center justify-start relative mx-auto max-w-2xl sm:py-4 lg:px-6"
    >
      <ul
        ref={scrollRef}
        className="px-2 gap-10 relative flex flex-row overflow-x-scroll no-scrollbar sm:gap-8 h-full text-sm"
      >
        {routes.map((route) => (
          <li
            key={route.path}
            className="flex items-center relative font-bold transition text-xs text-neutral-600 group"
          >
            <Link
              className="w-full whitespace-nowrap flex flex-col gap-1 items-center justify-center"
              onClick={() => setValue(route.name)}
              href={route.path}
            >
              <Image
                src={route.icon}
                alt="image"
                height={20}
                width={20}
                className="object-contain"
              />
              {route.name}
            </Link>

            {pathName == route.path && (
              <motion.div
                layoutId="header-active-link"
                className="bg-neutral-500 rounded-tr-lg rounded-tl-lg h-0.5 w-full absolute bottom-0"
              ></motion.div>
            )}
          </li>
        ))}
      </ul>
      {!hideButtons && (
        <>
          <div
            onClick={() => handleScroll("left")}
            className="absolute bg-white flex justify-center items-center rounded-full w-8 h-8 minlg:w-12 minlg:h-12 border border-neutral-300 -left-4 cursor-pointer"
          >
            <ArrowLeft size={20} />
          </div>
          <div
            onClick={() => handleScroll("right")}
            className="absolute bg-white border border-neutral-300 flex items-center justify-center rounded-full w-8 h-8 minlg:w-12 minlg:h-12 -right-4 z-20 cursor-pointer"
          >
            <ArrowRight size={20} />
            {/* <Image
              src={images.right}
              layout="fill"
              objectFit="contain"
              alt="leftArrow"
              className={theme === "light" ? "filter invert" : ""}
            /> */}
          </div>
        </>
      )}
    </div>
  );
};

export default Places;

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { startTracking } from "@/lib/scroll";
import DepthGauge from "./DepthGauge";

const OceanCanvas = dynamic(() => import("./ocean/OceanCanvas"), { ssr: false });

export default function OceanExperience() {
  const [ready, setReady] = useState(false);

  useEffect(() => startTracking(), []);

  return (
    <>
      <div
        aria-hidden
        className={`fixed inset-0 z-0 transition-opacity duration-[1600ms] ease-out ${ready ? "opacity-100" : "opacity-0"}`}
      >
        <OceanCanvas onReady={() => setReady(true)} />
      </div>
      <div aria-hidden className="vignette pointer-events-none fixed inset-0 z-[1]" />
      <DepthGauge />
    </>
  );
}

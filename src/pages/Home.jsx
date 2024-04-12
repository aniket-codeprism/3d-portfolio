import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Loader from "../components/Loader";
import { Space } from "../models/Space";
import { Island } from "../models/Island";
import { Sky } from "../models/Sky";
import { Color } from "three";
import { colors } from "@react-spring/shared";
import { OrbitControls, ScrollControls } from "@react-three/drei";
{
  /* <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center ">
Popup
</div> */
}
const Home = () => {
  const [isRotating, setIsRotating] = useState(false);
  const adjustSpaceForScreenSize = () => {
    let screenScale;
    let screenPostion = [0, -10, -43];
    if (window.innerWidth < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [1, 1, 1];
    }
    return [screenScale, screenPostion];
  };
  const [spaceScale, spacePosition, rotation] = adjustSpaceForScreenSize();
  return (
    <section className="w-full h-screen relative">
      <Canvas
        className={`w-full h-screen bg-black ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        // camera={{ near: 0.1, far: 1000 }}
      >
        <Suspense fallback={<Loader />}>
          <Space
            position={spacePosition}
            scale={spaceScale}
            rotation={rotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
        </Suspense>
      </Canvas>
    </section>
  );
};

export default Home;

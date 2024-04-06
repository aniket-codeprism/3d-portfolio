/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Author: silvercrow101 (https://sketchfab.com/silvercrow101)
License: CC-BY-NC-4.0 (http://creativecommons.org/licenses/by-nc/4.0/)
Source: https://sketchfab.com/3d-models/space-boi-f6a8c6a6727b4f2cb020c8b50bb2ee60
Title: space boi
*/

import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import spaceScene from "../assets/3d/space.glb";
import { a } from "@react-spring/three";
export function Space({
  isRotating,
  setIsRotating,
  setCurrentStage,
  currentFocusPoint,
  ...props
}) {
  const { nodes, materials } = useGLTF(spaceScene);
  const { gl, viewport } = useThree();
  const { mXPos, setMXPos } = useState();
  const spaceRef = useRef();
  // Use a ref for the last mouse x position
  const lastX = useRef(0);
  // Use a ref for rotation speed
  const rotationSpeed = useRef(0);
  // Define a damping factor to control rotation damping
  const dampingFactor = 0.95;

  // Handle pointer (mouse or touch) down event
  const handlePointerDown = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(true);

    // Calculate the clientX based on whether it's a touch event or a mouse event
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    // Store the current clientX position for reference
    lastX.current = clientX;
  };

  // Handle pointer (mouse or touch) up event
  const handlePointerUp = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setIsRotating(false);
  };

  // Handle pointer (mouse or touch) move event
  const handlePointerMove = (event) => {
    event.stopPropagation();
    event.preventDefault();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    setMXPos(clientX);
    console.log(mXPos);
    if (isRotating) {
      // If rotation is enabled, calculate the change in clientX position
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;

      // calculate the change in the horizontal position of the mouse cursor or touch input,
      // relative to the viewport's width
      const delta = (clientX - lastX.current) / viewport.width;

      // Update the island's rotation based on the mouse/touch movement
      spaceRef.current.rotation.y += delta * 0.01 * Math.PI;

      // Update the reference for the last clientX position
      lastX.current = clientX;

      // Update the rotation speed
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  // Handle keydown events
  const handleKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);

      spaceRef.current.rotation.y += 0.005 * Math.PI;
      rotationSpeed.current = 0.007;
    } else if (event.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);

      spaceRef.current.rotation.y -= 0.005 * Math.PI;
      rotationSpeed.current = -0.007;
    }
  };

  // Handle keyup events
  const handleKeyUp = (event) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      setIsRotating(false);
    }
  };

  // Touch events for mobile devices
  const handleTouchStart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    lastX.current = clientX;
  };

  const handleTouchEnd = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  };

  const handleTouchMove = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastX.current) / viewport.width;

      spaceRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastX.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };

  useEffect(() => {
    // Add event listeners for pointer and keyboard events
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("touchmove", handleTouchMove);

    // Remove event listeners when component unmounts
    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchmove", handleTouchMove);
    };
  }, [gl, handlePointerDown, handlePointerUp, handlePointerMove]);

  // This function is called on each frame update
  useFrame(() => {
    // If not rotating, apply damping to slow down the rotation (smoothly)
    if (!isRotating) {
      // Apply damping factor
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) <= 0.002) {
        rotationSpeed.current = 0.002;
      }

      spaceRef.current.rotation.y += rotationSpeed.current;
    } else {
      // When rotating, determine the current stage based on island's orientation
      const rotation = spaceRef.current.rotation.y;

      /**
       * Normalize the rotation value to ensure it stays within the range [0, 2 * Math.PI].
       * The goal is to ensure that the rotation value remains within a specific range to
       * prevent potential issues with very large or negative rotation values.
       *  Here's a step-by-step explanation of what this code does:
       *  1. rotation % (2 * Math.PI) calculates the remainder of the rotation value when divided
       *     by 2 * Math.PI. This essentially wraps the rotation value around once it reaches a
       *     full circle (360 degrees) so that it stays within the range of 0 to 2 * Math.PI.
       *  2. (rotation % (2 * Math.PI)) + 2 * Math.PI adds 2 * Math.PI to the result from step 1.
       *     This is done to ensure that the value remains positive and within the range of
       *     0 to 2 * Math.PI even if it was negative after the modulo operation in step 1.
       *  3. Finally, ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI) applies another
       *     modulo operation to the value obtained in step 2. This step guarantees that the value
       *     always stays within the range of 0 to 2 * Math.PI, which is equivalent to a full
       *     circle in radians.
       */
      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          // setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          // setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          // setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          // setCurrentStage(1);
          break;
        default:
        // setCurrentStage(null);
      }
    }
  });

  return (
    <a.group ref={spaceRef} {...props} dispose={null}>
      <group scale={0.05}>
        <group rotation={[-Math.PI / 2, 0, mXPos ? mXPos : 0]} scale={100}>
          <mesh
            geometry={nodes.body_Material001_0.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            geometry={nodes.body_Material002_0.geometry}
            material={materials["Material.002"]}
          />
        </group>
        <group
          position={[-357.4, 392.6, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={39.7}
        >
          <mesh
            geometry={nodes.Sphere002_Material001_0.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            geometry={nodes.Sphere002_Material002_0.geometry}
            material={materials["Material.002"]}
          />
        </group>
        <group
          position={[199.6, 566.9, -221]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={39.7}
        >
          <mesh
            geometry={nodes.Sphere007_Material001_0.geometry}
            material={materials["Material.001"]}
          />
          <mesh
            geometry={nodes.Sphere007_Material002_0.geometry}
            material={materials["Material.002"]}
          />
        </group>
        <mesh
          geometry={nodes.waves_Material002_0.geometry}
          material={materials["Material.002"]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[100, 100, 1.9]}
        />
        <mesh
          geometry={nodes.waves1_Material002_0.geometry}
          material={materials["Material.002"]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[100, 100, 1.9]}
        />
        <mesh
          geometry={nodes.waves2_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[92.5, 15.5, 2.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[100, 100, 1.9]}
        />
        <mesh
          geometry={nodes.particles_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[489.7, 793.8, 355.3]}
          rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
          scale={20.4}
        />
        <mesh
          geometry={nodes.Sphere_Material001_0.geometry}
          material={materials["Material.001"]}
          position={[375.5, 427.9, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={62.4}
        />
        <mesh
          geometry={nodes.Sphere001_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[375.5, 427.9, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={60.3}
        />
        <mesh
          geometry={nodes.Sphere004_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[375.5, 427.9, 0]}
          rotation={[-0.7, 0, 0]}
          scale={[104.1, 81.6, 0]}
        />
        <mesh
          geometry={nodes.Sphere005_Material001_0.geometry}
          material={materials["Material.001"]}
          position={[-342, 460.2, -117]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={62.4}
        />
        <mesh
          geometry={nodes.Sphere006_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[-342, 460.2, -117]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={60.3}
        />
        <mesh
          geometry={nodes.Sphere009_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[507.5, 667.6, -214.5]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={16.9}
        />
        <mesh
          geometry={nodes.Sphere010_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[-287.4, 585.8, -311.9]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={16.9}
        />
        <mesh
          geometry={nodes.Sphere011_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[-553.5, 331.1, -379.1]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={11.4}
        />
        <mesh
          geometry={nodes.Cube_Material001_0.geometry}
          material={materials["Material.001"]}
          position={[0, -101.7, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={[1120, 1120, 100]}
        />
        <mesh
          geometry={nodes.Sphere003_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[-357.4, 392.6, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={41.1}
        />
        <mesh
          geometry={nodes.Sphere008_Material002_0.geometry}
          material={materials["Material.002"]}
          position={[199.6, 566.9, -221]}
          rotation={[-Math.PI / 2, 0, 0]}
          scale={41.1}
        />
      </group>
    </a.group>
  );
}
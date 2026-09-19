"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./PhotoCylinder.css";

export const photoCylinderPreset = {
  engine: "photo-cylinder",
  version: 1,
  directory: "photo-cylinder",
  settings: {
    geometry: {
      mode: "closed-shape",
      shape: "circle",
      orbitRadius: 220,
      slotCount: 5,
      frameFormat: "square",
      gap: 0,
      scale: 1,
      faceDirection: "outward",
      arc: 360,
      circleRadius: 220,
      lineSpacing: 220,
      lineDirection: "vertical",
      lineDepth: 0,
      lineCurvature: 146,
      lineArcRadiusOffset: 25,
      lineBendDirection: "backward",
      lineFaceAlignment: "tangent",
      lineFaceRotationX: 0,
      lineFaceRotationY: 0,
      lineFaceRotationZ: 0,
      originX: 0,
      originY: 0,
      originZ: 0,
      showOrigin: true,
    },
    camera: {
      fov: 55,
      distance: 0,
      cameraHeight: 0,
      offsetX: 0,
      offsetY: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      targetX: 0,
      targetY: 0,
      targetZ: 0,
      azimuth: 0,
      elevation: 0,
    },
    appearance: {
      borderRadius: 20,
      shadow: 18,
    },
    responsive: {
      enabled: true,
      minScale: 0.5,
      maxScale: 1.35,
      fit: "contain",
    },
  },
  assets: [
    // Orden visual de las 5 pantallas de Figma.
    { id: "pb1", src: "/images/CRAFT/CR2.webp", alt: "Exploramos ideas con autonomía" },
    { id: "pb2", src: "/images/CRAFT/CR1.webp", alt: "Colaboramos para construir juntos" },
    { id: "pb3", src: "/images/CRAFT/CR3.webp", alt: "Pensamos, probamos y mejoramos" },
    { id: "pb4", src: "/images/CRAFT/CR4.webp", alt: "Aprendemos creando soluciones reales" },
    { id: "pb5", src: "/images/CRAFT/CR5.webp", alt: "Desarrollamos habilidades para el futuro" },
  ],
};

type Preset = typeof photoCylinderPreset;

type PhotoCylinderProps = {
  preset?: Preset;
  activeIndex: number;
  sceneScale?: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const getResponsiveScale = (
  width: number,
  height: number,
  responsive: Preset["settings"]["responsive"],
) => {
  if (!responsive.enabled) return 1;

  const widthScale = width / 960;
  const heightScale = height / 640;

  const rawScale =
    responsive.fit === "cover"
      ? Math.max(widthScale, heightScale)
      : Math.min(widthScale, heightScale);

  return clamp(rawScale, responsive.minScale, responsive.maxScale);
};

const circlePoint = (
  geometry: Preset["settings"]["geometry"],
  index: number,
  phaseDegrees = 0,
) => {
  const count = Math.max(1, geometry.slotCount);
  const angle =
    (index / count) * Math.PI * 2 + (phaseDegrees * Math.PI) / 180;

  const radius = Math.max(1, geometry.circleRadius);
  const axis = Math.sin(angle) * radius;
  const depth = Math.cos(angle) * radius;
  const axisDerivative = Math.cos(angle) * radius;
  const depthDerivative = -Math.sin(angle) * radius;

  return {
    x: geometry.lineDirection === "horizontal" ? axis : 0,
    y: geometry.lineDirection === "vertical" ? axis : 0,
    z: depth,
    tangentX: geometry.lineDirection === "horizontal" ? axisDerivative : 0,
    tangentY: geometry.lineDirection === "vertical" ? axisDerivative : 0,
    tangentZ: depthDerivative,
  };
};

const circleOrientation = (
  geometry: Preset["settings"]["geometry"],
  index: number,
  phaseDegrees = 0,
) => {
  const point = circlePoint(geometry, index, phaseDegrees);

  let tangentRotationX = 0;
  let tangentRotationY = 0;

  if (geometry.lineFaceAlignment === "tangent") {
    if (geometry.lineDirection === "horizontal") {
      tangentRotationY =
        (Math.atan2(-point.tangentZ, point.tangentX) * 180) / Math.PI;
    } else {
      tangentRotationX =
        (Math.atan2(point.tangentZ, point.tangentY) * 180) / Math.PI;
    }
  }

  return {
    rotationX: tangentRotationX + geometry.lineFaceRotationX,
    rotationY: tangentRotationY + geometry.lineFaceRotationY,
    rotationZ: geometry.lineFaceRotationZ,
  };
};

const circleFaceTransform = (
  geometry: Preset["settings"]["geometry"],
  index: number,
  phaseDegrees = 0,
) => {
  const point = circlePoint(geometry, index, phaseDegrees);
  const orientation = circleOrientation(geometry, index, phaseDegrees);

  return (
    `translate3d(${point.x}px,${point.y}px,${point.z}px) ` +
    `rotateX(${orientation.rotationX}deg) ` +
    `rotateY(${orientation.rotationY}deg) ` +
    `rotateZ(${orientation.rotationZ}deg) ` +
    `scale(${geometry.scale})`
  );
};

const cameraRigTransform = (
  camera: Preset["settings"]["camera"],
) =>
  `translate3d(${camera.offsetX}px,${camera.offsetY - camera.cameraHeight}px,${-camera.distance}px) ` +
  `rotateX(${camera.elevation}deg) rotateY(${camera.azimuth}deg) ` +
  `translate3d(${-camera.targetX}px,${-camera.targetY}px,${-camera.targetZ}px)`;

const frameSize = () => ({ width: 174, height: 174 });

export default function PhotoCylinder({
  preset = photoCylinderPreset,
  activeIndex,
  sceneScale = 2.85,
}: PhotoCylinderProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [layoutScale, setLayoutScale] = useState(1);

  const config = preset.settings;

  const slots = useMemo(
    () =>
      Array.from(
        { length: config.geometry.slotCount },
        (_, index) => preset.assets[index] ?? null,
      ),
    [config.geometry.slotCount, preset.assets],
  );

  useEffect(() => {
    if (!config.responsive.enabled || !rootRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setLayoutScale(getResponsiveScale(width, height, config.responsive));
    });

    observer.observe(rootRef.current);
    return () => observer.disconnect();
  }, [
    config.responsive.enabled,
    config.responsive.fit,
    config.responsive.maxScale,
    config.responsive.minScale,
  ]);

  // Sin autoplay mientras ajustamos el diseño.
  // Cada índice coloca exactamente su tarjeta al frente.
  const phase = -(activeIndex * 360) / config.geometry.slotCount;

  const perspective =
    360 / Math.tan((config.camera.fov * Math.PI) / 360);

  const cameraTransform = cameraRigTransform(config.camera);

  const sceneTransform =
    `translate3d(${config.geometry.originX}px,${config.geometry.originY}px,${config.geometry.originZ}px) ` +
    `rotateX(${config.camera.rotationX}deg) ` +
    `rotateZ(${config.camera.rotationZ}deg) ` +
    `scale(${layoutScale * sceneScale})`;

  return (
    <div
      ref={rootRef}
      className="photo-cylinder-root"
      style={{ perspective }}
    >
      <div
        className="photo-cylinder-camera"
        style={{ transform: cameraTransform }}
      >
        <div
          className="photo-cylinder-track"
          style={{ transform: sceneTransform }}
        >
          {slots.map((photo, index) => {
            const frame = frameSize();
            const transform = circleFaceTransform(
              config.geometry,
              index,
              phase,
            );

            return (
              <div
                key={photo?.id ?? `empty-${index}`}
                className={`photo-cylinder-face ${photo ? "" : "is-placeholder"}`}
                style={{
                  width: frame.width,
                  height: frame.height,
                  left: -frame.width / 2,
                  top: -frame.height / 2,
                  transform,
                  borderRadius: config.appearance.borderRadius,
                  boxShadow: `0 ${Math.round(config.appearance.shadow / 3)}px ${config.appearance.shadow}px rgba(0,0,0,.48)`,
                }}
              >
                {photo ? (
                  <img src={photo.src} alt={photo.alt} />
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

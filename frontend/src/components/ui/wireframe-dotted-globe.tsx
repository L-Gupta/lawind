"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface RotatingEarthProps {
  width?: number;
  height?: number;
  className?: string;
}

type LandGeometry =
  | { type: "Polygon"; coordinates: number[][][] }
  | { type: "MultiPolygon"; coordinates: number[][][][] };

interface LandFeature {
  type: "Feature";
  properties: Record<string, unknown>;
  geometry: LandGeometry;
}

interface LandFeatureCollection {
  type: "FeatureCollection";
  features: LandFeature[];
}

const INDIA_COORDS: [number, number] = [78.9629, 20.5937];

export default function RotatingEarth({ width = 520, height = 520, className = "" }: RotatingEarthProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const containerWidth = Math.min(width, window.innerWidth - 40);
    const containerHeight = Math.min(height, window.innerWidth - 40);
    const radius = Math.min(containerWidth, containerHeight) / 2.4;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = containerWidth * dpr;
    canvas.height = containerHeight * dpr;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
    context.scale(dpr, dpr);

    const projection = d3
      .geoOrthographic()
      .scale(radius)
      .translate([containerWidth / 2, containerHeight / 2])
      .clipAngle(90);

    const path = d3.geoPath().projection(projection).context(context);

    const pointInPolygon = (point: [number, number], polygon: number[][]): boolean => {
      const [x, y] = point;
      let inside = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          inside = !inside;
        }
      }
      return inside;
    };

    const pointInFeature = (point: [number, number], feature: LandFeature): boolean => {
      const geometry = feature.geometry;
      if (geometry.type === "Polygon") {
        const coordinates = geometry.coordinates;
        if (!pointInPolygon(point, coordinates[0])) return false;
        for (let i = 1; i < coordinates.length; i++) {
          if (pointInPolygon(point, coordinates[i])) return false;
        }
        return true;
      } else if (geometry.type === "MultiPolygon") {
        for (const polygon of geometry.coordinates) {
          if (pointInPolygon(point, polygon[0])) {
            let inHole = false;
            for (let i = 1; i < polygon.length; i++) {
              if (pointInPolygon(point, polygon[i])) {
                inHole = true;
                break;
              }
            }
            if (!inHole) return true;
          }
        }
        return false;
      }
      return false;
    };

    const generateDotsInPolygon = (feature: LandFeature, dotSpacing = 16) => {
      const dots: [number, number][] = [];
      const bounds = d3.geoBounds(feature as d3.GeoPermissibleObjects);
      const [[minLng, minLat], [maxLng, maxLat]] = bounds;
      const stepSize = dotSpacing * 0.08;

      for (let lng = minLng; lng <= maxLng; lng += stepSize) {
        for (let lat = minLat; lat <= maxLat; lat += stepSize) {
          const point: [number, number] = [lng, lat];
          if (pointInFeature(point, feature)) dots.push(point);
        }
      }
      return dots;
    };

    interface DotData {
      lng: number;
      lat: number;
    }

    const allDots: DotData[] = [];
    let landFeatures: LandFeatureCollection | undefined;

    const render = () => {
      context.clearRect(0, 0, containerWidth, containerHeight);

      const currentScale = projection.scale();
      const scaleFactor = currentScale / radius;

      context.beginPath();
      context.arc(containerWidth / 2, containerHeight / 2, currentScale, 0, 2 * Math.PI);
      context.fillStyle = "#0a0907";
      context.fill();
      context.strokeStyle = "rgba(160, 120, 32, 0.6)";
      context.lineWidth = 1.5 * scaleFactor;
      context.stroke();

      if (landFeatures) {
        const graticule = d3.geoGraticule();
        context.beginPath();
        path(graticule());
        context.strokeStyle = "rgba(255, 255, 255, 0.15)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        context.beginPath();
        landFeatures.features.forEach((feature) => {
          path(feature as d3.GeoPermissibleObjects);
        });
        context.strokeStyle = "rgba(255, 255, 255, 0.35)";
        context.lineWidth = 1 * scaleFactor;
        context.stroke();

        allDots.forEach((dot) => {
          const projected = projection([dot.lng, dot.lat]);
          if (
            projected &&
            projected[0] >= 0 &&
            projected[0] <= containerWidth &&
            projected[1] >= 0 &&
            projected[1] <= containerHeight
          ) {
            context.beginPath();
            context.arc(projected[0], projected[1], 1.1 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "rgba(160, 120, 32, 0.85)";
            context.fill();
          }
        });

        const viewCenter: [number, number] = [-rotation[0], -rotation[1]];
        const indiaVisible = d3.geoDistance(INDIA_COORDS, viewCenter) < Math.PI / 2;
        if (indiaVisible) {
          const projectedIndia = projection(INDIA_COORDS);
          if (projectedIndia) {
            const [px, py] = projectedIndia;

            context.beginPath();
            context.arc(px, py, 4.5 * scaleFactor, 0, 2 * Math.PI);
            context.strokeStyle = "#fff";
            context.lineWidth = 1.5 * scaleFactor;
            context.stroke();

            context.beginPath();
            context.arc(px, py, 2 * scaleFactor, 0, 2 * Math.PI);
            context.fillStyle = "#fff";
            context.fill();

            context.fillStyle = "rgba(255, 255, 255, 0.9)";
            context.font = `${11 * scaleFactor}px system-ui, sans-serif`;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.fillText("India", px + 9 * scaleFactor, py);
          }
        }
      }
    };

    const loadWorldData = async () => {
      try {
        const response = await fetch("/data/land-110m.json");
        if (!response.ok) throw new Error("Failed to load land data");
        const data = (await response.json()) as LandFeatureCollection;
        landFeatures = data;

        data.features.forEach((feature) => {
          const dots = generateDotsInPolygon(feature, 16);
          dots.forEach(([lng, lat]) => {
            allDots.push({ lng, lat });
          });
        });

        render();
      } catch {
        setError("Failed to load globe data");
      }
    };

    const rotation = [-INDIA_COORDS[0], -INDIA_COORDS[1]];
    let autoRotate = true;
    const rotationSpeed = 0.3;

    const rotate = () => {
      if (autoRotate) {
        rotation[0] += rotationSpeed;
        projection.rotate(rotation as [number, number]);
        render();
      }
    };

    const rotationTimer = d3.timer(rotate);

    const handleMouseDown = (event: MouseEvent) => {
      autoRotate = false;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation = [...rotation];

      const handleMouseMove = (moveEvent: MouseEvent) => {
        const sensitivity = 0.5;
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;

        rotation[0] = startRotation[0] + dx * sensitivity;
        rotation[1] = startRotation[1] - dy * sensitivity;
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));

        projection.rotate(rotation as [number, number]);
        render();
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        setTimeout(() => {
          autoRotate = true;
        }, 10);
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    };

    canvas.addEventListener("mousedown", handleMouseDown);

    loadWorldData();

    return () => {
      rotationTimer.stop();
      canvas.removeEventListener("mousedown", handleMouseDown);
    };
  }, [width, height]);

  if (error) {
    return (
      <div className={`globe-error ${className}`}>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className={`globe-wrap ${className}`}>
      <canvas ref={canvasRef} className="globe-canvas" />
      <p className="globe-hint">Drag to rotate</p>
    </div>
  );
}

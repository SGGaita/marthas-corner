"use client";
import { useId } from "react";
import { planetSvg } from "@/lib/planets";

// Cartoon planet picture. `size` is any CSS width (e.g. "70%" or "clamp(110px,30vw,160px)").
export default function Planet({ k, size = "70%", face = true }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "") + k;
  return (
    <span
      style={{ display: "block", width: size, aspectRatio: "1", lineHeight: 0 }}
      dangerouslySetInnerHTML={{ __html: planetSvg(k, uid, { face }).replace("<svg ", '<svg width="100%" height="100%" ') }}
    />
  );
}

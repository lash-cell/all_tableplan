import type { IconName } from "./icons";

export type Tint =
  | "mint" | "peach" | "rose" | "lavender" | "butter" | "sky" | "slate"
  | "success" | "warning" | "danger";
export type Shape = "box" | "pill" | "diamond";
export type Side = "l" | "r" | "t" | "b";

export interface DiagramNode {
  id: string;
  lines: string[];
  x: number; y: number; w: number; h: number;
  shape: Shape;
  tint: Tint;
  icon?: IconName;
}

export interface DiagramEdge {
  from: string; fromSide: Side;
  to: string; toSide: Side;
  label?: string;
  dashed?: boolean;
}

export interface DiagramGroup {
  id: string; label: string;
  x: number; y: number; w: number; h: number;
  tint: Tint;
}

export interface DiagramData {
  id: string;
  label: string;
  width: number; height: number;
  groups: DiagramGroup[];
  nodes: DiagramNode[];
  edges: DiagramEdge[];
}

export interface DetailInfo {
  title: string;
  body: string;
  meta?: string;
  items?: string[];
}

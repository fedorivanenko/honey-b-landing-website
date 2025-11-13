/**
 * Minimal replica of Sanity's Portable Text type surface.
 * These types are intentionally loose so clients can annotate custom blocks.
 */

export type PortableTextMarks = string[];

export interface PortableTextSpan {
  _type: "span";
  _key: string;
  text: string;
  marks: PortableTextMarks;
}

export interface PortableTextMarkDefinition {
  _type: string;
  _key: string;
  [key: string]: unknown;
}

export interface PortableTextObject {
  _type: string;
  _key?: string;
  [key: string]: unknown;
}

export type PortableTextChild = PortableTextSpan | PortableTextObject;

export interface PortableTextBlock<
  TChild extends PortableTextChild = PortableTextChild,
  TMarkDef extends PortableTextMarkDefinition = PortableTextMarkDefinition,
> {
  _type: string;
  _key: string;
  children?: TChild[];
  markDefs?: TMarkDef[];
  style?: string;
  listItem?: string;
  level?: number;
  [key: string]: unknown;
}

export type PortableText = PortableTextBlock[];

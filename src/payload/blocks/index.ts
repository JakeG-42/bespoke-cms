import type { Block } from "payload";

import { CallToActionBlock } from "./CallToAction.ts";
import { CardGridBlock } from "./CardGrid.ts";
import { DownloadsBlock } from "./Downloads.ts";
import { GalleryBlock } from "./Gallery.ts";
import { HeroBlock } from "./Hero.ts";
import { ImageTextBlock } from "./ImageText.ts";
import { ProductGridBlock } from "./ProductGrid.ts";
import { RichTextBlock } from "./RichText.ts";
import { SpecTableBlock } from "./SpecTable.ts";

export const pageBlocks: Block[] = [
  HeroBlock,
  RichTextBlock,
  ImageTextBlock,
  CardGridBlock,
  ProductGridBlock,
  GalleryBlock,
  DownloadsBlock,
  SpecTableBlock,
  CallToActionBlock,
];

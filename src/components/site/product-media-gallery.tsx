"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { ProductImage } from "@/content/products";

type ProductMediaGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductMediaGallery({ images, productName }: ProductMediaGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const selectedImage = images[selectedIndex] ?? images[0];
  const hasMultipleImages = images.length > 1;

  function showPrevious() {
    setSelectedIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNext() {
    setSelectedIndex((current) => (current + 1) % images.length);
  }

  useEffect(() => {
    if (!isZoomOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsZoomOpen(false);
      }

      if (event.key === "ArrowLeft" && hasMultipleImages) {
        setSelectedIndex((current) => (current === 0 ? images.length - 1 : current - 1));
      }

      if (event.key === "ArrowRight" && hasMultipleImages) {
        setSelectedIndex((current) => (current + 1) % images.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, isZoomOpen, images.length]);

  if (!selectedImage) {
    return null;
  }

  return (
    <section className="product-media-gallery" aria-label={`${productName} product images`}>
      <button className="gallery-stage" type="button" onClick={() => setIsZoomOpen(true)}>
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt}
          fill
          priority
          sizes="(max-width: 980px) 100vw, 42vw"
        />
        <span className="zoom-hint">Zoom image</span>
      </button>

      {hasMultipleImages ? (
        <div className="thumbnail-strip" aria-label="Choose product image">
          {images.map((image, index) => (
            <button
              aria-label={`Show image ${index + 1} of ${images.length}`}
              aria-pressed={selectedIndex === index}
              className={`thumbnail-button ${selectedIndex === index ? "active" : ""}`}
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => setSelectedIndex(index)}
            >
              <Image src={image.src} alt="" fill sizes="96px" />
            </button>
          ))}
        </div>
      ) : null}

      <p className="gallery-caption">
        {selectedImage.alt || `${productName} image`}{" "}
        <span>
          {selectedIndex + 1}/{images.length}
        </span>
      </p>

      {isZoomOpen ? (
        <div className="zoom-backdrop" role="dialog" aria-modal="true" aria-label={`${productName} zoomed image`}>
          <button className="zoom-dismiss-layer" type="button" aria-label="Close image zoom" onClick={() => setIsZoomOpen(false)} />
          <div className="zoom-dialog">
            <div className="zoom-toolbar">
              <span>{selectedImage.alt || productName}</span>
              <button type="button" onClick={() => setIsZoomOpen(false)}>
                Close
              </button>
            </div>
            <div className="zoom-media">
              <Image src={selectedImage.src} alt={selectedImage.alt} fill sizes="100vw" />
            </div>
            {hasMultipleImages ? (
              <div className="zoom-controls" aria-label="Zoom gallery controls">
                <button type="button" onClick={showPrevious}>
                  Previous
                </button>
                <span>
                  {selectedIndex + 1} / {images.length}
                </span>
                <button type="button" onClick={showNext}>
                  Next
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

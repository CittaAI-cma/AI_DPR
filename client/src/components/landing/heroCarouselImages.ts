/**
 * Images for the homepage hero carousel.
 *
 * To add your images:
 *   1. Put the files in `client/public/hero/` (e.g. card-1.jpg).
 *   2. Set `src` to the public path (e.g. '/hero/card-1.jpg').
 *   3. Write a short `alt` description, or leave it '' if the image is purely decorative.
 *
 * Any entry with an empty `src` shows a neutral placeholder tile.
 * Portrait images (about 3:4) look best. You can add or remove entries;
 * 8–12 works well for a smooth loop.
 */
export interface HeroCarouselImage {
  src: string;
  alt: string;
}

export const HERO_CAROUSEL_IMAGES: HeroCarouselImage[] = [
  { src: '/hero/card-01.webp', alt: 'Engineer reviewing a rooftop solar installation on a tablet' },
  { src: '/hero/card-02.webp', alt: 'Women examining a silk saree in a handloom weaving unit' },
  { src: '/hero/card-04.webp', alt: 'Artisan painting traditional wooden toys in his workshop' },
  { src: '/hero/card-03.webp', alt: 'Packaging unit owner inspecting a corrugated carton' },
  { src: '/hero/card-05.webp', alt: 'Artisan hand-painting a Kalamkari textile' },
  { src: '/hero/card-08.webp', alt: 'Groundnut oil unit owner inspecting a freshly filled bottle of oil' },
  { src: '/hero/card-07.webp', alt: 'Owner and technician measuring a machined part with vernier callipers' },
  { src: '/hero/card-06.webp', alt: 'Woman inspecting packed red chillies in a food processing unit' },
  { src: '/hero/card-09.webp', alt: 'Rice mill owner checking the quality of milled rice' },
  { src: '/hero/card-10.webp', alt: 'Artisan hand block-printing a floral textile' },
];

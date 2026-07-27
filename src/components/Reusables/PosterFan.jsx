import LazyImage from "./LazyImage";
import { getTmdbImageUrl, TMDB_IMAGE_SIZES } from "../../lib/utils";

const pickPosters = (items) =>
  (items ?? []).filter((item) => item.poster_path).slice(0, 3);

const PosterFan = ({ items, imageURL, layout = "compact", className = "" }) => {
  const posters = pickPosters(items);

  if (!posters.length || !imageURL) return null;

  if (layout === "floating") {
    return (
      <div className={`relative mx-auto h-[20rem] w-full max-w-xs sm:h-[24rem] sm:max-w-sm md:h-[26rem] lg:h-[28rem] lg:max-w-md ${className}`} aria-hidden>
        <div className="animate-float-delayed absolute left-0 top-6 z-10 w-[8.5rem] overflow-hidden rounded-2xl liquid-glass glow-ring sm:top-8 sm:w-[10rem] md:w-[11rem]">
          <div className="aspect-[2/3]">
            <LazyImage
              src={getTmdbImageUrl(imageURL, posters[0]?.poster_path, TMDB_IMAGE_SIZES.posterLg)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="animate-float absolute right-0 top-0 z-20 w-[9.5rem] overflow-hidden rounded-2xl liquid-glass-strong glow-ring sm:w-[11rem] md:w-[12.5rem]">
          <div className="aspect-[2/3]">
            <LazyImage
              src={getTmdbImageUrl(imageURL, posters[1]?.poster_path, TMDB_IMAGE_SIZES.posterLg)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="animate-float-delayed absolute bottom-0 left-1/4 z-0 w-[7.5rem] overflow-hidden rounded-2xl liquid-glass opacity-80 sm:w-[8.5rem] md:w-[10rem]">
          <div className="aspect-[2/3]">
            <LazyImage
              src={getTmdbImageUrl(imageURL, posters[2]?.poster_path, TMDB_IMAGE_SIZES.posterLg)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="pointer-events-none absolute inset-0 rounded-full bg-accent/25 blur-[80px]" />
      </div>
    );
  }

  return (
    <div
      className={`flex items-end justify-center gap-1.5 px-2 min-[400px]:gap-2 min-[400px]:px-4 sm:gap-3 ${className}`}
      aria-hidden
    >
      {posters.map((item, index) => (
        <div
          key={item.id ?? index}
          className={`w-[5.25rem] shrink-0 overflow-hidden rounded-xl liquid-glass min-[400px]:w-[6.25rem] sm:w-[7.25rem] sm:rounded-2xl ${
            index === 1 ? "glow-ring z-10 -translate-y-2 scale-105" : "opacity-90"
          } ${index === 0 ? "animate-float-delayed" : index === 1 ? "animate-float" : "animate-float-delayed"}`}
        >
          <div className="aspect-[2/3]">
            <LazyImage
              src={getTmdbImageUrl(imageURL, item.poster_path, TMDB_IMAGE_SIZES.posterLg)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export { PosterFan };
export default PosterFan;

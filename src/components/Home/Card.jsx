import { useSelector } from 'react-redux';
import { formatYear } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { IoStar, IoPlay } from 'react-icons/io5';
import { getRatingColor } from '../../lib/utils';
import LazyImage from '../Reusables/LazyImage';

const Card = ({ data, trending, index, media_type }) => {
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const mediaType = data?.media_type ?? media_type;

    const title = data?.title || data?.original_title || data?.name || data?.original_name;
    const releaseDate = data?.release_date || data?.first_air_date;
    const year = formatYear(releaseDate);

    return (
        <Link to={"/" + mediaType + "/" + data.id} className="group relative block w-full">
            <div className="rounded-[1.25rem] shadow-[0_4px_20px_rgba(0,0,0,0.35)] transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)]">
                <div className="relative aspect-[2/3] overflow-hidden rounded-[1.25rem] bg-background">
                    {trending && index && (
                        <div className="glass-pill absolute top-2.5 left-2.5 z-20 apple-caption-1 font-semibold text-text">
                            #{index}
                        </div>
                    )}

                    {mediaType && (
                        <div className="glass-pill absolute top-2.5 right-2.5 z-20 apple-caption-2 font-semibold uppercase tracking-wider text-text/90">
                            {mediaType === 'tv' ? 'Series' : 'Movie'}
                        </div>
                    )}

                    {data.poster_path ? (
                        <LazyImage
                            src={imageURL + data.poster_path}
                            alt={title}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center apple-footnote p-4 text-center">
                            No Image Available
                        </div>
                    )}

                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70 transition-opacity duration-500 sm:opacity-0 sm:group-hover:opacity-100">
                        <div className="liquid-glass-strong rounded-full p-3 transition-transform duration-500 sm:translate-y-4 sm:group-hover:translate-y-0">
                            <IoPlay className="h-6 w-6 text-text sm:h-7 sm:w-7" />
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background from-20% via-background/85 via-50% to-transparent px-3 pb-3 pt-16">
                        <h3 className="apple-headline line-clamp-1 text-text">{title}</h3>
                        <div className="mt-1 flex items-center justify-between">
                            {year && <span className="apple-caption-1">{year}</span>}
                            {data?.vote_average > 0 && (
                                <div className={`flex items-center gap-1 apple-caption-1 ${getRatingColor(data.vote_average).text}`}>
                                    <IoStar className="h-3 w-3 fill-current" />
                                    <span>{Number(data.vote_average).toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;

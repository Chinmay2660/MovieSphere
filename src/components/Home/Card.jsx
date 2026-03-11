import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { IoStar, IoPlay } from 'react-icons/io5';
import { getRatingColor } from '../../lib/utils';

const Card = ({ data, trending, index, media_type }) => {
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const mediaType = data?.media_type ?? media_type;

    const title = data?.title || data?.original_title || data?.name || data?.original_name;
    const releaseDate = data?.release_date || data?.first_air_date;
    const year = releaseDate ? moment(releaseDate).format("YYYY") : null;

    return (
        <Link 
            to={"/" + mediaType + "/" + data.id} 
            className="group block w-full max-w-[220px] relative"
        >
            <div className="relative overflow-hidden rounded-xl bg-black/80 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl">
                {trending && index && (
                    <div className="absolute top-2 left-2 z-20 bg-yellow-400 text-black font-bold rounded-lg px-2.5 py-1 text-xs shadow-lg">
                        #{index}
                    </div>
                )}

                {mediaType && (
                    <div className={`absolute top-2 right-2 z-20 text-black text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        mediaType === 'tv' 
                            ? 'bg-white/90' 
                            : 'bg-white/90'
                    }`}>
                        {mediaType === 'tv' ? 'TV' : 'Movie'}
                    </div>
                )}

                <div className="relative aspect-[2/3] overflow-hidden">
                    {data.poster_path ? (
                        <img
                            src={imageURL + data.poster_path}
                            alt={title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/40 text-white/50 text-sm text-center p-4">
                            No Image Available
                        </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                                <IoPlay className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                <div className="p-3 space-y-1.5 bg-black/95">
                    <h3 className="font-semibold text-white text-sm line-clamp-1 transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center justify-between text-xs">
                        {year && (
                            <span className="text-white/60">{year}</span>
                        )}

                        {data?.vote_average > 0 && (
                            <div className={`flex items-center gap-1 ${getRatingColor(data.vote_average).text}`}>
                                <IoStar className="w-3 h-3 fill-current" />
                                <span className="font-medium">{Number(data.vote_average).toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;

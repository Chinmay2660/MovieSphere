import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { Link } from 'react-router-dom';

const Card = ({ data, trending, index, media_type }) => {
    const imageURL = useSelector((state) => state.movieData.imageURL);
    const mediaType = data.media_type ?? media_type;

    return (
        <Link to={"/"+mediaType+"/"+data.id} className="text-text min-w-[230px] max-w-[230px] block p-4 rounded-lg shadow-lg m-2 w-full relative hover:scale-105 ">
            {trending &&
                <span className="relative right-6 top-7 bg-yellow-500 text-black font-bold rounded-r-lg px-2 py-1">
                    Trending #{index}
                </span>}
            <img
                src={imageURL + data.poster_path}
                alt={
                    data?.title
                        ? data?.title
                        : data?.original_title
                            ? data?.original_title
                            : data?.name
                }
                className="w-full h-48 object-cover rounded-md"
                loading='lazy'
            />
            <h3 className="text-lg font-bold mt-2">
                {data?.title
                    ? data?.title
                    : data?.original_title
                        ? data?.original_title
                        : data?.name}
            </h3>
            <p className="text-secondary mt-1">
                {moment(data.release_date ? data.release_date : data.first_air_date).format("MMMM Do YYYY")}
            </p>
            <p className="text-tertiary mt-1">Rating: {Number(data.vote_average).toFixed(1)}</p>
        </Link>
    );
};

Card.propTypes = {
    data: PropTypes.shape({
        poster_path: PropTypes.string.isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        release_date: PropTypes.string,
        first_air_date: PropTypes.string,
        vote_average: PropTypes.number.isRequired,
        original_title: PropTypes.string,
        media_type: PropTypes.string.isRequired,
        id: PropTypes.number.isRequired,
    }).isRequired,
    index: PropTypes.number.isRequired,
    media_type: PropTypes.string.isRequired,
    trending: PropTypes.bool.isRequired
};

export default Card;

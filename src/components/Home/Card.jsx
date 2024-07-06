import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

const Card = ({ data, trending, index }) => {
    const imageURL = useSelector((state) => state.movieData.imageURL);
    return (
        <div className="text-text p-4 rounded-lg shadow-lg m-2 w-full relative">
            {trending &&
                <span className="absolute top-4 left-4 bg-yellow-500 text-black font-bold rounded-r-lg px-2 py-1">
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
            />
            <h3 className="text-lg font-bold mt-2">
                {data?.title
                    ? data?.title
                    : data?.original_title
                        ? data?.original_title
                        : data?.name}
            </h3>
            <p className="text-secondary mt-1">
                {data.release_date ? data.release_date : data.first_air_date}
            </p>
            <p className="text-tertiary mt-1">Rating: {Number(data.vote_average).toFixed(1)}</p>
        </div>
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
    }).isRequired,
    index: PropTypes.number.isRequired,
    trending: PropTypes.bool.isRequired
};

export default Card;

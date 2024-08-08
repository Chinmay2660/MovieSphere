import { IoClose } from "react-icons/io5";
import axiosInstance from "../lib/axiosConfig";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

const VideoPlay = ({ playVideoId, close, media_type }) => {
    const [videoData, setVideoData] = useState(null);
    const [useFallback, setUseFallback] = useState(media_type === 'tv');

    const fetchVideoData = async () => {
        try {
            const response = await axiosInstance.get(`/${media_type}/${playVideoId}/videos`);
            const video = response.data.results.find(video =>
                video.type === "Trailer" || video.type === "Teaser"
            );
            setVideoData(video);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        fetchVideoData();
    }, [playVideoId, media_type]);

    const getVideoSrc = () => {
        if (media_type === "tv" || useFallback) {
            return `https://www.youtube.com/embed/${videoData?.key}`;
        } else {
            return `https://vidsrc.cc/v2/embed/${media_type}/${playVideoId}`;
        }
    };

    return (
        <section className="fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex items-center justify-center">
            <div className="w-full max-h-[80vh] max-w-screen-lg bg-black aspect-video rounded-lg overflow-hidden shadow-xl relative">
                <button className="absolute top-0 right-0 p-2 text-2xl text-white rounded-full hover:bg-white hover:text-black" onClick={close}>
                    <IoClose />
                </button>
                {videoData?.key && (
                    <iframe
                        title="video"
                        src={getVideoSrc()}
                        className="w-full h-full"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        onError={() => setUseFallback(true)} // Switch to YouTube if vidsrc fails
                    />
                )}
            </div>
        </section>
    );
};

VideoPlay.propTypes = {
    playVideoId: PropTypes.number.isRequired,
    media_type: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired
};

export default VideoPlay;

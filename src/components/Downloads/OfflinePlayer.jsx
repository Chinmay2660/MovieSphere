import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { getBlob } from "../../lib/downloadStorage";
import { USER_MESSAGES } from "../../lib/userFriendlyError";
import Loader from "../Reusables/Loader";
import { useLocale } from "../../context/LocaleContext";

const OfflinePlayer = ({ blobKey, title, mimeType, onClose }) => {
  const { t } = useLocale();
  const [videoUrl, setVideoUrl] = useState(null);
  const [playbackError, setPlaybackError] = useState(false);

  useEffect(() => {
    let url = null;
    const load = async () => {
      const blob = await getBlob(blobKey);
      if (blob) {
        const type = mimeType || blob.type || "video/mp4";
        const typedBlob = blob.type ? blob : new Blob([blob], { type });
        url = URL.createObjectURL(typedBlob);
        setVideoUrl(url);
      }
    };
    load();
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [blobKey, mimeType]);

  return (
    <section
      className="fixed inset-0 z-50 bg-surface flex flex-col"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-text font-medium truncate pr-4">{title}</h2>
        <button
          onClick={onClose}
          className="p-2 text-text/80 hover:text-text hover:bg-surface-elevated rounded-full transition-all"
          aria-label="Close player"
        >
          <IoClose className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        {videoUrl ? (
          playbackError ? (
            <p className="text-muted text-sm text-center max-w-md">
              {USER_MESSAGES.playback}
            </p>
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              onError={() => setPlaybackError(true)}
              className="w-full max-w-5xl max-h-[80vh] rounded-lg bg-surface"
            />
          )
        ) : (
          <Loader size="lg" label={t('loading.offline')} />
        )}
      </div>
    </section>
  );
};

export default OfflinePlayer;

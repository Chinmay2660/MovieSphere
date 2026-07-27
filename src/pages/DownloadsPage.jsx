import { useState } from "react";
import { useSelector } from "react-redux";
import { IoDownloadOutline } from "react-icons/io5";
import DownloadItem from "../components/Downloads/DownloadItem";
import OfflinePlayer from "../components/Downloads/OfflinePlayer";
import {
  selectActiveDownloads,
  selectCompletedDownloads,
} from "../reduxStore/Reducer/downloadsSlice";

const DownloadsPage = () => {
  const imageURL = useSelector((state) => state.movieData.imageURL);
  const activeDownloads = useSelector(selectActiveDownloads);
  const completedDownloads = useSelector(selectCompletedDownloads);
  const failedDownloads = useSelector((state) =>
    state.downloads.filter((d) => d.status === "failed" || d.status === "cancelled")
  );
  const [playingItem, setPlayingItem] = useState(null);

  const isEmpty =
    activeDownloads.length === 0 &&
    completedDownloads.length === 0 &&
    failedDownloads.length === 0;

  return (
    <div className="apple-page">
      <div
        className={`apple-container max-w-3xl py-6 sm:py-8${
          isEmpty ? " flex flex-1 flex-col justify-center" : ""
        }`}
      >
        <header className="apple-section-header flex items-center gap-3">
          <IoDownloadOutline className="h-8 w-8 text-accent" aria-hidden />
          <div>
            <h1 className="apple-large-title text-text">Downloads</h1>
            <p className="apple-subheadline mt-1">
              Watch offline. Streams are resolved from vidsrc.sbs.
            </p>
          </div>
        </header>

        {isEmpty && (
          <div className="apple-content-box apple-empty-state">
            <IoDownloadOutline className="mx-auto mb-4 h-12 w-12 text-muted" />
            <p className="apple-headline text-secondary">No downloads yet</p>
            <p className="apple-footnote mx-auto mt-2 max-w-sm">
              Go to a movie or series detail page and tap Download to save it for offline viewing.
            </p>
          </div>
        )}

        {activeDownloads.length > 0 && (
          <section className="mb-8">
            <h2 className="apple-title-3 mb-4 flex items-center gap-2 text-text">
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Downloading ({activeDownloads.length})
            </h2>
            <div className="space-y-2">
              {activeDownloads.map((item) => (
                <DownloadItem key={item.key} item={item} imageURL={imageURL} onPlay={setPlayingItem} />
              ))}
            </div>
          </section>
        )}

        {completedDownloads.length > 0 && (
          <section className="mb-8">
            <h2 className="apple-title-3 mb-4 text-text">
              Ready to Watch ({completedDownloads.length})
            </h2>
            <div className="space-y-2">
              {completedDownloads.map((item) => (
                <DownloadItem key={item.key} item={item} imageURL={imageURL} onPlay={setPlayingItem} />
              ))}
            </div>
          </section>
        )}

        {failedDownloads.length > 0 && (
          <section>
            <h2 className="apple-title-3 mb-4 text-text">
              Failed / Cancelled ({failedDownloads.length})
            </h2>
            <div className="space-y-2">
              {failedDownloads.map((item) => (
                <DownloadItem key={item.key} item={item} imageURL={imageURL} onPlay={setPlayingItem} />
              ))}
            </div>
          </section>
        )}
      </div>

      {playingItem && (
        <OfflinePlayer
          blobKey={playingItem.key}
          mimeType={playingItem.mimeType}
          title={
            playingItem.subtitle
              ? `${playingItem.title} — ${playingItem.subtitle}`
              : playingItem.title
          }
          onClose={() => setPlayingItem(null)}
        />
      )}
    </div>
  );
};

export default DownloadsPage;

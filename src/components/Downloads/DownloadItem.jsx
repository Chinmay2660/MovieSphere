import { useDispatch } from "react-redux";
import {
  IoPlay,
  IoCloseCircleOutline,
  IoTrashOutline,
  IoRefreshOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import ProgressBar from "../Reusables/ProgressBar";
import LazyImage from "../Reusables/LazyImage";
import { formatBytes, startDownload, cancelDownload, removeDownloadData } from "../../lib/downloadService";
import { removeDownload } from "../../reduxStore/Reducer/downloadsSlice";
import { toUserMessage } from "../../lib/userFriendlyError";

const statusLabel = {
  queued: "Queued",
  downloading: "Downloading",
  completed: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
};

const sourceLabel = {
  vidsrc_cc: "VidSrc",
  vidsrc_to: "VidSrc",
  "2embed": "2embed",
};

const chipTone = (status, isActive) => {
  if (status === "completed") return "bg-tertiary/20 text-tertiary";
  if (status === "failed") return "bg-red-500/20 text-red-400";
  if (isActive) return "bg-accent/20 text-accent";
  return "";
};

const DownloadItem = ({ item, imageURL, onPlay }) => {
  const dispatch = useDispatch();
  const isActive = item.status === "downloading" || item.status === "queued";
  const isPreparing = isActive && item.bytesDownloaded === 0;
  const chipText = isPreparing ? "Preparing" : (statusLabel[item.status] ?? item.status);

  const handleCancel = () => cancelDownload(item.key, dispatch);
  const handleRemove = () => removeDownloadData(item.key, dispatch, removeDownload);

  const handleRetry = () => {
    const payload =
      item.type === "movie"
        ? {
            type: "movie",
            id: item.id,
            title: item.title,
            poster_path: item.poster_path,
            media_type: "movie",
          }
        : {
            type: "episode",
            tv_id: item.tv_id,
            season_number: item.season_number,
            episode_number: item.episode_number,
            show_name: item.title,
            episode_name: item.subtitle,
            still_path: item.poster_path,
            media_type: "tv",
          };
    startDownload(payload, dispatch);
  };

  return (
    <div className="apple-content-box flex gap-4">
      <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl bg-surface sm:h-28 sm:w-20">
        {item.poster_path && imageURL ? (
          <LazyImage
            src={imageURL + item.poster_path}
            alt={item.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <IoDownloadOutline className="h-6 w-6 text-muted" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
          <div className="min-w-0">
            <h3 className="apple-headline break-words">{item.title}</h3>
            {item.subtitle && (
              <p className="apple-footnote mt-0.5 break-words">{item.subtitle}</p>
            )}
            {item.type === "episode" && (
              <p className="apple-caption-1 mt-0.5">
                S{item.season_number} E{item.episode_number}
              </p>
            )}
          </div>
          <span
            className={`apple-chip w-fit shrink-0 whitespace-nowrap self-start ${chipTone(item.status, isActive)}`}
          >
            {chipText}
          </span>
        </div>
        {item.source && sourceLabel[item.source] && (
          <p className="apple-caption-1 mt-1">via {sourceLabel[item.source]}</p>
        )}

        {isActive && (
          <div className="mt-2 space-y-1">
            <ProgressBar value={item.progress} indeterminate={isPreparing} />
            {isPreparing ? (
              <p className="apple-caption-1 text-muted">Starting download…</p>
            ) : (
              <div className="flex justify-between apple-caption-1">
                <span>{item.progress}%</span>
                <span>
                  {formatBytes(item.bytesDownloaded)}
                  {item.totalBytes > 0 ? ` / ${formatBytes(item.totalBytes)}` : ""}
                </span>
              </div>
            )}
          </div>
        )}

        {item.status === "failed" && item.error && (
          <p className="apple-caption-1 mt-2 text-red-400/80">
            {toUserMessage(item.error, "download-display")}
          </p>
        )}

        <div className={`${isActive ? "mt-2" : "mt-3"} flex flex-wrap gap-2`}>
          {item.status === "completed" && (
            <button onClick={() => onPlay(item)} className="btn-primary btn-compact gap-1.5 !min-h-8 px-3">
              <IoPlay className="h-3.5 w-3.5" />
              Play Offline
            </button>
          )}
          {isActive && (
            <button onClick={handleCancel} className="btn-secondary btn-compact gap-1.5 !min-h-8">
              <IoCloseCircleOutline className="h-3.5 w-3.5" />
              Cancel
            </button>
          )}
          {(item.status === "failed" || item.status === "cancelled") && (
            <button onClick={handleRetry} className="btn-secondary btn-compact gap-1.5 !min-h-8">
              <IoRefreshOutline className="h-3.5 w-3.5" />
              Retry
            </button>
          )}
          {!isActive && (
            <button onClick={handleRemove} className="btn-secondary btn-compact gap-1.5 !min-h-8">
              <IoTrashOutline className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadItem;

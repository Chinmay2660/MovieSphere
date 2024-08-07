const VideoPlay = ({playVideoId}) => {
  return (
    <section className="fixed bg-neutral-700 top-0 right-0 bottom-0 left-0 z-40 bg-opacity-50 flex items-center justify-center">
    <div className="w-full h-[80vh] max-w-screen-lg bg-neutral-900 aspect-video rounded-lg overflow-hidden shadow-xl">
      <div className="flex flex-col items-center justify-center gap-5 p-5">
        <h2 className="text-2xl font-bold text-white">Video Play</h2>
        <p className="text-neutral-400 text-sm">Coming Soon</p>
      </div>
    </div>
    </section>
  )
}

export default VideoPlay
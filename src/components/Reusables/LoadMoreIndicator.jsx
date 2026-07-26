import Loader from "./Loader";

const LoadMoreIndicator = ({ isLoading, label = "Loading more..." }) => {
  if (!isLoading) return null;

  return <Loader label={label} className="py-8" />;
};

export default LoadMoreIndicator;

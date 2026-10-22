/**
 * Shared responsive grid for movie/TV poster cards.
 */
const MovieGrid = ({ children, className = '' }) => (
  <div className={`movie-grid ${className}`.trim()}>{children}</div>
);

export default MovieGrid;

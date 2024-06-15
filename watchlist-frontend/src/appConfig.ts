export const appConfig = {
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  localStorageKey: 'watchlist-auth',
  tmdbBaseUrl: `https://www.themoviedb.org/`,
  googleBaseUrl: `https://www.google.com/search?q=`,
  imdbBaseUrl: `https://www.imdb.com/`,
  imageBaseUrl: `https://image.tmdb.org/t/p/`,
  listTitleImageSize: 'w185',
  profileImageSize: 'w185',
  tmdbRedirectUrl: 'https://www.themoviedb.org/auth/access?request_token=',
  listEpisodeImageSize: 'w300',
  detailsTitleImageSize: 'w342',
};

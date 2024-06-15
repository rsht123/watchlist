import { useEffect } from 'react';
import keys from 'lodash/keys';
import { ImdbRatingObj, setLocalImdbRatings } from '../redux/slices/stateSlice';
import { useFetchImdbRatingMutation } from '../redux/apiSlices/titleSlice';
import { useAppDispatch, useAppSelector } from '../redux/store';

export const useImdbRating = (imdb_ids: string[]): ImdbRatingObj | null => {
  const imdb_ratings = useAppSelector(
    (state) => state.state.imdb_ratings.imdb_ids
  );

  const dispatch = useAppDispatch();

  const [fetchRating, { isLoading }] = useFetchImdbRatingMutation();

  const fetchRatings = async () => {
    const data = await fetchRating(imdb_ids).unwrap();
    dispatch(setLocalImdbRatings(data));
  };

  useEffect(() => {
    if (isLoading) return;
    const stateIds = keys(imdb_ratings);
    let shouldLoad = false;
    if (stateIds.length === 0) {
      fetchRatings();
      return;
    }

    imdb_ids.forEach((id) => {
      if (stateIds.indexOf(id) === -1) {
        shouldLoad = true;
      }
    });

    if (shouldLoad) {
      fetchRatings();
      return;
    }
  }, [imdb_ids, imdb_ratings, isLoading]);

  return null;
};

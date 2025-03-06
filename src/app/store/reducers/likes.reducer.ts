import { createReducer, on } from '@ngrx/store';
import { likePlace, unlikePlace } from '../actions/likes.actions';

export interface LikesState {
  likedPlaces: number[]; // Store liked place IDs
}

const initialState: LikesState = {
  likedPlaces: [],
};

export const likesReducer = createReducer(
  initialState,
  on(likePlace, (state, { placeId }) => ({
    likedPlaces: [...state.likedPlaces, placeId],
  })),
  on(unlikePlace, (state, { placeId }) => ({
    likedPlaces: state.likedPlaces.filter(id => id !== placeId),
  }))
);

import { createAction, props } from '@ngrx/store';

export const likePlace = createAction('[Like] Like Place', props<{ placeId: number }>());
export const unlikePlace = createAction('[Like] Unlike Place', props<{ placeId: number }>());

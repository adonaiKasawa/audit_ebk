import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface TestimonialsState {
  testimonials: any[];
}

const initialState: TestimonialsState = {
  testimonials: [],
};

const homeTestimonialsListSlice = createSlice({
  name: 'hometestimonialslist',
  initialState,
  reducers: {
    setTestimonialsList: (state, action: PayloadAction<any[]>) => {
      state.testimonials = action.payload;
    },
    appendTestimonialsList: (state, action: PayloadAction<any[]>) => {
      state.testimonials = [...state.testimonials, ...action.payload];
    },
  },
});

export const {setTestimonialsList, appendTestimonialsList} =
  homeTestimonialsListSlice.actions;
export default homeTestimonialsListSlice.reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Testimonial {
  id: number;
  link: string;
  cachedUri?: string;
}

interface TestimonialsState {
  testimonials: Testimonial[];
}

const initialState: TestimonialsState = {
  testimonials: [],
};

const homeTestimonialsSlice = createSlice({
  name: 'hometestimonials',
  initialState,
  reducers: {
    setTestimonials: (state, action: PayloadAction<Testimonial[]>) => {
      state.testimonials = action.payload;
    },
    appendTestimonials: (state, action: PayloadAction<Testimonial[]>) => {
      state.testimonials = [...state.testimonials, ...action.payload];
    },
  },
});

export const {setTestimonials, appendTestimonials} =
  homeTestimonialsSlice.actions;
export default homeTestimonialsSlice.reducer;

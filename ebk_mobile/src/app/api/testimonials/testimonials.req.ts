import {HttpRequest} from '..';

export const sendTestimonialsApi = async (dto: FormData) =>
  await HttpRequest(`testimonials`, 'POST', dto, 'multipart/form-data');
export const findTestimonialsApi = async () =>
  await HttpRequest(`testimonials/`, 'GET');
export const findTestimonialsPaginatedApi = async (page: number) =>
  await HttpRequest(
    `testimonials/find/paginated/?page=${page}&limit=1000`,
    'GET',
  );

export const findTestimonialsByUserIdApi = async (id: number) =>
  await HttpRequest(`testimonials/findByUserId/${id}`, 'GET');
export const findTestimonialsByEgliseIdApi = async (id_eglise: number) =>
  await HttpRequest(`testimonials/findByEgliseId/${id_eglise}`, 'GET');
export const deleteTestimonialsByUserApi = async (id_testimonial: number) =>
  await HttpRequest(`testimonials/deleteByUser/${id_testimonial}`, 'DELETE');

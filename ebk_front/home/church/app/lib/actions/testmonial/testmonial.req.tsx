"use server";

import { TestimonialStatusEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

// Création d’un témoignage
export const createTestmonial = async (
  data: { description: string; status: TestimonialStatusEnum },
  file: File,
) => {
  const formData = new FormData();
  formData.append("description", data.description);
  formData.append("status", data.status);
  formData.append("file", file);

  return await HttpRequest("testimonials", "POST", formData);
};

export const updateTestmonial = async (
  dto: { description: string },
  id: number,
) => HttpRequest(`testimonials/${id}`, "PATCH", dto);
export const updateStatusTestmonial = async (
  dto: { status: TestimonialStatusEnum },
  id: number,
) => HttpRequest(`testimonials/status/${id}`, "PATCH", dto);
function HttpRequestWithFormData(arg0: string, arg1: string, formData: FormData) {
  throw new Error("Function not implemented.");
}

export const deleteTestmonial = async (id: number) => {
  return await HttpRequest(`testimonials/deleteByUser/${id}`, "DELETE");
};

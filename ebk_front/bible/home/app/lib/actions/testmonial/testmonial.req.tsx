"use server";

import { TestimonialStatusEnum } from "../../config/enum";
import { HttpRequest } from "../../request/request";

export const updateTestmonial = async (
  dto: { description: string },
  id: number,
) => HttpRequest(`testimonials/${id}`, "PATCH", dto);
export const updateStatusTestmonial = async (
  dto: { status: TestimonialStatusEnum },
  id: number,
) => HttpRequest(`testimonials/status/${id}`, "PATCH", dto);

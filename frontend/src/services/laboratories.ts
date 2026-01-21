import { apiClient } from "@/lib/api";
import type { Options } from "ky";
import { z } from "zod";

export const LaboratorySchema = z.object({
  id: z.number(),
  name: z.string(),
  number: z.number(),
  active: z.boolean(),
});

export type Laboratory = z.infer<typeof LaboratorySchema>;

export const CreateLaboratorySchema = LaboratorySchema.omit({ id: true });
export type CreateLaboratoryDto = z.infer<typeof CreateLaboratorySchema>;

export const UpdateLaboratorySchema = CreateLaboratorySchema.partial();
export type UpdateLaboratoryDto = z.infer<typeof UpdateLaboratorySchema>;

export const laboratoriesService = {
  getAll: async (options?: Options) => {
    return apiClient
      .get("laboratories", options)
      .json()
      .then(LaboratorySchema.array().parse);
  },

  getById: async (id: number, options?: Options) => {
    return apiClient
      .get(`laboratories/${id}`, options)
      .json()
      .then(LaboratorySchema.parse);
  },

  create: async (data: CreateLaboratoryDto, options?: Options) => {
    return apiClient
      .post("laboratories", { ...options, json: data })
      .json()
      .then(LaboratorySchema.parse);
  },

  update: async (id: number, data: UpdateLaboratoryDto, options?: Options) => {
    return apiClient
      .patch(`laboratories/${id}`, { ...options, json: data })
      .json()
      .then(LaboratorySchema.parse);
  },

  delete: async (id: number, options?: Options) => {
    return apiClient.delete(`laboratories/${id}`, options).json();
  },
};

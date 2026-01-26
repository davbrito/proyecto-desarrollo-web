import { apiClient } from "@/lib/api";
import { z } from "zod";

export const UserSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().nullable(),
  name: z.string(),
  role: z.enum(["user", "admin"]),
});

export type User = z.infer<typeof UserSchema>;

export const CreateUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  name: z.string().min(1),
  email: z
    .email()
    .or(z.literal(""))
    .transform((v) => (v === "" ? null : v))
    .nullable(),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const usersService = {
  create: async (data: CreateUserDto) => {
    return apiClient
      .post("users", { json: data })
      .json()
      .then(UserSchema.parse);
  },

  getById: async (id: string) => {
    return apiClient.get(`users/${id}`).json().then(UserSchema.parse);
  },

  getByUsername: async (username: string) => {
    return apiClient
      .get(`users/username/${encodeURIComponent(username)}`)
      .json()
      .then(UserSchema.parse);
  },

  getAll: async () => {
    return apiClient.get("users").json().then(UserSchema.array().parse);
  },

  changeRole: async (id: string, role: "user" | "admin") => {
    return apiClient
      .patch(`users/${id}/role`, { json: { role } })
      .json()
      .then(UserSchema.parse);
  },
};

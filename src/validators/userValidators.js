const { z } = require("zod");
const { ROLE_VALUES } = require("../utils/constants");

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid user id");

const createUserSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(80),
    email: z.string().trim().email(),
    password: z.string().min(6).max(128),
    role: z.enum(ROLE_VALUES),
    isActive: z.boolean().optional(),
  }),
  params: z.object({}),
  query: z.object({}),
});

const updateUserSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(2).max(80).optional(),
      password: z.string().min(6).max(128).optional(),
      role: z.enum(ROLE_VALUES).optional(),
      isActive: z.boolean().optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
  params: z.object({ id: mongoId }),
  query: z.object({}),
});

const userIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({ id: mongoId }),
  query: z.object({}),
});

const listUsersQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    role: z.enum(ROLE_VALUES).optional(),
    search: z.string().trim().min(1).optional(),
    isActive: z.enum(["true", "false"]).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});
const bulkUserSchema = z.object({
  body: z.array(
    z.object({
      name: z.string().trim().min(2).max(80),
      email: z.string().trim().email(),
      password: z.string().min(6).max(128),
      role: z.enum(ROLE_VALUES),
      isActive: z.boolean().optional(),
    })
  ),
  params: z.object({}),
  query: z.object({}),
});
module.exports = {
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
  listUsersQuerySchema,
  bulkUserSchema,
};


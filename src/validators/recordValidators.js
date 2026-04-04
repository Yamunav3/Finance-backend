const { z } = require("zod");

const mongoId = z.string().regex(/^[a-fA-F0-9]{24}$/, "Invalid record id");

const baseRecordBody = {
  amount: z.coerce.number().positive(),
  type: z.enum(["income", "expense"]),
  category: z.string().trim().min(1).max(120),
  date: z.coerce.date(),
  notes: z.string().trim().max(600).optional(),
};

const createRecordSchema = z.object({
  body: z.object(baseRecordBody),
  params: z.object({}),
  query: z.object({}),
});

const bulkRecordSchema = z.object({
  body: z.array(z.object(baseRecordBody)).min(1),
  params: z.object({}),
  query: z.object({}),
});

const updateRecordSchema = z.object({
  body: z
    .object({
      amount: z.coerce.number().positive().optional(),
      type: z.enum(["income", "expense"]).optional(),
      category: z.string().trim().min(1).max(120).optional(),
      date: z.coerce.date().optional(),
      notes: z.string().trim().max(600).optional(),
    })
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one field must be provided",
    }),
  params: z.object({ id: mongoId }),
  query: z.object({}),
});

const listRecordsQuerySchema = z.object({
  body: z.object({}),
  params: z.object({}),
  query: z.object({
    type: z.enum(["income", "expense"]).optional(),
    category: z.string().trim().min(1).optional(),
    search: z.string().trim().min(1).optional(),
    fromDate: z.coerce.date().optional(),
    toDate: z.coerce.date().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
    sortBy: z.enum(["date", "amount", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
  }),
});

const recordIdParamSchema = z.object({
  body: z.object({}),
  params: z.object({ id: mongoId }),
  query: z.object({}),
});

module.exports = {
  createRecordSchema,
  bulkRecordSchema,
  updateRecordSchema,
  listRecordsQuerySchema,
  recordIdParamSchema,
};

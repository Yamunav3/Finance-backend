const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const sanitizeUser = (userDoc) => ({
  id: userDoc._id,
  name: userDoc.name,
  email: userDoc.email,
  role: userDoc.role,
  isActive: userDoc.isActive,
  createdAt: userDoc.createdAt,
  updatedAt: userDoc.updatedAt,
});

const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive = true } = req.body;
  const existing = await User.findOne({ email });

  if (existing) {
    throw new ApiError(409, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    isActive,
  });

  res.status(201).json({
    message: "User created successfully",
    user: sanitizeUser(user),
  });
});

const listUsers = asyncHandler(async (req, res) => {
  const { role, isActive, search, page = 1, limit = 10 } = req.query;

  const filter = {};

  // SEARCH LOGIC
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { role: { $regex: search, $options: "i" } }
    ];
  }

  //  EXISTING FILTERS
  if (role) {
    filter.role = role;
  }

  if (typeof isActive === "string") {
    filter.isActive = isActive === "true";
  }

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-password"),

    User.countDocuments(filter),
  ]);

  res.json({
    data: users,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({ user });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, 10);
  }

  Object.assign(user, updates);
  await user.save();

  res.json({
    message: "User updated successfully",
    user: sanitizeUser(user),
  });
});
const bulkCreateUsers = asyncHandler(async (req, res) => {
  const users = req.body;

  const normalizedEmails = users.map((user) => user.email.trim().toLowerCase());
  const emailCounts = normalizedEmails.reduce((counts, email) => {
    counts[email] = (counts[email] || 0) + 1;
    return counts;
  }, {});

  const duplicateEmailsInPayload = Object.keys(emailCounts).filter(
    (email) => emailCounts[email] > 1
  );

  if (duplicateEmailsInPayload.length > 0) {
    throw new ApiError(409, "Duplicate emails found in request", {
      duplicateEmailsInPayload,
    });
  }

  const existingUsers = await User.find(
    { email: { $in: normalizedEmails } },
    { email: 1, _id: 0 }
  ).lean();

  if (existingUsers.length > 0) {
    throw new ApiError(409, "Some users already exist", {
      existingEmails: existingUsers.map((user) => user.email),
    });
  }

  const usersWithHashedPasswords = await Promise.all(
    users.map(async (user) => ({
      ...user,
      email: user.email.trim().toLowerCase(),
      password: await bcrypt.hash(user.password, 10),
    }))
  );

  const createdUsers = await User.insertMany(usersWithHashedPasswords);

  res.status(201).json({
    message: "Users created successfully",
    users: createdUsers.map((user) => sanitizeUser(user)),
  });
});

module.exports = {
  createUser,
  bulkCreateUsers,
  listUsers,
  getUserById,
  updateUser,
};

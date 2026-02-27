const validator = require("validator");
const bcrypt = require("bcrypt");
const createError = require("../helpers/createError");

const verifySignInput = (req) => {
  const { firstName, lastName, password, email } = req.body;

  if (!firstName) {
    throw createError(401, "First name is required");
  } else if (!lastName) {
    throw createError(401, "Last name is required");
  } else if (firstName.length < 3 || firstName.length > 30) {
    throw createError(401, "First name must be 3-30 characters");
  } else if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
    throw createError(
      401,
      "first name and last name must be contains only alphabets",
    );
  } else if (!validator.isStrongPassword(password)) {
    throw createError(401, "Make a strong password");
  } else if (!validator.isEmail(email)) {
    throw createError(401, "Invalid email address");
  }
};

const verifyProfileInput = (req) => {
  const approvedFields = [
    "firstName",
    "lastName",
    "age",
    "profilePicture",
    "bio",
    "skills",
    "gender",
  ];

  const isEditable = Object.keys(req.body).every((field) =>
    approvedFields.includes(field),
  );

  if (!isEditable) {
    throw createError(400, "Edit request not permitted");
  }
};

const verifyOldPassword = async (oldPassword, currentPassword) => {
  if (!oldPassword) {
    throw createError(400, "Old password is required");
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, currentPassword);

  if (!isPasswordMatch) {
    throw createError(401, "Old password doesnt match");
  }
};

module.exports = { verifySignInput, verifyProfileInput, verifyOldPassword };

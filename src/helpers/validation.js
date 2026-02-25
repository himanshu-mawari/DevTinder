const validator = require("validator");
const bcrypt = require("bcrypt");

const verifySignInput = (req) => {
  const { firstName, lastName, password, email } = req.body;

  if (!firstName) {
    throw new Error("First name is required");
  } else if (!lastName) {
    throw new Error("Last name is required");
  } else if (firstName.length < 3 || firstName.length > 30) {
    throw new Error("First name must be 3-30 characters");
  } else if (!validator.isAlpha(firstName) && !validator.isAlpha(lastName)) {
    throw new Error("first name and last name must be contains only alphabets");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Make a strong password");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
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
    throw new Error("Edit request not permitted");
  }
};

const verifyOldPassword = async (oldPassword, currentPassword) => {
  if (!oldPassword) {
    throw new Error("Old password is required");
  }

  const isPasswordMatch = await bcrypt.compare(oldPassword, currentPassword);

  if (!isPasswordMatch) {
    throw new Error("Old password doesnt match");
  }
};

module.exports = { verifySignInput, verifyProfileInput, verifyOldPassword };

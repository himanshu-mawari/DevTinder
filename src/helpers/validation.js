const validator = require("validator");

const validateSignUpInput = (req) => {
    const { firstName, password, email } = req.body;

    if (!firstName) {
        throw new Error("First name is required");
    } else if (firstName.length < 4 && firstName.length > 30) {
        throw new Error("First name must be 4-30 characters");
    } else if (!validator.isAlpha(firstName) && !validator.isAlpha(lastName)) {
        throw new Error("first name and last name must be contains only alphabets")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Make a strong password");
    } else if (!validator.isEmail(email)) {
        throw new Error("Invalid email address");
    }
};


module.exports = validateSignUpInput ;
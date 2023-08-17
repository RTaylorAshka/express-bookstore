const jsonschema = require("jsonschema");
const bookSchema = require("../schema/bookSchema.json");
const ExpressError = require("../expressError");

function validateBookSchema(req, res, next) {
    const result = jsonschema.validate(req.body, bookSchema);

    if (!result.valid) {
        let errorMessages = result.errors.map(e => e.stack);
        return next(new ExpressError(errorMessages, 400));
    } else {
        return next();
    }
}


module.exports = { validateBookSchema };
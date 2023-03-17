"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// validate middleware will validate the request against the schema provided.
// E.g. making sure required fields are present when creating a new user and making sure they are of correct types.
const validate = (schema) => (req, res, next) => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (e) {
        return res.status(400).send(e.errors);
    }
};
exports.default = validate;

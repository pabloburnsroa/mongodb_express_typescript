"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requireUser = (req, res, next) => {
    const user = res.locals.user;
    if (!user)
        return res.sendStatus(403);
    // if next() is called here, user is on the response object
    return next();
};
exports.default = requireUser;

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeUser = void 0;
const lodash_1 = require("lodash");
const jwt_utils_1 = require("../utils/jwt.utils");
const session_service_1 = require("../service/session.service");
const deserializeUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = (0, lodash_1.get)(req, 'cookies.accessToken') ||
        (0, lodash_1.get)(req, 'headers.authorization', '').replace(/Bearer\s/, '');
    const refreshToken = (0, lodash_1.get)(req, 'cookies.refreshToken') ||
        (0, lodash_1.get)(req, 'headers.x-refresh');
    if (!accessToken)
        return next();
    const { decoded, expired } = (0, jwt_utils_1.verifyJWT)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
        return next();
    }
    if (expired && refreshToken) {
        const newAccessToken = yield (0, session_service_1.reIssueAccessToken)({ refreshToken });
        if (newAccessToken) {
            res.setHeader('x-access-token', newAccessToken);
            res.cookie('accessToken', newAccessToken, {
                maxAge: 900000,
                httpOnly: true,
                // dev env only - change to
                domain: 'localhost',
                path: '/',
                sameSite: 'strict',
                // In production, set to true so can only be used over https
                secure: false,
            });
        }
        const result = (0, jwt_utils_1.verifyJWT)(newAccessToken);
        res.locals.user = result.decoded;
        return next();
    }
    return next();
});
exports.deserializeUser = deserializeUser;

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
exports.deleteSessionHandler = exports.getUserSessionsHandler = exports.createUserSessionHandler = void 0;
const user_service_1 = require("../service/user.service");
const session_service_1 = require("../service/session.service");
const jwt_utils_1 = require("../utils/jwt.utils");
function createUserSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // validate user w/ password
        const user = yield (0, user_service_1.validatePassword)(req.body);
        if (!user)
            return res.status(401).send('Invalid email or password');
        // if user valid, create session
        const session = yield (0, session_service_1.createSession)(user._id, req.get('user-agent') || '');
        // create access token
        const accessToken = (0, jwt_utils_1.signJWT)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: process.env.ACCESS_TOKEN_TTL });
        // create refresh token
        const refreshToken = (0, jwt_utils_1.signJWT)(Object.assign(Object.assign({}, user), { session: session._id }), { expiresIn: process.env.REFRESH_TOKEN_TTL });
        // Set cookies
        res.cookie('accessToken', accessToken, {
            maxAge: 900000,
            httpOnly: true,
            // dev env only - change to
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            // In production, set to true so can only be used over https
            secure: false,
        });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 3.154e10,
            httpOnly: true,
            // dev env only - change to
            domain: 'localhost',
            path: '/',
            sameSite: 'strict',
            // In production, set to true so can only be used over https
            secure: false,
        });
        return res.send({ accessToken, refreshToken });
    });
}
exports.createUserSessionHandler = createUserSessionHandler;
function getUserSessionsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = res.locals.user._id;
        const sessions = yield (0, session_service_1.findSessions)({ user: userId, valid: true });
        return res.send(sessions);
    });
}
exports.getUserSessionsHandler = getUserSessionsHandler;
function deleteSessionHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionId = res.locals.user.session;
        yield (0, session_service_1.updateSession)({ _id: sessionId }, { valid: false });
        return res.send({
            accessToken: null,
            refreshToken: null,
        });
    });
}
exports.deleteSessionHandler = deleteSessionHandler;

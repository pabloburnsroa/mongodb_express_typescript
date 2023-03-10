"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
const validateResource_1 = __importDefault(require("../middleware/validateResource"));
const user_schema_1 = require("../schema/user.schema");
const session_controller_1 = require("../controllers/session.controller");
const session_schema_1 = require("../schema/session.schema");
const requireUser_1 = __importDefault(require("../middleware/requireUser"));
function routes(app) {
    // CHECK STATUS
    app.get('/checkstatus', (req, res) => res.sendStatus(200));
    // CREATE USER
    app.post('/api/users', (0, validateResource_1.default)(user_schema_1.createUserSchema), user_controller_1.createUserHandler);
    // CREATE SESSION
    app.post('/api/sessions', (0, validateResource_1.default)(session_schema_1.createSessionSchema), session_controller_1.createUserSessionHandler);
    // GET SESSIONS
    app.get('/api/sessions', requireUser_1.default, session_controller_1.getUserSessionsHandler);
    // DELETE SESSION
    app.delete('/api/sessions', requireUser_1.default, session_controller_1.deleteSessionHandler);
    // GET USER
    app.get('/api/me', requireUser_1.default, user_controller_1.getCurrentUser);
    // GOOGLE AUTH
    app.get('/api/sessions/oauth/google', session_controller_1.googleOauthHandler);
}
exports.default = routes;

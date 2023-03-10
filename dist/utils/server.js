"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const deserializeUser_1 = require("../middleware/deserializeUser");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const allowedOrigins = process.env.ORIGIN;
const options = {
    origin: allowedOrigins,
    credentials: true,
};
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)(options));
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json());
    app.use(deserializeUser_1.deserializeUser);
    app.use((0, morgan_1.default)('combined'));
    return app;
}
exports.default = createServer;

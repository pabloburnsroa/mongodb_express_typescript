"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const logger_1 = __importDefault(require("./logger"));
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'REST API',
        version: '1.0.0',
    },
    components: {
        securitySchemas: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
};
const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.ts', './src/schema/*.ts'],
};
const openapiSpecification = (0, swagger_jsdoc_1.default)(options);
function swaggerDocs(app, port) {
    // Swagger page
    app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpecification));
    // Docs in JSON format
    app.get('docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(openapiSpecification);
    });
    logger_1.default.info(`Docs available at http://localhost:${port}/docs`);
}
exports.default = swaggerDocs;

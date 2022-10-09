"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const services_1 = require("./services");
const app = express_1.default();
// Middlewares
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.set("view engine", "ejs");
app.use(express_1.default.static("./public"));
app.use(cors_1.default({
    origin: ["http://localhost:3000"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
}));
// Mount REST on /api
app.use("/api", services_1.services);
const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Express app listening on localhost:${port}`));

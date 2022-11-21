"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDevServe = void 0;
const plugin_react_1 = require("@vitejs/plugin-react");
const vite_1 = require("vite");
const indexHtml_1 = require("./plugin-island/indexHtml");
async function createDevServe(root) {
    return (0, vite_1.createServer)({
        root,
        plugins: [(0, indexHtml_1.pluginIndexHtml)(), (0, plugin_react_1.default)()]
    });
}
exports.createDevServe = createDevServe;

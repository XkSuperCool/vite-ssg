"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cac_1 = require("cac");
const path = require("path");
const build_1 = require("./build");
const dev_1 = require("./dev");
const version = require('../../package.json').version;
const cli = (0, cac_1.cac)('island').version(version).help();
cli
    .command('[root]', 'start dev server')
    .alias('dev')
    .action(async (root) => {
    root = root ? path.resolve(root) : process.cwd();
    const server = await (0, dev_1.createDevServe)(root);
    await server.listen(3000);
    server.printUrls();
});
cli
    .command('build [root]', 'build for production')
    .action(async (root) => {
    try {
        root = path.resolve(root);
        await (0, build_1.build)(root);
    }
    catch (e) {
        console.log(e);
    }
});
cli.parse();

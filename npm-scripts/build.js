"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const imagemin_1 = __importDefault(require("imagemin"));
const imagemin_jpegtran_1 = __importDefault(require("imagemin-jpegtran"));
const imagemin_pngquant_1 = __importDefault(require("imagemin-pngquant"));
const terser_1 = __importDefault(require("terser"));
const node_sass_1 = __importDefault(require("node-sass"));
const postcss_1 = __importDefault(require("postcss"));
const autoprefixer_1 = __importDefault(require("autoprefixer"));
const cssnano_1 = __importDefault(require("cssnano"));
const ejs_1 = __importDefault(require("ejs"));
const dev = './dev';
const dist = './public';
console.log(`Checking Dist Directory...`);
fs_1.default.mkdir(dist, (err) => {
    if (err && err.errno !== -17)
        console.error(err);
    compileCSS();
    compileJS();
    compileHTML();
    optimzeIMG();
});
const compileCSS = () => {
    console.log(`Compiling Stylesheets...`);
    node_sass_1.default.render({
        file: `${dev}/styles/styles.scss`,
    }, (err, result) => {
        if (err)
            console.error(err);
        const css = result.css.toString('utf8');
        postcss_1.default([autoprefixer_1.default, cssnano_1.default])
            .process(css, { from: undefined })
            .then(result => {
            writeFile(`/styles/styles.min.css`, result.toString());
        });
    });
};
const compileJS = () => {
    console.log(`Compiling JavaScript...`);
    fs_1.default.readFile(`${dev}/scripts/main.js`, (err, data) => {
        if (err)
            throw err;
        const result = terser_1.default.minify(data.toString('utf8'));
        if (result.error)
            throw result.error;
        if (result.code !== undefined) {
            writeFile(`/scripts/main.min.js`, result.code);
        }
    });
};
const compileHTML = () => {
    console.log(`Compiling HTML Views...`);
    ejs_1.default.renderFile(`./views/index.ejs`, (err, str) => {
        if (err)
            console.error(err);
        writeFile(`/index.html`, str);
    });
};
const writeFile = (location, data) => {
    fs_1.default.writeFile(`${dist}${location}`, data, (err) => {
        if (err) {
            if (err.errno === -2) {
                fs_1.default.mkdir(`${dist}${path_1.default.dirname(location)}`, (err) => {
                    if (err)
                        console.error(err);
                    writeFile(location, data);
                });
            }
            else if (err.errno === 1) {
                fs_1.default.unlink(`${dist}${path_1.default.dirname(location)}`, (err) => {
                    if (err)
                        console.error(err);
                    writeFile(location, data);
                    ``;
                });
            }
            else {
                console.error(err);
            }
        }
    });
};
const optimzeIMG = () => {
    console.log(`Optimizing Images...`);
    const minifyImage = (file) => {
        const imageDir = file;
        imagemin_1.default([`${dev}${imageDir}*.{jpg,png}`], {
            destination: `${dist}${imageDir}`,
            plugins: [
                imagemin_jpegtran_1.default(),
                imagemin_pngquant_1.default({
                    quality: [0.6, 0.8]
                })
            ]
        });
        fs_1.default.readdir(dev + imageDir, (err, files) => {
            if (err)
                console.error(err);
            checkDir(files, imageDir);
        });
    };
    const checkDir = (files, parent) => {
        files.map((file) => {
            fs_1.default.stat(`${dev}${parent}${file}`, (err, stat) => {
                if (err)
                    console.error(err);
                if (stat.isDirectory()) {
                    minifyImage(`${parent}${file}/`);
                }
            });
        });
    };
    minifyImage('/images/');
};

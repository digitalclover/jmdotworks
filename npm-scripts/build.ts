import fs, { Stats } from 'fs';
import path from 'path';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import Terser from 'terser';
import sass from 'node-sass';
import postcss from 'postcss';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import ejs from 'ejs';

const dev = './dev';
const dist = './public';

// Make public directory
console.log(`Checking Dist Directory...`)
fs.mkdir(dist, (err)=>{
    if(err && err.errno !== -17) console.error(err);
    compileCSS();
    compileJS();
    compileHTML();
    optimzeIMG();
});

// Compile and minify stylesheets
const compileCSS = ()=>{
    console.log(`Compiling Stylesheets...`)
    sass.render({
    file: `${dev}/styles/styles.scss`,
    }, (err, result) => {
        if(err) console.error(err);
        const css = result.css.toString('utf8');
        postcss([autoprefixer, cssnano])
        .process(css, {from:undefined})
        .then(result => {
            writeFile(`/styles/styles.min.css`, result.toString());
        });
    });
}



const compileJS = ()=>{
    // Compile and minify window script files
    console.log(`Compiling JavaScript...`)
    fs.readFile(`${dev}/scripts/main.js`,(err,data)=>{
        if(err) throw err;
        const result = Terser.minify(data.toString('utf8'));
        if(result.error) throw result.error;
        if(result.code !== undefined){
            writeFile(`/scripts/main.min.js`, result.code);
        }
    });
}

const compileHTML = ()=>{
    console.log(`Compiling HTML Views...`)
    ejs.renderFile(`./views/index.ejs`, (err, str)=>{
        if(err) console.error(err);
        writeFile(`/index.html`, str);
    });
}

const writeFile = (location:string, data:string)=>{
    fs.writeFile(`${dist}${location}`, data, (err)=>{
        if(err){
            if(err.errno === -2){
                fs.mkdir(`${dist}${path.dirname(location)}`, (err)=>{
                    if(err) console.error(err);
                    writeFile(location, data);
                });
            }else if(err.errno === 1){
                fs.unlink(`${dist}${path.dirname(location)}`, (err)=>{
                    if(err) console.error(err);
                    writeFile(location, data);``
                });
            }else{
                console.error(err);
            }
        }
    });
}

const optimzeIMG = ()=>{
    // Optimize images
    console.log(`Optimizing Images...`)
    const minifyImage = (file:string)=>{
        const imageDir = file;
        imagemin([`${dev}${imageDir}*.{jpg,png}`], {
            destination: `${dist}${imageDir}`,
            plugins: [
                imageminJpegtran(),
                imageminPngquant({
                    quality: [0.6, 0.8]
                })
            ]
        });
        fs.readdir(dev+imageDir, (err, files)=>{
            if(err) console.error(err);
            checkDir(files, imageDir);
        });
    }

    const checkDir = (files:string[], parent:string) => {
        files.map((file)=>{
            fs.stat(`${dev}${parent}${file}`, (err,stat)=>{
                if(err) console.error(err);
                if(stat.isDirectory()){
                    minifyImage(`${parent}${file}/`);
                }
            });
        });
    }
    minifyImage('/images/');
}
const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const Terser = require('terser');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const dev = './dev/';
const dist = './public/';

const minify = async (directory) => {
    dir = normalizeDir(directory);
    await imagemin([`${dev}${dir}/*.{jpg,png}`], {
        destination: dist+dir,
        plugins: [
            imageminJpegtran(),
            imageminPngquant({
                quality: [0.6, 0.8]
            })
        ]
    });
    fs.readdir(dev+dir, (err, files)=>{
        if(err) throw err;
        checkDir(files, dir);
    });
}

const checkDir = (files, parent) => {
    files.forEach((entry)=>{
        fs.stat(dev+parent+entry, (err,stats)=>{
            if(err) throw err;
            if(stats.isDirectory()){
                minify(parent+entry);
            };
        });
    });
}

const normalizeDir = (dir)=>{
    const length = dir.length;
    if(dir.substr(length-1,length) === '/'){
        return dir;
    }else{
        return dir+'/';
    }
}

try{
    fs.mkdir('./public/', result.code, (err)=>{
        if(err) throw err;
    });
}catch(e){
    if(e.errno === 1){
        return true;
    }
}

try{
    fs.readFile('./dev/scripts/main.js',(err,data)=>{
        if(err) throw err;
        const result = Terser.minify(data.toString('utf8'));
        if(result.error) throw result.error;
        try{
            fs.writeFile('./public/scripts/main.min.js', result.code, (err)=>{
                if(err) throw err;
            });
        }catch(e){
            if(e.errno === -2){
                fs.mkdir('./public/scripts/',(err)=>{
                    if(err) throw err;
                });
            }else if(e.errno === 1){
                fs.unlink('./public/scripts/',(err)=>{
                    if(err) throw err;
                });
            }
        }finally{
            fs.writeFile('./public/scripts/main.min.js', result.code, (err)=>{
                if(err && err.errno === -2){
                    fs.mkdir('./public/scripts/',(err)=>{
                        if(err) throw err;
                    });
                }else if(err) throw err;
            });
        }
    })
}catch(e){
    console.error(`Error: ${e.name}
    ${e.message}`);
    return false;
}

try{
    sass.render({
    file: './dev/styles/styles.scss',
    }, (err, result) => {
        if(err) throw err;
        const css = result.css.toString('utf8');
        postcss([autoprefixer, cssnano])
        .process(css, {from:undefined})
        .then(result => {
            try{
                fs.writeFile('./public/styles/styles.min.css', result, (err)=>{
                    if(err) throw err;
                });
            }catch(e){
                if(e.errno === -2){
                    fs.mkdir('./public/styles/',(err)=>{
                        if(err) throw err;
                    });
                }else if(e.errno === 1){
                    fs.unlink('./public/styles/',(err)=>{
                        if(err) throw err;
                    });
                }
            }finally{
                fs.writeFile('./public/styles/styles.min.css', result, (err)=>{
                    if(err && err.errno === -2){
                        fs.mkdir('./public/styles/',(err)=>{
                            if(err) throw err;
                        });
                    }else if(err) throw err;
                });
            }
        });
    });
}catch(e){
    console.error(`Error: ${e.name}
    ${e.message}`);
    return false;
}
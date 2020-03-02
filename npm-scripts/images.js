const fs = require('fs');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

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
    minify('images/');
}catch(e){
    console.error(`Error: ${e.name}
    ${e.message}`);
    return false;
}
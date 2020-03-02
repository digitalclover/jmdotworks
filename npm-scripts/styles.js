const fs = require('fs');
const sass = require('node-sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

try{
    sass.render({
    file: './dev/styles/styles.scss',
    }, (err, result) => {
        if(err) throw err;
        const css = result.css.toString('utf8');
        postcss([autoprefixer, cssnano])
        .process(css, {from:undefined})
        .then(result => {
                writeFile(result);
        });
    });
}catch(e){
    console.error(`Error: ${e.name}
    ${e.message}`);
    return false;
}

const writeFile = (result) =>{
    fs.writeFile('./public/styles/styles.min.css', result, (e)=>{
        if(e && e.errno === -2){
            createDir();
            writeFile(result);
        }else if(e && e.errno === -17){
            emptyDir();
            writeFile(result);
        }
    });
}

const createDir = ()=>{
    fs.mkdir('./public/styles/',(e)=>{
        if(e){
            console.error(e);
        } 
    });
}

const emptyDir = ()=>{
    fs.unlink('./public/styles/styles.min.css',(e)=>{
        if(e){
            console.error(e);
        }    
    });
}
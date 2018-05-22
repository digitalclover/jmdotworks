import * as ejs from 'ejs';
import * as fs from 'fs';

const sass = require('sass');

const dist = './public';

let data:ejs.Data,
    options:ejs.Options;

const init = () => {
    if(fs.existsSync(dist)){
        remove(dist);
    }
    fs.mkdirSync(dist);
    fs.mkdirSync(dist+'/styles');
    fs.mkdirSync(dist+'/scripts');
    parseHTML();
}

const remove = (path:string) => {
    fs.readdirSync(path).forEach(function(file,index){
        var next = path + "/" + file;
        if(fs.lstatSync(next).isDirectory()) { 
            remove(next);
        } else {
            fs.unlinkSync(next);
        }
    });
    fs.rmdirSync(path);
}

const parseHTML = () => {
    ejs.renderFile('./views/index.ejs', data, options, (err,res) => {
        if (err) throw err;
        fs.writeFile('./index.html', res, (err) => {
            if(err) throw err;
            console.log('index.html created');
        });
    });
    parseSCSS();
}

const parseSCSS = () => {
    sass.render({file: './dev/styles/styles.scss'}, (err:Error, res:string) => {
        fs.writeFile('./'+dist+'/styles/styles.css', res, (err)=>{
            if(err) throw err;
            console.log('styles.css created');
        })
    });
}

init();
const fs = require('fs');
const Terser = require('terser');

fs.readFile('./dev/scripts/main.js',(err,data)=>{
    if(err) console.error(err);
    const result = Terser.minify(data.toString('utf8'));
    if(result.error) console.error(result.error);
    writeFile(result.code);
})


const writeFile = (result) =>{
    fs.writeFile('./public/scripts/main.min.js', result, (e)=>{
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
    fs.mkdir('./public/scripts/',(e)=>{
        if(e){
            console.error(e);
        } 
    });
}

const emptyDir = ()=>{
    fs.unlink('./public/scripts/main.min.js',(e)=>{
        if(e){
            console.error(e);
        }    
    });
}
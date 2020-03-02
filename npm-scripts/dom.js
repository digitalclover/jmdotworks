const ejs = require('ejs');
const fs = require('fs');

try{
    ejs.renderFile('./views/index.ejs', (err, str)=>{
        if(err){throw err};
        try{
            fs.writeFile('./public/index.html', str);
        }catch(e){
            if(e.errno === 1){
                fs.unlink('./public/index.html',(err)=>{
                    if(err) throw err;
                });
            }
        }finally{
            fs.writeFile('./public/index.html', str, (err)=>{
                if(err && err.errno === -2){
                    fs.mkdir('./public/scripts/',(err)=>{
                        if(err) throw err;
                    });
                }else if(err) throw err;
            });
        }
    });
}catch(e){
    console.error(`Error: ${e.name}
    ${e.message}`);
    return false;
}
const fs = require('fs');

fs.mkdir('./public', (err)=>{
    if(err && err.errno === -17){
        return true;
    }else console.error(err);
});
// Imports
import * as zlib from "zlib";
import * as http from "http";
import * as fs from "fs";
import * as path from "path";

// Vars
const port = process.env.PORT || 4444;

// Create server
const server = http.createServer().listen(port, ()=>{
    if(port === 4444){
        console.log(`Listening @ localhost:4444`);
    }
});


const acceptsGzip = (request:http.IncomingMessage):boolean=>{
    const accepts = request.headers['accept-encoding'];
    if(accepts != undefined){
        return accepts.includes('gzip') ? true : false;
    }else{
        return false;
    }
}

server.on('request',(request:http.IncomingMessage, response:http.ServerResponse)=>{
    const path = `.${request.url}`;
    console.log(path);
    if(path === './'){
        fs.readFile('./public/index.html', (err, data)=>{
            if(err){
                response.writeHead(500);
                response.end(`Internal server error`);
            }else if(acceptsGzip(request)){
                response.writeHead(200, {'Content-Type': 'html', 'Content-Encoding': 'gzip'});
                zlib.gzip(data, (err, res)=>{
                    if(err) console.error(err);
                    response.end(res, 'utf-8');
                });
            }
            else{
                response.writeHead(200, {'Content-Type': 'html'});
                response.end(data, 'utf-8');
            }

        });
    }else if(path === './favicon.ico'){
        fs.readFile('./favicon.ico', (err, data)=>{
            if(err){
                response.writeHead(500);
                response.end(`Internal server error`);
            }else if(acceptsGzip(request)){
                response.writeHead(200, {'Content-Type': 'png', 'Content-Encoding': 'gzip'});
                zlib.gzip(data, (err, res)=>{
                    if(err) console.error(err);
                    response.end(res, 'utf-8');
                });
            }
            else{
                response.writeHead(200, {'Content-Type': 'png'});
                response.end(data, 'utf-8');
            }

        });
    }else{
        fs.readFile(`./public/${path}`, (err, data)=>{
            if(err){
                response.writeHead(500);
                response.end(`Internal server error
                    ${err.name}
                    ${err.message}`
                );
            }else{
                const type = fileParser(path);
                if(type != false){
                    if(acceptsGzip(request)){
                        response.writeHead(200, {'Content-Type': type, 'Content-Encoding': 'gzip'});
                        zlib.gzip(data, (err, res)=>{
                            if(err) console.error(err);
                            response.end(res, 'utf-8');
                        });
                    }
                    else{
                        response.writeHead(200, {'Content-Type': type});
                        response.end(data, 'utf-8');
                    }
                }else{
                    response.writeHead(415, {'Content-Type': 'text/html'});
                    response.end('Unsupported Media Type', 'utf-8');
                }
            }

        }); 
    }
});

const fileParser = (reqPath:string) => {
    type SupportedMimeTypes = {
        '.html':string;
        '.js':string;
        '.css':string;
        '.json':string;
        '.png':string;
        '.jpg':string;
        '.gif':string;
        '.svg':string;
        '.wav':string;
        '.mp4':string;
        '.woff':string;
        '.ttf':string;
        '.eot':string;
        '.otf':string;
    };

    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf'
    };
    const extName = path.extname(reqPath).toLowerCase() as keyof SupportedMimeTypes;
    if(extName in mimeTypes){
        return mimeTypes[extName];
    }else{
        return false;
    }
}
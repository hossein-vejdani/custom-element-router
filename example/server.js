const http = require('http')
const fs = require('fs')
const path = require('path')
const port = 5500
http.createServer((req, res) => {
    const file = {
        path: 'index.html',
        header: {
                'Access-Control-Allow-Origin': '*',
                
                'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
                'Access-Control-Max-Age': 2592000, // 30 days
                /** add other headers as per requirement */
            'Content-Type': 'text/html; charset=utf-8'
        }
    } 
    if(req.url.indexOf('.') !== -1 && !req.url.endsWith('.html')) {
        if(req.url.startsWith('/')) {
            file.path = req.url.slice(1)
        } 
        const destructedUrl = req.url.split('.')
        const format = destructedUrl[destructedUrl.length - 1]
        switch(format) {
            case 'js':
                file.header = {
                    'Content-Type': 'text/javascript'
                }
                break
            case 'css':
                file.header = {
                    'Content-Type': 'text/css'
                }
                break
            case 'ico': 
                file.header = {
                    'Content-Type': 'image/x-icon'
                }
                break
            case 'png':
                file.header = {
                    'Content-Type': 'image/' + format
                }
        }
    }
    fs.readFile(file.path, 'utf-8', (err, content) => {
        if (err) {
          console.log('error on load html')
        }
        if(file.header) {
            res.writeHead(200, file.header)
        }
        res.end(content)
    })
    }).listen(port, () => {
    console.log('listening on ' + port)
})
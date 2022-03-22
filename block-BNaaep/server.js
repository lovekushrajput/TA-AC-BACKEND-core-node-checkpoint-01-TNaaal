let http = require('http')
let fs = require('fs')
let qs = require('querystring')
let Url = require('url')

let server = http.createServer(handleRequest)


function handleRequest(req, res) {
    let method = req.method
    let parsedUrl = Url.parse(req.url, true)

    // // rendering index.html
    if (method === 'GET' && parsedUrl.pathname === '/') {
        fs.readFile('index.html', (err, content) => {
            if (err) return console.log(err)
            res.setHeader('Content-Type', 'text/html')
            res.end(content)
        })
    }
    // rendering about.html
    else if (method === 'GET' && parsedUrl.pathname === '/about') {
        fs.readFile('about.html', (err, content) => {
            if (err) return console.log(err)
            res.setHeader('Content-Type', 'text/html')
            res.end(content)
        })
    }

    // rendering image
    else if (parsedUrl.pathname.split('.').pop() === 'png') {
        fs.readFile('assets' + parsedUrl.pathname, (err, content) => {
            if (err) return console.log(err)
            res.setHeader('Content-Type', 'image/png')
            res.end(content)
        })
    }
    // rendering css
    else if (parsedUrl.pathname.split('.').pop() === 'css') {
        fs.readFile('assets' + parsedUrl.pathname, (err, content) => {
            if (err) return console.log(err)
            res.setHeader('Content-Type', 'text/css')
            res.end(content)
        })
    }

    // rendering form 
    else if (method === 'GET' && parsedUrl.pathname === '/contact') {
        fs.readFile('form.html', (err, content) => {
            if (err) return console.log(err)
            res.setHeader('Content-Type', 'text/html')
            res.end(content)
        })
    }

    // Capturing form data
    let store = ''
    req.on('data', (chunks) => {
        store += chunks
    })
    req.on('end', () => {
        if (method === 'POST' && parsedUrl.pathname === '/form') {
            let parsedData = JSON.stringify(qs.parse(store))

            let userName = qs.parse(store).Username;
            // console.log(__dirname +'/contacts/' + userName + '.json')
            fs.open(__dirname + '/contacts/' + userName + '.json', 'wx', (err, fd) => {
                if (err) return console.log(`${userName} is already taken`)
                fs.writeFile(fd, parsedData, (err) => {
                    if (err) return console.log(err)
                    fs.close(fd, () => {
                        if (err) return console.log(err)
                        res.end(`${userName} is successfully created`)
                    })
                })
            })
        }


        // GET the user
        else if (method === 'GET' && parsedUrl.pathname === '/users') {

            // all users
            if (parsedUrl.search === null) {
                fs.readdir(__dirname + '/contacts', (err, files) => {
                    if (err) return console.log(err)
                    files.forEach(((file) => {
                        fs.readFile(__dirname + '/contacts/' + file, (err, content) => {
                            if (err) return console.log(err)
                            res.end(content)
                        })
                    }))
                })


            } else {

                // specific users
                fs.readFile(__dirname + '/contacts/' + parsedUrl.query.username + '.json', (err, content) => {
                    if (err) return console.log(err)
                    res.end(content)
                })


            }


        } else {
            res.end('404 page not found')
        }
    })

}



server.listen(8000, () => console.log('server is listening on port 8000'))
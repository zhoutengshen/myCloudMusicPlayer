
const Encrypt = require('./crypto.js')
const http = require('http')
const queryString = require('querystring')



function createWebAPIRequest(host,
                             path,
                             method,
                             data,
                             cookie,
                             callback,
                             errorcallback) {
    let music_req = ''
    const cryptoreq = Encrypt(data)
    const http_client = http.request(
        {
            hostname: host,
            method: method,
            path: path,
            headers: {
                Accept: '*/*',
                'Accept-Language': 'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
                Connection: 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                Referer: 'http://music.163.com',
                Host: 'music.163.com',
                Cookie: cookie,
            }
        },

        function (res) {
            res.on('error', function (err) {
                errorcallback(err)
            })

            res.setEncoding('utf8')
            //状态码200表示请求成功，请求数据可以返回
            if (res.statusCode != 200) {
                console.log("!200")
                createWebAPIRequest(host, path, method, data, cookie, callback)
                return
            } else {
                console.log("200")
                res.on('data', function (chunk) {
                    music_req += chunk
                })
                res.on('end', function () {
                    if (music_req == '') {
                        createWebAPIRequest(host, path, method, data, cookie, callback)
                        return
                    }
                    if (res.headers['set-cookie']) {
                        callback(music_req, res.headers['set-cookie'])
                    } else {
                        callback(music_req)
                    }
                })
            }
        }
    )

    http_client.write(
        queryString.stringify({
            params: cryptoreq.params,
            encSecKey: cryptoreq.encSecKey
        })
    )
    http_client.end()
}


module.exports = createWebAPIRequest

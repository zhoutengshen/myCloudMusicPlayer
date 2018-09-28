var express = require('express');
var router = express.Router();
var createWebAPIRequest = require("./unit")

router.get('/api/musicUrl', function (req, res) {
    const id = req.query.id
    const br = req.query.br || 999000
    const data = {
        ids: [id],
        br: br,
        csrf_token: ''
    }
    const cookie = req.get('Cookie') ? req.get('Cookie') : "_ntes_nuid=038b3c4130946536e03848366e762aa6"
    createWebAPIRequest(
        'music.163.com',
        '/weapi/song/enhance/player/url',
        'POST',
        data,
        cookie,
        function (music_req) {
            res.send(music_req)
        },
        function (err) {
            res.status(502).send('fetch error')
        }
    )


})

router.get("/api/search", function (req, res) {
    const cookie = req.get("Cookie") ? req.get("Cookie") : "";
    const keywords = req.query.keywords;
//||符号遇到true 返回
// 如果type limit offset 是false 或者  0 则返回||后面的值
    const type = req.query.type || 1;
    const limit = req.query.limit || 30;
    const offset = req.query.offset || 0;
// *(type)* 搜索单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
    const data =
        {
            csrf_token: "",
            limit,
            type,
            s: keywords,
            offset
        };

    createWebAPIRequest(
        "music.163.com",
        "/weapi/search/get",
        "POST",
        data,
        cookie,
        function (music_req) {
            res.send(music_req)
        }
        ,
        function (err) {
            res.status(502).send("fetch error")

        }
    )
    ;
});

module.exports = router;

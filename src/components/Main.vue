<template>
  <div class="main">
    <h1 style="text-align: center">{{ msg }}</h1>
    <div class="row contain">
      <div class="left  col-sm-4 col-sm-offset-2">
        <div class="input-group">
          <span class="input-group-addon">输入搜索的名字：</span>
          <input class="form-control" v-model="txtSearchName" @blur="getMusicList()">
        </div>
        <div class="input-group">
          <span class="input-group-addon">获取到的Url：</span>
          <input v-model="musicUrl" class="form-control" id="txtMusicUrl">

        </div>
        <div>
          <audio id="audio" autoplay="autoplay" controls>
            <source id="sPlayer">
          </audio>
        </div>
        <div>

        </div>
      </div>
      <div class="right col-sm-4">
        <h1 style="text-align: center">歌曲列表：</h1>
        <ul class="list-group">
          <li @click="selectedItem(index,song.id)"
              v-show="selectedIndex-5<(index)
              &&(index)<selectedIndex+5"
              :class="{'list-group-item':true,'active':index==selectedIndex}"
              v-for="(song,index) in songs">
            <span> {{index+1}}:{{song.name}}</span>
          </li>
        </ul>
      </div>
    </div>

  </div>
</template>
<script>
  export default {
    name: 'hello',
    data () {
      return {
        msg: '云播放器',
        musicList: [],
        txtSearchName: "不要说话",
        songs: {},
        selectedIndex: 0,
        musicUrl: "",
        isPlaying: false

      }
    },
    methods: {
      getMusicList: function () {
        this.$http.get('api/search?keywords=' + this.txtSearchName).then(
          function (response) {
            if (response.body.code == '200') {
              this.songs = response.body.result.songs
              console.log(response.body)
            }
            else {
              alert("status==" + response.body.code)
            }
          },
          function () {

          }
        )
      },
      selectedItem: function (index, songId) {

        console.log(index > 5 ? index : 5)

        this.$http.get("/api/musicUrl?id=" + songId).then(
          function (res) {
            this.musicUrl = res.body.data[0].url;
            this.play(index);
            this.selectedIndex = index
          },
          function (res) {

          }
        )
      },
      play(index){
        var audio = document.querySelector('#audio');
        if (!this.isPlaying) {
          audio.src = this.musicUrl;
          audio.play();
          this.isPlaying = true;
        } else if (index == this.selectedIndex) {
          audio.pause();
          audio.currentTime = 0;
          this.isPlaying = false;
          audio.url = this.musicUrl;
        }

      }
    }
  }

</script>

<style>
  li span {
    list-style-type: none;
  }
  li span{
    cursor: pointer;
  }
  .contain {

  }

  .main {
  }

  .left {

    position: relative;
    top: 50px;
  }

  .left div {
    padding-top: 30px;
  }
  *{

  }
  h1{
    color: white;
    font-weight: 100;
    font-family: "Adobe 仿宋 Std R";
  }

</style>


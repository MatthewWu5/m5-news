<template>
  <div id="app">
    <div class="">

      <!--<div v-for="item in v_for_data">{{item.prop1+' '+item.prop2}}</div>-->
      <router-view>
      </router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      v_for_data: []
    }
  },
  methods: {
    inputMethod: x => {
      console.log('inputMethod: ' + x)
    }
  },
  mounted: function() {
    this.v_for_data = [{ prop1: '1', prop2: '2' }]
  }
}
</script>

<style>
@media (max-width: 992px) {
  #app {
    font-size: 40px;
  }
  .search-area {
    font-size: 35px !important;
    margin-bottom: 10px;
    margin-right: 45px
  }
  .search-area .search-input {
    width: 400px;
  }
  .search-area .interval-days {
    width: 95px !important;
    text-align: center;
  }
  .search-area i.removeBtn {
    margin-left: -45px !important;
  }
  .search-area .fa-refresh {
    font-size: 50px !important;
    position: absolute;
    top: 10px;
    right: 35px;
    margin-top: 5px;
  }
  #app .content-container {
    height: 1173px;
    overflow: auto;
    font-size: 50px;
    border-top: solid 2px #a8c6e2;
    border-bottom: solid 2px #a8c6e2;
    margin-right: 25px !important;

    /*background:url(./assets/leo1.jpg) no-repeat;
    background-size: 103%;
    background-position-x: -11px;*/
  }
  #app .content-container-showOption {
    height: 1100px !important;
  }
  /*#app .content-container a {
    color: #faff19;
    background-color: #12ad12;
    color: black;
  }*/
  #app .leo-container,
  .liveMatch {
    height: 1300px !important;
  }
  .tab-container span {
    font-size: 40px;
    border: solid 2px #a8c6e2;
    border-bottom: initial;
    display: inline-block;
    width: calc(100%/4);
  }
  .live-link-overflow {
    height: 70px !important;
  }
  .search-area .checkbox-option {
    top: -20px;
    left: 92px;
    -webkit-transform: scale(3);
  }
  .search-area .fa-picture-o {
    font-size: 47px !important;
    top: -34px;
    left: 10px;
  }
  .margin>a {
    font-size: 45px;
  }
}
/*end media on phone*/

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  /*margin-top: 60px;*/
}

.my-area {
  border: 2px solid gainsboro;
  padding: 10px;
}

.my-area>h2 {
  color: red;
}

.search-area i.removeBtn {
  width: 10px;
  height: 10px;
  margin-left: -18px
}

.search-area .interval-days {
  width: 53px;
}

.button-press,
.image-press {
  background-color: #a8c6e2;
  cursor: default;
}

.leo-news-color {
  color: #12abf7;
  font-weight: bolder;
}

.incremental {
  /*color: #e0ad16;*/
  color: #0888f7;
}

.readed {
  color: #c1cbd4;
}

.live-link-overflow {
  height: 25px;
  overflow-y: hidden;
}

.content-container {
  height: 850px;
  overflow: auto;
  border-top: solid 1px #a8c6e2;
  border-bottom: solid 1px #a8c6e2;
  padding-left: 20px;
  padding-bottom: 40px;
  margin-top: 5px;
}

.checkbox-option {
  position: absolute;
  top: -15px;
  left: 24px;
  -webkit-transform: scale(1.5);
}

.fa-picture-o {
  position: absolute;
  top: -15px;
  font-size: 20px !important;
}

.search-area .fa-refresh {
  font-size: 15px;
  margin-left: 43px;
}

.margin>a {
  margin-left: 20px;
}

.margin>a:first-child {
  margin-left: 0px;
}
</style>

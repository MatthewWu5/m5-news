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
  mounted: function () {
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
    font-size: 30px !important;
    margin-bottom: 10px;
    margin-right: 50px
  }
  .search-area .search-input {
    width: 200px;
  }
  .search-area .interval-days {
    width: 95px !important;
    text-align: center;
  }
  .search-area i.removeBtn {
    margin-left: -45px !important;
  }
  .search-area .fa-refresh {
    float: right;
    font-size: 50px
  }
  #app .content-container {
    height: 1157px;
    overflow: auto;
    font-size: 50px;
    border-top: solid 2px #a8c6e2;
    border-bottom: solid 2px #a8c6e2;
    margin-right: 25px;
  }
  #app .leo-container{
    height: 1300px !important;
  }
  .tab-container span {
    font-size: 40px;
    border: solid 2px #a8c6e2;
    border-bottom: initial;
  }
}

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

.button-press {
  background-color: #a8c6e2;
  cursor: default;
}

.leo-news-color {
  color: #f7f71a;
  font-weight: bolder;
}

.incremental {
  color: #e0ad16;
}

.readed {
  color: #c1cbd4;
}
</style>

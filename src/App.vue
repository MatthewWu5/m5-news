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
    font-size: 35px;
  }
  .leo-news-color {
    font-size: 45px !important;
  }
  .search-area i.removeBtn {
    margin-left: -45px !important;
  }
  #app .content-container{
    height: 1100px;
    overflow: auto;
    font-size: 40px;
    border-top: solid 2px #a8c6e2;
    border-bottom: solid 2px #a8c6e2;
    margin-right: 25px;
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

.search-area {
  padding-bottom: 5px;
}

.search-area i.removeBtn {
  width: 10px;
  height: 10px;
  margin-left: -18px
}

.button-press {
  background-color: #a8c6e2;
  cursor: default;
}

.leo-news-color {
  color: #f7f71a;
  font-size: 20px;
  font-weight: bolder;
}
</style>

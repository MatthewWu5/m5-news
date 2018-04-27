<template>
    <!-- <div class="margin">
        <router-link :to="{name: 'FootballNews'}">News</router-link>
        <router-link :to="{name: 'LiveMatch'}">Match</router-link>
        <router-link :to="{name: 'MessiVideo'}">Leo-Video</router-link>
        <router-link :to="{name: 'Topic'}">Topic</router-link>
        <router-view style="margin-top: 5px;margin-left:15px;margin-right:15px"></router-view>
    </div> -->

    <div class="" v-nav="{hideNavbar: true}" v-tabbar="{'menus': menus, menuColor: '#B5B5B5', activeMenuColor: '#44CC00', onMenuClick: menuClicked}">
      <router-view></router-view>
    </div>
</template>

<script>
export default {
  name: "newsBase",
  data() {
    return {
      menus: [
        {
          iconOn: "ion-ios-home",
          iconOff: "ion-ios-home-outline",
          text: "News",
          path: "/news/football"
        },
        {
          iconOn: "ion-ios-pricetags",
          iconOff: "ion-ios-pricetags-outline",
          text: "Messi Videos",
          path: "/news/leoVideo"
        },
        {
          iconOn: "ion-ios-cart",
          iconOff: "ion-ios-cart-outline",
          text: "Match time",
          path: "/news/liveMatch",
        },
      ]
    };
  },
  methods: {
    menuClicked(menuIndex) {
      console.log(menuIndex);
    }
  },
  beforeDestroy() {
    $tabbar.$emit("hideTabbar");
  }
};
</script>

<style lang="scss">
$content-container-height: 850px;
$content-container-height-phone: 1173px;

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  @media (max-width: 992px) {
    font-size: 40px;
    .content-container-showOption {
      height: 1100px !important;
    }
    .leo-container,
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
  }
}

.content-container {
  height: $content-container-height;
  overflow: auto;
  border-top: solid 1px #a8c6e2;
  border-bottom: solid 1px #a8c6e2;
  padding-left: 20px;
  padding-bottom: 40px;
  margin-top: 5px;
  @media (max-width: 992px) {
    height: $content-container-height-phone;
    font-size: 50px;
    border-top: solid 2px #a8c6e2;
    border-bottom: solid 2px #a8c6e2;
    margin-right: 25px;
  }
  .mint-swipe-item.is-active {
    overflow: auto;
  }
}

.search-area {
  @media (max-width: 992px) {
    font-size: 35px;
    margin-bottom: 10px;
    margin-right: 45px;
    .search-input {
      width: 400px;
    }
    .page-btn {
      display: none;
    }
    .checkbox-option {
      top: -20px;
      left: 15px;
      -webkit-transform: scale(3.5);
    }
  }
  i.removeBtn {
    width: 10px;
    height: 10px;
    margin-left: -18px;
    @media (max-width: 992px) {
      margin-left: -45px;
    }
  }
  .interval-days {
    width: 53px;
    @media (max-width: 992px) {
      width: 95px;
      text-align: center;
    }
  }
  .fa-refresh {
    font-size: 15px;
    margin-left: 43px;
    @media (max-width: 992px) {
      font-size: 50px;
      position: absolute;
      top: 10px;
      right: 35px;
      margin-top: 5px;
    }
  }
  .fa-picture-o {
    position: absolute;
    top: -15px;
    font-size: 20px;
    @media (max-width: 992px) {
      font-size: 57px;
      top: -37px;
      left: 80px;
    }
  }
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
  color: #0888f7;
}

.readed {
  color: #c1cbd4;
}

.live-link-overflow {
  height: 25px;
  overflow-y: hidden;
  @media (max-width: 992px) {
    height: 70px;
  }
}

.checkbox-option {
  position: absolute;
  top: -15px;
  left: 24px;
  -webkit-transform: scale(1.5);
}

.margin > a {
  margin-left: 20px;
  &:first-child {
    margin-left: 0px;
  }
  @media (max-width: 992px) {
    font-size: 45px;
  }
}
</style>


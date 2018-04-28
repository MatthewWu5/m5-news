<template>
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
          path: "/news/liveMatch"
        }
      ]
    }
  },
  methods: {
    menuClicked(menuIndex) {
      console.log(menuIndex)
    }
  },
  beforeDestroy() {
    $tabbar.$emit("hideTabbar")
  }
}
</script>

<style lang="scss">
$container-height-phone: 622px;

.container-for-scroll {
  height: $container-height-phone;
  overflow-y: auto;
  overflow-x: hidden;
}

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

.content-container2 {
  height: $content-container-height;
  overflow: auto;
  // border-top: solid 1px #a8c6e2;
  // border-bottom: solid 1px #a8c6e2;
  padding-left: 20px;
  padding-bottom: 40px;
  margin-top: 5px;
  @media (max-width: 992px) {
    height: $content-container-height-phone;
    // border-top: solid 2px #a8c6e2;
    // border-bottom: solid 2px #a8c6e2;
    margin-right: 25px;
  }
  .mint-swipe-item.is-active {
    overflow: auto;
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


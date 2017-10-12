<template>
    <div class="margin">
        <router-link :to="{name: 'FootballNews'}">News,</router-link>
        <router-link :to="{name: 'MessiVideo'}">Messi Video,</router-link>
        <router-link :to="{name: 'LiveMatch'}">Live Match</router-link>
        <!--<a href="https://news.zhibo8.cc/zuqiu/" target="_blank">Zhibo8</a>-->
        <router-view style="margin-top: 5px;margin-left:15px;margin-right:15px"></router-view>
    </div>
</template>


<script>
import FootballNews from './footballNews'
export default {
    name: 'base',
    components: { FootballNews },
}
</script>
<style>
.margin {
    margin-left: 20px !important;
    margin-top: 10px !important;
}
</style>

<template>
    <div class="margin">
        <router-link :to="{name: 'FootballNews'}">News,</router-link>
        <router-link :to="{name: 'MessiVideo'}">Messi Video,</router-link>
        <router-link :to="{name: 'LiveMatch'}">Live Match,</router-link>
        <a href="https://www.zhibo8.cc/zuqiu/luxiang.htm" target="_blank">Match Record</a>
        <router-view style="margin-top: 5px;margin-left:15px;margin-right:15px"></router-view>
    </div>
</template>


<script>
export default {
    name: 'newsBase',
}
</script>
<style>
.margin {
    margin-left: 20px !important;
    margin-top: 10px !important;
}
</style>

<template>
    <div class="margin">
        <router-link :to="{name: 'FootballNews'}">News</router-link>
        <router-link :to="{name: 'LiveMatch'}">Match</router-link>
        <router-link :to="{name: 'MessiVideo'}">Leo-Video</router-link>
        <router-link :to="{name: 'Topic'}">Topic</router-link>
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

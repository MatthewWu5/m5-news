<template>
    <div>
        <h>base:</h>
        <router-link :to="{name: 'Base'}">Base</router-link>
        <h>home in Base:</h>
        <router-link :to="{name: 'HomeView'}">Home</router-link>
        <router-view></router-view>
    </div>
</template>


<script>
export default {
    name: 'base',
}
</script>

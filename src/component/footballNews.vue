<template>
  <div>
    <h>
      {{this.catagory}}
    </h>
    <a v-for="item in this.news" :href="item.url">
      {{item.title}}
    </a>
  </div>
</template>

<script>
export default {
  name: 'footballNews',
  props: {
    catagory: String,
    news: []
  },
  created() {
    console.log(this.news);
  }
}
</script>


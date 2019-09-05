<template>
  <div class="content">
    <div class="head">
      <img class="cancelicon" v-on:click="Cancel(name)" src="../assets/images/cancel.png" />
      菜宝转赠
    </div>
    <div>
      <img src="../assets/images/transfer.png" class="rule" />
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      name: ""
    };
  },
  methods: {
    Cancel: function(name) {
      this.$router.push({ path: "Giving", query: { name: name } });
    }
  },
  mounted() {
  },
  created() {
    this.name = this.$route.query.item;
  }
};
</script>

<style scoped>
.content {
  width: 100%;
  position: fixed;
  top: 0;
  bottom: 0;
  overflow: auto;
  cursor: pointer;
}
.content .rule {
  width: 100%;
  cursor: pointer;
}
</style>
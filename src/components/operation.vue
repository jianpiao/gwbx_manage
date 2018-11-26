<template>
  <div class="operation">
    <component v-bind:is="Adminrouter"> </component>
  </div>
</template>

<script>
import Jurisdiction from './admin/jurisdiction'
import Adminindex from './admin/adminindex'
import Notice from './admin/notice'
import Content from './admin/content'
import Company from './admin/company'

export default {
  name: 'operation',
  data () {
    return {
      Adminrouter: 'Adminindex'
    }
  },
  components: {
    Jurisdiction,
    Adminindex,
    Notice,
    Content,
    Company
  },
  methods: {
    onAdminindex (ind_) {
      // {int_} 菜单名称
      this.Adminrouter = ind_
    }
  }
}
</script>

<style scoped>
  .operation{
    width: 100%;
    height: calc(100% - 60px);
    min-width: 1000px;
    overflow: auto;
    background-color: #e9eef3;
  }
</style>

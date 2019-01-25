<template>
  <v-app>
    <v-navigation-drawer
      permanent
      width="333"
    >
      <Setting />
    </v-navigation-drawer>
  </v-app>
</template>

<script>
import Setting from './layouts/Setting'

export default {
  name: 'App',
  components: {
    Setting
  },
  data () {
    return {
      //
    }
  }
}
</script>

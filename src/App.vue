<template>
  <v-app>
    <v-layout row>
      <v-navigation-drawer
        permanent
        width="333"
      >
        <Setting />
      </v-navigation-drawer>
      <Result />
    </v-layout>
  </v-app>
</template>

<script>
import Setting from './layouts/Setting'
import Result from './layouts/Result'

export default {
  name: 'App',
  components: {
    Setting,
    Result
  },
  data () {
    return {
      //
    }
  }
}
</script>

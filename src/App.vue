<template>
  <v-app>
    <v-snackbar
      v-model="snackbar"
      :timeout="2000"
      :top="true"
    >
      {{ snacktext }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-layout row>
      <v-navigation-drawer
        permanent
        width="333"
      >
        <Setting
          @showSnack="showSnack"
        />
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
      snackbar: false,
      snacktext: 'Error'
    }
  },
  methods: {
    showSnack (val) {
      this.snacktext = val
      this.snackbar = true
    }
  }
}
</script>

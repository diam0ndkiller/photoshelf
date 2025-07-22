import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

const defaultTheme = {
  light: '#dddddd',
  light_lighter: '#ffffff',
  light_darker: '#aaaaaa',

  dark: '#323232',
  dark_lighter: '#444444',
  dark_darker: '#111111',

  blue: '#0080ff',
  blue_lighter: '#40a0ff',
  blue_darker: '#004080',

  accent: '#5ed848ff',
  accent_lighter: '#98eb89ff',
  accent_darker: '#379e25ff',
}

const lightTheme = {
  dark: false,
  colors: {
    primary: defaultTheme.blue,
    secondary: defaultTheme.blue_darker,
    accent: defaultTheme.accent,
    
    'background': defaultTheme.light_lighter,
    'on-background': defaultTheme.dark,

    'surface': defaultTheme.light,
    'on-surface': defaultTheme.dark_darker,
  },
}

const darkTheme = {
  dark: true,
  colors: {
    primary: defaultTheme.blue,
    secondary: defaultTheme.blue_lighter,
    accent: defaultTheme.accent,

    'background': defaultTheme.dark,
    'on-background': defaultTheme.light,

    'surface': defaultTheme.dark_lighter,
    'on-surface': defaultTheme.light_lighter,
  },
}

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: lightTheme,
      dark: darkTheme,
    },
  },
})

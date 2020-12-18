import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { mergeDeepLeft } from 'ramda'
import React from 'react'
import { ThemeProvider } from 'styled-components'
import { useApp } from '../../containers/common/AppContext'
import { lightenDarkenHexColor } from '../../helpers/index'
import '../../styles.scss'
import defaultThemeVars from '../../theme.json'

export const AppThemeProvider: React.FC = ({ children }) => {
  const { settings } = useApp()

  const defaultChakraTheme = {
    components: {
      Button: {
        baseStyle: {
          fontWeight: '400',
          borderRadius: '2px',
          _focus: {
            boxShadow: '0',
          },
        },
        variants: {
          primary: {
            background: 'primary.500',
            color: '#ffffff',
            _hover: {
              background: 'primary.300',
            },
          },
          outline: {
            border: 'solid 1px',
            borderColor: 'var(--gray)',
            color: '#585858',
            _hover: {
              background: 'transparent',
              borderColor: `${settings['theme.@primary-color']}`,
              color: `${settings['theme.@primary-color']}`,
            },
          },
          ghost: {
            _hover: {
              background: 'transparent',
            },
          },
        },
      },
      CloseButton: {
        baseStyle: {
          _focus: {
            boxShadow: '0',
          },
        },
      },
      IconButton: {
        download: {
          background: 'transparent',
        },
      },
      Input: {
        variants: {
          outline: () => ({
            field: {
              borderColor: 'var(--gray)',
            },
          }),
        },
      },
      Modal: {
        baseStyle: {
          dialog: {
            borderRadius: '2px',
          },
        },
      },
      Tooltip: {
        baseStyle: {
          bg: '#4a4a4a',
          borderRadius: '4px',
          fontWeight: '500',
          fontSize: '12px',
        },
      },
    },
    colors: {
      primary: {
        300: `${
          settings && settings['theme.@primary-color'] && lightenDarkenHexColor(settings['theme.@primary-color'], +40)
        }`,
        400: `${
          settings && settings['theme.@primary-color'] && lightenDarkenHexColor(settings['theme.@primary-color'], +20)
        }`,
        500: `${settings && settings['theme.@primary-color']}`,
        600: `${
          settings && settings['theme.@primary-color'] && lightenDarkenHexColor(settings['theme.@primary-color'], -20)
        }`,
      },
      gray: {
        100: 'rgba(0, 0, 0, 0.1)',
        200: '#f7f8f8',
        300: '#ececec',
        400: '#cdcece',
        500: '#cdcdcd',
        600: '#9b9b9b',
        700: '#585858',
        800: '#4a4a4a',
        900: 'rgba(0, 0, 0, 0.45)',
      },
    },
  }

  const themeVars = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'theme')
    .map(key => key.split('.')[1])
    .reduce((vars: { [key: string]: string }, themeKey: string) => {
      vars[themeKey] = settings[`theme.${themeKey}`]
      return vars
    }, defaultThemeVars)

  const customTheme = Object.keys(settings)
    .filter(key => key.split('.')[0] === 'chakraTheme')
    .map(key => key.split('.').slice(1).join('.'))
    .reduce((vars: any, themeKey: string) => {
      return mergeDeepLeft(
        vars,
        themeKey
          .split('.')
          .reverse()
          .reduce((acc: any, key) => {
            const obj = {} as any
            obj[key] = acc
            return obj
          }, settings[`chakraTheme.${themeKey}`]),
      )
    }, {})

  return (
    <ChakraProvider theme={extendTheme(mergeDeepLeft(customTheme, defaultChakraTheme))}>
      <ThemeProvider theme={themeVars}>{children}</ThemeProvider>
    </ChakraProvider>
  )
}

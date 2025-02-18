'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider } from './color-mode'
import { extendTheme } from '@mui/material'

export function Provider(props) {
  return (
    <ChakraProvider value={defaultSystem} theme={
      extendTheme({
        // Add custom theme configurations here if needed
        colors: {
          gray: {
            950: '#1a202c', // Define gray.950 as a custom color
          },
        },
      })
    }>
      <ColorModeProvider {...props} />
    </ChakraProvider >
  )
}

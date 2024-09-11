"use client"
import { ActionIcon, createTheme, Loader ,MantineColorsTuple} from '@mantine/core';

const darkerGreen: MantineColorsTuple = [
  '#0b3d0b',
  '#0e4d0e',
  '#116011',
  '#147214',
  '#178417',
  '#1a961a',
  '#1da81d',
  '#20ba20',
  '#23cc23',
  '#26de26'
];



export const myTheme = createTheme({
  // colors: {
  //   darkerGreen, // Add your custom color to the theme's colors
  // },
  primaryColor: 'violet',
  defaultRadius: 'md',
  focusRing: 'always',
  fontFamily: 'Poppins, sans-serif',
  headings: { fontFamily: 'Poppins, sans-serif' },
  components: {
    ActionIcon: ActionIcon.extend({
      defaultProps: {
        variant: 'subtle',
      },
    }),
    Loader: Loader.extend({
      defaultProps: {
        type: 'bars',
      },
    }),
  },
});

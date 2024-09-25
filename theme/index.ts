'use client';

import { ActionIcon, createTheme, Loader } from '@mantine/core';

export const myTheme = createTheme({
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

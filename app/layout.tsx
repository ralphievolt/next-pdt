import '@mantine/core/styles.css';

import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { myTheme } from '@/theme/';

export const metadata = {
  title: 'PDT',
  description: 'PDT version 5',
};
5;
export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="/favicon.svg" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <ChakraProvider>
          <MantineProvider theme={myTheme}>
            <Notifications position="bottom-right" zIndex={1000} />

            {children}
          </MantineProvider>
        </ChakraProvider>
      </body>
    </html>
  );
}

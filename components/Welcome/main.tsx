'use client';

import localFont from 'next/font/local';
import { useRouter } from 'next/navigation';
import { Box, Container, Flex, Image, Stack, Text } from '@chakra-ui/react';
import { IconArrowRight } from '@tabler/icons-react';
import { Button } from '@mantine/core';

const { version } = require('@/package.json');

const myFont = localFont({ src: '../../assets/rubiks/Rubik-Bold.ttf' });
const lightFont = localFont({ src: '../../assets/rubiks/Rubik-Light.ttf' });
const logoFont = localFont({ src: '../../assets/BlackOpsOne-Regular.ttf' });

export default function WelcomePage() {
  const router = useRouter();

  return (
    <Container maxW={'7xl'}>
      <Stack
        align={'center'}
        spacing={{ base: 8, md: 10 }}
        py={{ base: 20, md: 28 }}
        direction={{ base: 'column', md: 'row' }}
      >
        <Stack flex={1}>
          <Text
            as={'span'}
            position={'relative'}
            _after={{
              content: "''",
              width: '40%',
              height: '10%',
              position: 'absolute',
              bottom: 3,
              left: 0,
              bg: 'green.500',
              zIndex: -1,
            }}
            className={logoFont.className}
            fontSize="6xl"
            color={'purple.500'}
          >
            P D T
          </Text>
          <Text as={'span'} color={'purple.500'} fontSize="xl">
            version: {version}
          </Text>
          <Text as={'span'} color={'purple.500'} fontSize="5xl">
            Prototyping & Sign-off Tracking made easy!
          </Text>
          <br />
          <Text fontSize="2xl" mt={3} className={lightFont.className}>
            Keep track of your jobs and never miss an update in real time. 
          </Text>
          <Button
            variant="filled"
            rightSection={<IconArrowRight size={14} />}
            onClick={() => router.push('/dashboard')}
          >
            Get Started
          </Button>
        </Stack>
        <Flex flex={1} justify={'center'} align={'center'} position={'relative'} w={'full'}>
          <Box
            position={'relative'}
            height={'300px'}
            rounded={'2xl'}
            boxShadow={'2xl'}
            width={'full'}
            overflow={'hidden'}
          >
            <Image
              alt={'Hero Image'}
              // fit={"cover"}
              align={'center'}
              w={'100%'}
              h={'100%'}
              src={'/person.svg'}
            />
          </Box>
        </Flex>
      </Stack>
    </Container>
  );
}

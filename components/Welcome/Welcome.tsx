import { Center, Button, Container, Group, Image, Paper, Text, Title } from '@mantine/core';
import image from '@/public/person.svg';
import classes from './Welcome.module.css';
import localFont from 'next/font/local';


const logoFont = localFont({ src: '../../assets/BlackOpsOne-Regular.ttf' });


export function Welcome() {
  return (
    <Container size="md">
      <div className={classes.inner}>
        <Center>
        <div className={classes.content}>
          <Title order={1} className={logoFont.className} >PDT</Title>
          <Title className={classes.title} >
            The <span className={classes.highlight}>fastest</span> <br /> way to track
            parts in your company
          </Title>
          
        </div>
        </Center>
        <Image src={image.src} className={classes.image} />
      </div>
    </Container>
  );
}

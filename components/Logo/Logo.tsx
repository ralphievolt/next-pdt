import classes from './Logo.module.css';
import {
  Group,
  Text,
  UnstyledButton,
  UnstyledButtonProps,
} from '@mantine/core';
import Link from 'next/link';
import localFont from 'next/font/local';


type LogoProps = {
  href?: string;
} & UnstyledButtonProps;

const myFont = localFont({ src: '../../assets/rubiks/Rubik-SemiBold.ttf' });
const logoFont = localFont({ src: '../../assets/BlackOpsOne-Regular.ttf' });


const Logo = ({ href, ...others }: LogoProps) => {
  return (
    <UnstyledButton
      className={classes.logo}
      component={Link}
      href={href || '/'}
      {...others}
    >
      <Group gap="xs">
       
        <Text fw={700} className={logoFont.className}>PDT</Text>
      </Group>
    </UnstyledButton>
  );
};

export default Logo;

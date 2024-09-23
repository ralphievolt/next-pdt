'use client';

import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import {
  Button,
  Center,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { Surface } from '@/components';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import classes from './page.module.css';

const logoFont = localFont({ src: '../../../assets/BlackOpsOne-Regular.ttf' });

const LINK_PROPS: TextProps = {
  className: classes.link,
};

interface LoginForm {
  email: string;
  password: string;
}

function Page() {
  const router = useRouter();
  const form = useForm({
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) =>
        value && value?.length < 6 ? 'Password must include at least 6 characters' : null,
    },
  });

  const handleSubmit = async (values: LoginForm) => {
    const res = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    if (res?.error) {
      NegativeNotification(res.error as string);
    }
    if (res?.ok) {
      PositiveNotification('Login successful');
      router.push('/dashboard');
    }
  };

  return (
    <>
      <>
        <title>Sign up | PDT</title>

        <meta name="description" content="fastest and easiest way to track parts in your company" />

      </>
      <Text ta="center" className={logoFont.className} color="violet" style={{fontSize:"30px"}}>
        PDT
      </Text>
      <Text ta="center">Sign in to your account to continue</Text>

      <Surface component={Paper} className={classes.card}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Email"
            placeholder="Your Email"
            key={form.key('email')}
            required
            classNames={{ label: classes.label }}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('password')}
          />

          <Button fullWidth mt="xl" type="submit">
            Sign in
          </Button>
        </form>
        <Center mt="md">
          <Text fz="sm" ta="center" component={Link} href={PATH_AUTH.signup} {...LINK_PROPS}>
            Do not have an account yet? Create account
          </Text>
        </Center>
      </Surface>
    </>
  );
}

export default Page;

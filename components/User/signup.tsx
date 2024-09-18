'use client';

import React from 'react';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  TextProps,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { register } from '@/app/authentication/actions/register';
import { Surface } from '@/components';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import classes from './page.module.css';

interface FormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const logoFont = localFont({ src: '../../assets/BlackOpsOne-Regular.ttf' });

function Signup() {
  const LINK_PROPS: TextProps = {
    className: classes.link,
  };

  const [error, setError] = React.useState<string>();
  const ref = React.useRef<HTMLFormElement>(null);

  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      name: (value) => (value ? null : 'Name is required'),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      const r = await register({
        email: values.email,
        password: values.password,
        name: values.name,
      });
      if (r?.error) {
        NegativeNotification(r.error);
      } else {
        PositiveNotification('User registered successfully');

        // return router.push('/authentication/signin');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'Email already exists!') {
        NegativeNotification('Email already exists!');
      } else {
        NegativeNotification(error instanceof Error ? error.message : 'Failed to register item');
      }
    }
  };

  return (
    <>
      <title>Sign up | PDT</title>
      <meta name="description" content="fastest and easiest way to track parts in your company" />

      <Title ta="center" c="violet">
        Welcome!
      </Title>

      <Text ta="center">Create your account to continue</Text>

      <Surface component={Paper} className={classes.card}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            label="Name"
            placeholder="Enter fullname"
            required
            classNames={{ label: classes.label }}
            {...form.getInputProps('name')}
          />

          <TextInput
            label="Email"
            placeholder="Enter valid email address"
            required
            mt="md"
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
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm password"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('confirmPassword')}
          />
          <Button fullWidth mt="xl" type="submit">
            Create account
          </Button>
        </form>
        <Center mt="md">
          <Text size="sm" component={Link} href={PATH_AUTH.signin} {...LINK_PROPS}>
            Already have an account? Sign in
          </Text>
        </Center>
      </Surface>
    </>
  );
}

export default Signup;

'use client';

import React from 'react';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
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
import { changePwd } from '@/app/authentication/actions/change-pwd';
import { register } from '@/app/authentication/actions/register';
import { Surface } from '@/components';
import NegativeNotification from '@/components/Notifications/negative-notification';
import PositiveNotification from '@/components/Notifications/positive-notification';
import { PATH_AUTH, PATH_DASHBOARD } from '@/routes';
import classes from './page.module.css';

interface FormValues {
  oldpassword: string;
  password: string;
  confirmPassword: string;
}

const logoFont = localFont({ src: '../../assets/BlackOpsOne-Regular.ttf' });

function ChangePwd() {
  const LINK_PROPS: TextProps = {
    className: classes.link,
  };

  const [error, setError] = React.useState<string>();
  const ref = React.useRef<HTMLFormElement>(null);
  const { data: session, status } = useSession();

  const router = useRouter();

  const form = useForm<FormValues>({
    initialValues: {
      oldpassword: '',
      password: '',
      confirmPassword: '',
    },

    validate: {
      password: (value) => (value.length >= 6 ? null : 'Password must be at least 6 characters'),
      confirmPassword: (value, values) =>
        value === values.password ? null : 'Passwords do not match',
    },
  });

  const handleSubmit = async (values: FormValues) => {
    const { oldpassword, password } = values;

    try {
      await changePwd({ oldpassword, password });

      PositiveNotification('Password changed successfully');

      // Uncomment the following line if you want to redirect the user after a successful password change
      return router.push('/authentication/signin');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Authentication failed!') {
          NegativeNotification('Authentication failed!');
        } else {
          NegativeNotification(error.message);
        }
      } else {
        NegativeNotification('Failed to change password');
      }
    }
  };

  return (
    <>
      <title>Change Pwd | PDT</title>
      <meta name="description" content="Explore our versatile parts tracking" />
      <Text ta="center" c="violet" size="xl">
        Change Password
      </Text>

      <Surface component={Paper} className={classes.card}>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <PasswordInput
            label="Old password"
            placeholder="Enter old password"
            required
            classNames={{ label: classes.label }}
            {...form.getInputProps('oldpassword')}
          />

          <PasswordInput
            label="Password"
            placeholder="Your new password"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('password')}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm new password"
            required
            mt="md"
            classNames={{ label: classes.label }}
            {...form.getInputProps('confirmPassword')}
          />
          <Button fullWidth mt="xl" type="submit">
            Change Password
          </Button>
        </form>
      </Surface>
    </>
  );
}

export default ChangePwd;

"use client"

import Signup from '@/components/User/signup';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

function SignupPage() {
  return <Signup />;
}

export default SignupPage;

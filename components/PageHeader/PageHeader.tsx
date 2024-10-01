'use client';

import { Button, Divider, Menu, Modal, Paper, PaperProps, Title } from '@mantine/core';
import {  Surface } from '@/components';

type PageHeaderProps = {
  title: string;
  withActions?: boolean;
  breadcrumbItems?: any;
  invoiceAction?: boolean;
} & PaperProps;

const PageHeader = (props: PageHeaderProps) => {
  const { title, ...rest } = props;

  return (
    <>
      <Surface
        component={Paper}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 0',
        }}
        {...rest}
      >
        <Title order={3}>{title}</Title>

        <Button size="xs" style={{ marginLeft: 'auto' }}>
          Button Option
        </Button>
      </Surface>
      <Divider />
    </>
  );
};

export default PageHeader;

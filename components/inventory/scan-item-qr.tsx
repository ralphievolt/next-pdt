'use client';

import React, { useRef, useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button, Center, Group, Paper, Space, Table, Text, Title } from '@mantine/core';
import { checkinItems } from '@/app/inventory/scan-qr/actions/checkin-items';
import NegativeNotification from '../Notifications/negative-notification';
import PositiveNotification from '../Notifications/positive-notification';

const scannerStyles = {
  container: {
    height: '300px', // Set your desired height here
    width: '300px',
  },
  video: {
    height: '100%',
    width: 'auto', // Maintain aspect ratio
    maxWidth: '100%',
  },
};

type Category = {
  _id: string;
  name: string;
};

type ItemRegistrationProps = {
  categories: Category[]; // Directly pass the parsed categories array
};

interface Item {
  locationId: string;
  itemId: string;
}

const ItemRegistration: React.FC<ItemRegistrationProps> = ({ categories }) => {
  const [items, setItems] = useState<Item[]>([]);
  const scannedItemsRef = useRef<Item[]>([]);
  const scannedLocation = useRef<string>('');
  const [scanStep, setScanStep] = useState<string>('Scan Location');

  const handleScan = (result: { [key: string]: any }[]) => {
    if (scannedLocation.current === '') {
      scannedLocation.current = result[0].rawValue;
      setScanStep('Scan Items Now');
    }

    if (result && result[0] && scannedLocation.current !== result[0].rawValue) {
      const newItem = {
        locationId: scannedLocation.current, // Replace with actual location if available
        itemId: result[0].rawValue,
      };
      scannedItemsRef.current.push(newItem);
      setItems([...scannedItemsRef.current]);
    }
  };

  const saveTransaction = async () => {
    try {
      await checkinItems(items);
      PositiveNotification('Item location registered successfully');
    } catch (error) {
      NegativeNotification(
        error instanceof Error ? error.message : 'Failed to register item location'
      );
    }
  };

  const rows = items.map((element, index) => (
    <Table.Tr key={index}>
      <Table.Td>{element.locationId}</Table.Td>
      <Table.Td>{element.itemId}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Center>
      <Paper withBorder shadow="md" p="xl" w="450px">
        <Title style={{ textAlign: 'center' }} order={3}>
          QR Code Scanning
        </Title>
        <Space h="md" />
        <Center>
          <Scanner onScan={handleScan} styles={scannerStyles} />
        </Center>
        <Text fw={900} size="xl" mt={5} ta="center" c="violet">
          {scanStep}
        </Text>
        <Group justify="center" mt="xl">
          <Button onClick={saveTransaction}>Save</Button>

          <Button color="red" onClick={() => setItems([])}>
            Cancel
          </Button>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Location</Table.Th>
              <Table.Th>Item Name</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    </Center>
  );
};

export default ItemRegistration;

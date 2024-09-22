"use client";

import React, { useTransition, useState } from "react";

import {
  Container,
  Flex,
  Heading,
  Button,
  Spacer,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";

import JobList from "./job-list";
import AddJobForm from "./add-job-form";
import { actionResetScheduled } from "@/app/jobs/job-list/action/reset-scheduled";

const JobListTable = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = React.useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSizeClick = () => {
    setSubmitting(true);

    if (status === "unauthenticated") {
      toast({
        title: "User Unauthorised",
        description: "You don't have access to this function",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
      return;
    }
    onOpen();
    setSubmitting(false);
  };

  const resetSchedule = () => {
    if (status === "unauthenticated") {
      toast({
        title: "User Unauthorised",
        description: "You don't have access to this function",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
      return;
    }

    if (session?.user?.role !== "admin") {
      toast({
        title: "UnAuthorised!",
        description: "Your access is view only",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });

      return;
    }

    const jobsOnScheduleState = props.jobslist.filter(
      (job: any) => job.state === "Scheduled"
    );

    startTransition(async () => {
      let result = await actionResetScheduled(jobsOnScheduleState);
    });
  };
  React.useEffect(() => {
    if (props.jobslist.length === 0) {
      toast({
        title: "Job Not Found",
        description: "Sorry! No information for job search.",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
    }
  }, []);

  return (
    <Container maxW="8xl" px={{ base: 5, md: 10 }}>
      <Flex>
        <Heading size="lg" lineHeight={"100%"}>
          Sign-off{" "}
          <Text as={"span"} color={"purple.500"}>
            Jobs List
          </Text>
        </Heading>
        <Spacer />
        <Button
          size="sm"
          bg="purple.400"
          color="white"
          _hover={{
            bg: "purple.500",
          }}
          rounded="md"
          w={{ base: "30%", md: "15%", sm: "30%" }}
          onClick={handleSizeClick}
          isLoading={submitting}
        >
          Add/Edit Job
        </Button>
      </Flex>
      <JobList jobslist={props.jobslist} />

      <Button
        size="xs"
        bg="gray.200"
        color="black"
        _hover={{
          bg: "gray.300",
        }}
        rounded="md"
        w={{ base: "30%", md: "15%", sm: "30%" }}
        onClick={resetSchedule}
        isLoading={isPending}
      >
        Reset Schedule
      </Button>

      <Modal onClose={onClose} isOpen={isOpen} size={"md"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="purple.500">
            <Heading as="h2" size="md">
              Add Job
            </Heading>
          </ModalHeader>
          <ModalCloseButton />

          <AddJobForm />
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default JobListTable;

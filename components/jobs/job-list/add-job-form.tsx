"use client";

import { useRouter } from "next/navigation";
import { OptionBase } from "chakra-react-select";
import { useSession } from "next-auth/react";
import { useForm, Controller } from "react-hook-form";
import React, { useTransition, useState } from "react";

import { actionJobExist } from "@/app/jobs/job-list/action/job-exist";

import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useToast,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

interface IFormInputs {
  job_number: number;
  brand: string;
  state: selectOption;
}

interface selectOption extends OptionBase {
  label: string;
  value: string;
}

export default function AddJobForm() {
  const router = useRouter();
  const toast = useToast();
  const {
    control,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    // defaultValues: {
    //   state:   {
    //     value: "Ready for Staging",
    //     label: "Ready for Staging",
    //   },
    // },
  });
  const [adding, setAdding] = React.useState(false);
  const [update, setUpdate] = React.useState(false);
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const savedNewJob = async (data: any) => {
    if (session?.user?.role === "viewer") {
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
    setAdding(true);

    startTransition(async () => {
      let result = await actionJobExist(data.job_number);

      if (result === null) {
        toast({
          title: "New Job Error",
          description: "Job does not exist in Job Schedule List!",
          status: "error",
          duration: 5000,
          position: "top-right",
          isClosable: true,
          containerStyle: {
            color: "purple.500",
          },
        });
        setAdding(false);

        return;
      } else {
        let res: Response | undefined;
        if (update) {
          res = await fetch("job-list/api/update-job", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          });
        } else {
          res = await fetch("job-list/api/new-job", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
            },
          });
        }

        if (res?.status === 201) {
          toast({
            title: "New Job",
            description: "Job successfully added.",
            status: "success",
            duration: 5000,
            isClosable: true,
            containerStyle: {
              color: "purple.500",
            },
          });
          setAdding(false);
          router.refresh();
        } else if (res?.status === 500) {
          toast({
            title: "New Job Error",
            description: "User UnAuthorised",
            status: "error",
            duration: 5000,
            isClosable: true,
            containerStyle: {
              color: "purple.500",
            },
          });
          setAdding(false);
        } else if (res?.status === 505) {
          toast({
            title: "New Job Error",
            description: " Duplicate Job Number!",
            status: "error",
            duration: 5000,
            isClosable: true,
            containerStyle: {
              color: "purple.500",
            },
          });
          setAdding(false);
        }
      }
    });
  };

  return (
    <VStack
      as="form"
      spacing={8}
      w="100%"
      bg={useColorModeValue("white", "gray.700")}
      rounded="lg"
      boxShadow="lg"
      p={{ base: 5, sm: 10 }}
      onSubmit={handleSubmit((data: IFormInputs) => {
        const newJob = {
          job_number: data.job_number,
          brand: data.brand,
          state: "Ready for Staging",
        };

        savedNewJob(newJob);
      })}
    >
      <VStack spacing={4} w="100%">
        <FormControl id="job_number">
          <FormLabel>Job</FormLabel>
          <Input
            type="number"
            step="0.001"
            placeholder="Job number"
            variant="filled"
            rounded="md"
            {...register("job_number", { required: true })}
          />
        </FormControl>

        <FormControl id="brand">
          <FormLabel>Brand</FormLabel>
          <Input
            type="text"
            placeholder="Brand"
            variant="filled"
            rounded="md"
            {...register("brand", { required: true })}
          />
        </FormControl>
      </VStack>
      <VStack w="100%">
        <Button
          bg="purple.400"
          color="white"
          _hover={{
            bg: "purple.500",
          }}
          rounded="md"
          w={{ base: "100%", md: "max-content" }}
          type="submit"
          isLoading={adding}
          loadingText="Adding"
        >
          Submit Job
        </Button>
        <Checkbox
          isChecked={update}
          onChange={(e) => setUpdate(e.target.checked)}
          colorScheme="green"
        >
          Job Update
        </Checkbox>
      </VStack>
    </VStack>
  );
}

"use client";

import { useForm, Controller } from "react-hook-form";
import React from "react";
import { CreatableSelect, OptionBase } from "chakra-react-select";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAtom } from "jotai";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Stack,
  Textarea,
  useToast,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";

import {
  partsAtoms,
  responsibleAtoms,
  actionsAtoms,
  issuesAtoms,
  statusAtoms,
} from "@/stores";

interface IFormInputs {
  shelf: string;
  part: selectOption;
  status: string;
  issue: selectOption;
  detail: string;
  action: selectOption;
  responsible: selectOption;
  assort: string;

}

interface selectOption extends OptionBase {
  label: string;
  value: string;
}

export default function EntryForm(props: any) {
  const router = useRouter();
  const toast = useToast();
  const [partsOptions] = useAtom<readonly selectOption[]>(partsAtoms);
  const [actionsOptions] = useAtom<readonly selectOption[]>(actionsAtoms);
  const [issuesOptions] = useAtom<readonly selectOption[]>(issuesAtoms);
  const [statusOptions] = useAtom<readonly selectOption[]>(statusAtoms);
  const [responsibleOptions] =
    useAtom<readonly selectOption[]>(responsibleAtoms);
  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>();

  const [status, setStatus] = React.useState<boolean>(true);
  const [adding, setAdding] = React.useState(false);
  const textField = register("status", { required: true });
  const { data: session } = useSession();



  const addNewResult = async (data: any) => {
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

    const res = await fetch(`${props.job_id}/api/new-result`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
      },
    });
    if (res.status === 201) {
      toast({
        title: "New Result",
        description: "Result successfully added.",
        status: "success",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
      setAdding(false);
      router.refresh();
    } else if (res.status === 500) {
      toast({
        title: "Result Error",
        description: "Error in adding your new result. Please try again!",
        status: "error",
        duration: 5000,
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
      setAdding(false);
    }
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
        let result = {
          ...data,
          shelf: data.shelf.toUpperCase(),
          part: data.part.value,
          issue: status ? data.issue.value : "",
          action: status ? data.action.value : "",
          responsible: status ? data.responsible.value : "",
        };

        addNewResult(result);
      })}
    >
      <VStack spacing={4} w="100%">
        <Stack w="100%" spacing={3} direction={{ base: "column", md: "row" }}>
          <FormControl id="shelf">
            <FormLabel>Shelf</FormLabel>
            <Input
              type="text"
              placeholder="Shelf"
              variant="filled"
              rounded="md"
              {...register("shelf", { required: true })}
            />
          </FormControl>
          <Controller
            control={control}
            name="part"
            rules={{ required: true }}
            render={({ field: { onChange, onBlur, ref } }) => (
              <FormControl id="part">
                <FormLabel>Parts</FormLabel>

                <CreatableSelect
                  isClearable
                  options={partsOptions}
                  variant="filled"
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </FormControl>
            )}
          />
          <FormControl id="status">
            <FormLabel>Status</FormLabel>
            <Select
              placeholder="Select..."
              variant="filled"
              {...textField}
              onChange={(e) => {
                textField.onChange(e);
                const specialResult = [
                  "Approved",
                  "Cancelled",
                  "Not Client Approved",
                  "Not Inspected",
                  "Not Stage",
                  "Parts Collected",
                  "Pre-Inspected",
                  "Staged",
                ];
                const selectVal = e.currentTarget.value;

                specialResult.includes(selectVal)
                  ? setStatus(false)
                  : setStatus(true);
              }}
            >
              {statusOptions.map((item) => (
                <option value={item.value} key={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </FormControl>
        </Stack>
        <Stack w="100%" spacing={3} direction={{ base: "column", md: "row" }}>
          <Controller
            control={control}
            name="issue"
            rules={{ required: status }}
            render={({ field: { onChange, onBlur, ref } }) => (
              <FormControl id="issue" w={{ md: "100%", lg: "70%" }}>
                <FormLabel>Issue</FormLabel>
                <CreatableSelect
                  isClearable
                  options={issuesOptions}
                  variant="filled"
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </FormControl>
            )}
          />

          <FormControl id="detail">
            <FormLabel>Detail</FormLabel>
            <Textarea
              size="sm"
              placeholder="Enter detail here"
              rounded="md"
              variant="filled"
              {...register("detail", { required: status })}
            />
          </FormControl>
        </Stack>
        <Stack w="100%" spacing={3} direction={{ base: "column", md: "row" }}>
          <Controller
            control={control}
            name="action"
            rules={{ required: status }}
            render={({ field: { onChange, onBlur, ref } }) => (
              <FormControl id="action">
                <FormLabel>Action Needed</FormLabel>

                <CreatableSelect
                  isClearable
                  options={actionsOptions}
                  variant="filled"
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </FormControl>
            )}
          />

          <Controller
            control={control}
            name="responsible"
            rules={{ required: status }}
            render={({ field: { onChange, onBlur, ref } }) => (
              <FormControl id="responsible">
                <FormLabel>Responsible</FormLabel>
                <CreatableSelect
                  isClearable
                  options={responsibleOptions}
                  variant="filled"
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                />
              </FormControl>
            )}
          />
           <FormControl id="assort">
            <FormLabel>Assort</FormLabel>
            <Input
              type="text"
              placeholder="Assort"
              variant="filled"
              rounded="md"
              {...register("assort", { required: false })}
            />
          </FormControl>
        </Stack>
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
          Add Result
        </Button>
      </VStack>
    </VStack>
  );
}

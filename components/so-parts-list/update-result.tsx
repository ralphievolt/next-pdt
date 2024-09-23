"use client";

import { useForm, Controller } from "react-hook-form";
import React from "react";
import { useSession } from "next-auth/react";
import { CreatableSelect, OptionBase } from "chakra-react-select";
import { useRouter } from "next/navigation";
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
  HStack,
} from "@chakra-ui/react";

import {
  partsAtoms,
  responsibleAtoms,
  actionsAtoms,
  issuesAtoms,
  statusAtoms,
  resultAtom,
  issueStatusAtoms,
  jobMembersAtoms,
} from "@/stores";

import { actionUpdateRound } from "@/app/jobs/sign-off-parts/[id]/actions/update-round";
import { updateIssueStatus } from "@/app/jobs/sign-off-parts/[id]/actions/update-issue-status";

interface IFormInputs {
  shelf: string;
  part: selectOption;
  status: string;
  round: number;

  issue: selectOption;
  detail: string;
  issue_status: selectOption;

  action: selectOption;
  responsible: selectOption;
  assort: string;
  // round: number;
}

interface selectOption extends OptionBase {
  label: string;
  value: string;
}

export default function UpdateForm(props: any) {
  const router = useRouter();
  const toast = useToast();
  const [partsOptions] = useAtom<readonly selectOption[]>(partsAtoms);
  const [actionsOptions] = useAtom<readonly selectOption[]>(actionsAtoms);
  const [issuesOptions] = useAtom<readonly selectOption[]>(issuesAtoms);
  const [statusOptions] = useAtom<readonly selectOption[]>(statusAtoms);
  const [issueStatusOptions] =
    useAtom<readonly selectOption[]>(issueStatusAtoms);

  const [responsibleOptions] =
    useAtom<readonly selectOption[]>(jobMembersAtoms);

  const [result] = useAtom(resultAtom);

  const [isPending, startTransition] = React.useTransition();
  const [isPendingIssue, startTransitionIssue] = React.useTransition();

  const {
    control,
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IFormInputs>({
    defaultValues: {
      shelf: result.shelf,
      part: { value: result.part, label: result.part },
      status: result.status,
      round: result.round,

      issue: { value: result.issue, label: result.issue },
      detail: result.detail,
      issue_status: { value: result.issue_status, label: result.issuestatus },

      action: { value: result.action, label: result.action },
      responsible: { value: result.responsible, label: result.responsible },
      assort: result.assort,
    },
  });

  const [status, setStatus] = React.useState<boolean>(true);
  const [adding, setAdding] = React.useState(false);
  const textField = register("status", { required: true });
  const { data: session } = useSession();
  const [round, setRound] = React.useState(false);

  const updateResult = async (data: any) => {
    if (session?.user?.role === "viewer") {
      toast({
        title: "UnAuthorised!",
        description: "Your access is view only",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
        containerStyle: {
          color: "purple.500",
        },
      });

      return;
    }

    setAdding(true);

    if (data.status === "Approved" && data.issue_status === "Open") {
      toast({
        title: "Add Result Error",
        description: "Issue status is not close yet. Please check!",
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
    }

    if (data.issue_status === "Open" && data.responsible === "") {
      toast({
        title: "Add Result Error",
        description: "Issue does not have responsible person assigned!",
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
    }

    if (result.hasOwnProperty("date_started"))
      data.date_started = result.date_started;

    const res = await fetch(`${props.job_id}/api/update-result/`, {
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
        description: "Result successfully updated.",
        status: "success",
        duration: 5000,
        position: "top-right",
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });

      router.refresh();
    } else if (res.status === 500) {
      toast({
        title: "Result Error",
        description: "Error in updating your new result. Please try again!",
        status: "error",
        duration: 5000,
        position: "top-right",
        isClosable: true,
        containerStyle: {
          color: "purple.500",
        },
      });
    }
    setAdding(false);
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
        let resultString = {
          ...data,
          part: data.part.value,
          issue: data.issue.value,
          action: data.action.value,
          responsible: data.responsible.value,
          issue_status: data.issue_status.value,
        };

  
        updateResult({ ...resultString, key: result.key });
      })}
    >
      <VStack spacing={4} w="100%">
        <Stack w="100%" spacing={4} direction={{ base: "column", md: "row" }}>
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
                  // variant="filled"
                  ref={ref}
                  onChange={onChange}
                  onBlur={onBlur}
                  defaultValue={partsOptions.find(
                    ({ value }) => value === result.part
                  )}
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
          <FormControl id="round">
            <FormLabel>SO Round in days (num)</FormLabel>

            <Input
              type="number"
              placeholder="number"
              variant="filled"
              rounded="md"
              // w={100}
              {...register("round", { required: true })}
            />
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
                  defaultValue={issuesOptions.find(
                    ({ value }) => value === result.issue
                  )}
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
              {...register("detail", { required: false })}
            />
          </FormControl>
          <Controller
            control={control}
            name="issue_status"
            rules={{ required: status }}
            render={({ field: { onChange, onBlur, ref } }) => (
              <FormControl id="issue" w={{ md: "100%", lg: "70%" }}>
                <FormLabel>Issue Status</FormLabel>
                <CreatableSelect
                  isClearable
                  options={issueStatusOptions}
                  variant="filled"
                  ref={ref}
                  onChange={(val) => {
                    onChange(val);
                    startTransitionIssue(async () => {
                      const jobsServer = await updateIssueStatus(
                        val,
                        props.job_id,
                        result.key
                      );

                      if (jobsServer)
                        toast({
                          title: "Issue Status Update",
                          description: "Successfully updated.",
                          status: "success",
                          duration: 5000,
                          isClosable: true,
                          position: "top-right",
                          containerStyle: {
                            color: "purple.500",
                          },
                        });
                    });
                  }}
                  onBlur={onBlur}
                  defaultValue={issueStatusOptions.find(
                    ({ value }) => value === result.issue_status
                  )}
                />
              </FormControl>
            )}
          />
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
                  defaultValue={actionsOptions.find(
                    ({ value }) => value === result.action
                  )}
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
                  defaultValue={responsibleOptions.find(
                    ({ value }) => value === result.responsible
                  )}
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
              {...register("assort", { required: true })}
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
          isLoading={adding || isPendingIssue}
          loadingText="Adding"
        >
          Add Result
        </Button>
      </VStack>
    </VStack>
  );
}

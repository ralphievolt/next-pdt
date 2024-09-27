import * as React from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { JobsTable } from "../../table-utils/jobs-table";
import { JobsListProps, JobsList } from "../../Jobs.types";
import dayjs from "dayjs";
import { Tag } from "@chakra-ui/react";

const columnHelper = createColumnHelper<JobsList>();

const columns = [
  columnHelper.accessor("job_number", {
    cell: (info) => info.getValue(),
    header: "Job",
  }),
  columnHelper.accessor("brand", {
    cell: (info) => info.getValue(),
    header: "Brand",
  }),
  columnHelper.accessor("rate", {
    cell: (info) => {
      if (info.getValue() === 100) {
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="green.400"
            
          >
            {info.getValue()} %
          </Tag>
        );
      } else if (info.getValue() > 50 && info.getValue() < 100) {
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="purple.300"
            // color="gray"
            
          >
            {info.getValue()} %
          </Tag>
        );
      } else
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="red.300"
            
          >
            {info.getValue()} %
          </Tag>
        );
    },
    header: "Completion",
  }),
  columnHelper.accessor("state", {
    cell: (info) => {
      if (info.getValue() === "Ready for Staging")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="gray.400"
            color="white"
            
          >
            {info.getValue()}
          </Tag>
        );

      if (info.getValue() === "Staged")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="red.300"
            
          >
            {info.getValue()}
          </Tag>
        );

      if (info.getValue() === "Awaiting SS")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="cyan.300"
            color="gray.900"
            
          >
            {info.getValue()}
          </Tag>
        );


      if (info.getValue() === "Scheduled")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="yellow.100"
            color="gray.900"
            
          >
            {info.getValue()}
          </Tag>
        );

      if (info.getValue() === "In-progress")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="purple.300"
            
          >
            {info.getValue()}
          </Tag>
        );

      if (info.getValue() === "Signed-off")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="green.400"
            
          >
            {info.getValue()}
          </Tag>
        );
      if (info.getValue() === "Delivered")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="blue.500"
            
          >
            {info.getValue()}
          </Tag>
        );

      if (info.getValue() === "Production Recall")
        return (
          <Tag
            size={"md"}
            variant="solid"
            bg="red.600"
            
          >
            {info.getValue()}
          </Tag>
        );



    },
    header: "Status",
  }),

  columnHelper.accessor("so_date", {
    cell: (info) => {

      if (dayjs(info.getValue()).isValid()) return dayjs(info.getValue()).format("MMM DD, YYYY h:mm");
      return <>---</>
    },
    header: "Signed-off Date",
  }),
  columnHelper.accessor("delivered_date", {
    cell: (info) => {
      if (dayjs(info.getValue()).isValid()) return dayjs(info.getValue()).format("MMM DD, YYYY h:mm");
      return <>---</>
    },
    header: "Delivered Date",
  }),
  columnHelper.accessor("last_update", {
    cell: (info) => dayjs(info.getValue()).format("MMM DD, YYYY h:mm"),
    header: "Date Updated",
  }),
  columnHelper.accessor("updated_by", {
    // cell: (info) => {
    //   let pos = info.getValue().indexOf("@");
    //   let person = info.getValue().substring(0, pos);
    //   return person;
    // },
    cell: (info) => info.getValue(),
    header: "Updated by",
  }),
];

export default function JobList(props: JobsListProps) {
  return <JobsTable columns={columns} data={props.jobslist} />;

}

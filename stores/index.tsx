import { atom, useAtom } from 'jotai';

export const scanloc = atom<string>("");

export const partsAtoms = atom([
  {
    value: "Templates",
    label: "Templates",
  },
  {
    value: "Top Template",
    label: "Top Template",
  },
  {
    value: "Bottom Template",
    label: "Bottom Template",
  },
  {
    value: "Vacform",
    label: "Vacform",
  },
  {
    value: "Graphic Holder",
    label: "Graphic Holder",
  },
  {
    value: "Merchandiser",
    label: "Merchandiser",
  },
  {
    value: "Glorifier",
    label: "Glorifier",
  },
  {
    value: "Product Holder",
    label: "Product Holder",
  },
  {
    value: "Backstock",
    label: "Backstock",
  },
  {
    value: "Typesafety",
    label: "Typesafety",
  },
  {
    value: "Riser",
    label: "Riser",
  },
  {
    value: "Divider",
    label: "Divider",
  },
  {
    value: "Spacer",
    label: "Spacer",
  },
]);

export const responsibleAtoms = atom([
  {
    value: "PM",
    label: "Project Manager",
  },
  {
    value: "BU Detailer",
    label: "BU Detailer",
  },
  {
    value: "MS Detailer",
    label: "MS Detailer",
  },
  {
    value: "Model Maker",
    label: "Model Maker",
  },
  {
    value: "SO Coordinator",
    label: "SO Coordinator",
  },
  {
    value: "Vac Tooling",
    label: "Vac Tooling",
  },
  {
    value: "TS/Laser Cutter",
    label: "TS/Laser Cutter",
  },
  {
    label: "QA",
    value: "QA",
  },
  {
    label: "NA",
    value: "NA",
  },
]);

export const actionsAtoms = atom([
  {
    value: "Correct Adhesion/Taping Method",
    label: "Correct Adhesion/Taping Method",
  },
  {
    value: "Correct Material Finishing",
    label: "Correct Material Finishing",
  },
  {
    value: "Pull New Vacform",
    label: "Pull New Vacform",
  },
  {
    value: "Recut Part",
    label: "Recut Part",
  },

  {
    value: "Recut Typesafety",
    label: "Recut Typesafety",
  },
  {
    value: "Recut Vacform",
    label: "Recut Vacform",
  },
  {
    value: "Remake Sample",
    label: "Remake Sample",
  },
  {
    value: "Revise Part",
    label: "Revise Part",
  },
  {
    value: "Revise Typesafety",
    label: "Revise Typesafety",
  },

  {
    value: "Revise Vacform",
    label: "Revise Vacform",
  },
  {
    value: "Stage Parts Completely",
    label: "Stage Parts Completely",
  },
  {
    value: "Update EPP",
    label: "Update EPP",
  },
  {
    value: "Update POG",
    label: "Update POG",
  },
  {
    label: "NA",
    value: "NA",
  },
]);

export const issuesAtoms = atom([
  {
    label: "Design Revision",
    value: "Design Revision",
  },
  {
    label: "Incorrect Adhesion/Taping Method",
    value: "Incorrect Adhesion/Taping Method",
  },
  {
    label: "Incorrect Finish",
    value: "Incorrect Finish",
  },
  {
    label: "Incorrect Material Information",
    value: "Incorrect Material Information",
  },
  {
    label: "Incorrect Part Dimension",
    value: "Incorrect Part Dimension",
  },
  {
    label: "Job Not Stage Completely",
    value: "Job Not Stage Completely",
  },
  {
    label: "Missing",
    value: "Missing",
  },
  {
    label: "Missing Dimension",
    value: "Missing Dimension",
  },
  {
    label: "Missing Dimension View",
    value: "Missing Dimension View",
  },
  {
    label: "Missing Material Information",
    value: "Missing Material Information",
  },
  {
    label: "Missing PD Number",
    value: "Missing PD Number",
  },
  {
    label: "Missing Product",
    value: "Missing Product",
  },
  {
    label: "No Tolerance",
    value: "No Tolerance",
  },
  {
    label: "Part fit & function",
    value: "Part fit & function",
  },
  {
    label: "Product fit & function",
    value: "Product fit & function",
  },
  {
    label: "Product PM confirmation",
    value: "Product PM confirmation",
  },
  {
    label: "Staging Not Complete",
    value: "Staging Not Complete",
  },
  {
    label: "TS fit & function",
    value: "TS fit & function",
  },
  {
    label: "Wrong Layout",
    value: "Wrong Layout",
  },
  {
    label: "Wrong Material",
    value: "Wrong Material",
  },
  {
    label: "Wrong Part Number",
    value: "Wrong Part Number",
  },
  {
    label: "Wrong PD Number",
    value: "Wrong PD Number",
  },
  {
    label: "Wrong Product Description",
    value: "Wrong Product Description",
  },
  {
    label: "NA",
    value: "NA",
  },
]);

export const qctAtoms = atom([
  {
    label: "Incorrect Dimension",
    value: "Incorrect Dimension",
  },
  {
    label: "Missing Revision table",
    value: "Missing Revision table",
  },
  {
    label: "Missing/Incorrect Material Information",
    value: "Missing/Incorrect Material Information",
  },
  {
    label: "Missing/Incorrect Gluing/Finishing/Fastening Information",
    value: "Missing/Incorrect Gluing/Finishing/Fastening Information",
  },
  {
    label: "Missing PD number",
    value: "Missing PD number",
  },
  {
    label: "Missing/Incorrect Product Name",
    value: "Missing/Incorrect Product Name",
  },
  {
    label: "Missing/Incorrect Notes",
    value: "Missing/Incorrect Notes",
  },
  {
    label: "Missing/Incorrect Assembly Instructions",
    value: "Missing/Incorrect Assembly Instructions",
  },
  {
    label: "Missing Material Information",
    value: "Missing Material Information",
  },
]);

export const issueStatusAtoms = atom([
  {
    value: "Open",
    label: "Open",
  },
  {
    value: "WIP",
    label: "WIP",
  },
  {
    value: "Closed",
    label: "Closed",
  },
]);

export const statusAtoms = atom([
  {
    value: "Approved",
    label: "Approved",
  },
  {
    value: "Rejected",
    label: "Rejected",
  },
  {
    value: "Not Client Approved",
    label: "Not Client Approved",
  },
  {
    value: "Not Inspected",
    label: "Not Inspected",
  },
  {
    value: "Pre-Inspected",
    label: "Pre-Inspected",
  },
  {
    value: "Not Stage",
    label: "Not Stage",
  },
  {
    value: "Staged",
    label: "Staged",
  },
  {
    value: "Parts Collected",
    label: "Parts Collected",
  },
  {
    value: "Cancelled",
    label: "Cancelled",
  },
]);

export const stateAtoms = atom([
  {
    value: "Ready for Staging",
    label: "Ready for Staging",
  },
  {
    value: "Staged",
    label: "Staged",
  },
  {
    value: "Scheduled",
    label: "Scheduled",
  },
  {
    value: "Signed-off",
    label: "Signed-off",
  },
  {
    value: "Delivered",
    label: "Delivered",
  },
  {
    value: "Production Recall",
    label: "Production Recall",
  },
]);

export const jobIdAtom = atom("");
export const resultAtom = atom();

export const deliveryAtoms = atom([
  {
    value: "Vacforming",
    label: "Vacforming",
  },
  {
    value: "Machine Shop",
    label: "Machine Shop",
  },
]);

export const deliveryStatusAtoms = atom([
  {
    value: "Complete",
    label: "Complete",
  },
  {
    value: "Partial",
    label: "Partial",
  },
  {
    value: "Declined",
    label: "Declined",
  },
  {
    value: "Not Received",
    label: "Not Received",
  },
]);

export const didAtoms = atom({
  _id: "",
  job_number: 0,
});

export const userRolesAtoms = atom([
  {
    value: "admin",
    label: "admin",
  },
  {
    value: "user",
    label: "user",
  },
  {
    value: "proj_manager",
    label: "proj_manager",
  },
  {
    value: "engineer1", // only his task
    label: "engineer1",
  },
  {
    value: "engineer2", //see all engineering task
    label: "engineer2",
  },
  {
    value: "maker",
    label: "maker",
  },
  {
    value: "viewer",
    label: "viewer",
  },
  {
    value: "delivery", //delivery scanning + vactooling + vactool + machine shop
    label: "delivery",
  },
  {
    value: "cnc", // cnc users dashboad
    label: "cnc",
  },
  {
    value: "handler", // future material handler
    label: "handler",
  },
  {
    value: "inactive",
    label: "inactive",
  },
]);

export const jobMembersAtoms = atom()

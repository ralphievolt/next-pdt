import { atom, useAtom } from 'jotai';

export const scanloc = atom<string>('');
export const partFormAtom = atom<string>('');
export const actionFormAtom = atom<string>('');
export const issueFormAtom = atom<string>('');
export const stateFormAtom = atom<string>('');

export const actionsAtom = atom([
  'Correct Adhesion/Taping Method',
  'Correct Material Finishing',
  'Pull New Vacform',
  'Recut Part',
  'Recut Typesafety',
  'Recut Vacform',
  'Remake Sample',
  'Revise Part',
  'Revise Typesafety',
  'Revise Vacform',
  'Stage Parts Completely',
  'Update EPP',
  'Update POG',
  'Update PP',
]);

export const partsAtom = atom([
  'Templates',
  'Top Template',
  'Bottom Template',
  'Vacform',
  'Graphic Holder',
  'Merchandiser',
  'Typesafety',
  'Glorifier',
  'Product Holder',
  'Backstock',
  'Riser',
  'Divider',
  'Spacer',
]);

export const issuesAtom = atom([
  'Design Revision',
  'Incorrect Adhesion/Taping Method',
  'Incorrect Finish',
  'Incorrect Material Information',
  'Incorrect Part Dimension',
  'Job Not Stage Completely',
  'Missing Dimension View',
  'Missing Dimension',
  'Missing Material Information',
  'Missing PD Number',
  'Missing Product',
  'No Tolerance',
  'Part fit & function',
  'Product fit & function',
  'Product PM confirmation',
  'Staging Not Complete',
  'TS fit & function',
  'Wrong Layout',
  'Wrong Material',
  'Wrong Part Number',
  'Wrong PD Number',
  'Wrong Product Description',
]);

export const statesAtom = atom([
  {
    value: 'Ready for Staging',
    label: 'Ready for Staging',
  },
  {
    value: 'Staged',
    label: 'Staged',
  },
  {
    value: 'Scheduled',
    label: 'Scheduled',
  },
  {
    value: 'Signed-off',
    label: 'Signed-off',
  },
  {
    value: 'Delivered',
    label: 'Delivered',
  },
  {
    value: 'Production Recall',
    label: 'Production Recall',
  },
]);

export const responsibleAtoms = atom([
  {
    value: 'PM',
    label: 'Project Manager',
  },
  {
    value: 'BU Detailer',
    label: 'BU Detailer',
  },
  {
    value: 'MS Detailer',
    label: 'MS Detailer',
  },
  {
    value: 'Model Maker',
    label: 'Model Maker',
  },
  {
    value: 'SO Coordinator',
    label: 'SO Coordinator',
  },
  {
    value: 'Vac Tooling',
    label: 'Vac Tooling',
  },
  {
    value: 'TS/Laser Cutter',
    label: 'TS/Laser Cutter',
  },
  {
    label: 'QA',
    value: 'QA',
  },
  {
    label: 'NA',
    value: 'NA',
  },
]);

export const qctAtoms = atom([
  {
    label: 'Incorrect Dimension',
    value: 'Incorrect Dimension',
  },
  {
    label: 'Missing Revision table',
    value: 'Missing Revision table',
  },
  {
    label: 'Missing/Incorrect Material Information',
    value: 'Missing/Incorrect Material Information',
  },
  {
    label: 'Missing/Incorrect Gluing/Finishing/Fastening Information',
    value: 'Missing/Incorrect Gluing/Finishing/Fastening Information',
  },
  {
    label: 'Missing PD number',
    value: 'Missing PD number',
  },
  {
    label: 'Missing/Incorrect Product Name',
    value: 'Missing/Incorrect Product Name',
  },
  {
    label: 'Missing/Incorrect Notes',
    value: 'Missing/Incorrect Notes',
  },
  {
    label: 'Missing/Incorrect Assembly Instructions',
    value: 'Missing/Incorrect Assembly Instructions',
  },
  {
    label: 'Missing Material Information',
    value: 'Missing Material Information',
  },
]);

export const issueStatusAtoms = atom([
  {
    value: 'Open',
    label: 'Open',
  },
  {
    value: 'WIP',
    label: 'WIP',
  },
  {
    value: 'Closed',
    label: 'Closed',
  },
]);

export const statusAtoms = atom([
  {
    value: 'Approved',
    label: 'Approved',
  },
  {
    value: 'Rejected',
    label: 'Rejected',
  },
  {
    value: 'Staged',
    label: 'Staged',
  },
  {
    value: 'Client Approved',
    label: 'Client Approved',
  },
  {
    value: 'Pre-Inspected',
    label: 'Pre-Inspected',
  },

  {
    value: 'Not Stage',
    label: 'Not Stage',
  },
  {
    value: 'Not Client Approved',
    label: 'Not Client Approved',
  },
  {
    value: 'Not Inspected',
    label: 'Not Inspected',
  },

  {
    value: 'Parts Collected',
    label: 'Parts Collected',
  },
  {
    value: 'Cancelled',
    label: 'Cancelled',
  },
]);

export const jobIdAtom = atom('');
export const resultAtom = atom();

export const deliveryAtoms = atom([
  {
    value: 'Vacforming',
    label: 'Vacforming',
  },
  {
    value: 'Machine Shop',
    label: 'Machine Shop',
  },
]);

export const deliveryStatusAtoms = atom([
  {
    value: 'Complete',
    label: 'Complete',
  },
  {
    value: 'Partial',
    label: 'Partial',
  },
  {
    value: 'Declined',
    label: 'Declined',
  },
  {
    value: 'Not Received',
    label: 'Not Received',
  },
]);

export const didAtoms = atom({
  _id: '',
  job_number: 0,
});

export const userRolesAtoms = atom([
  {
    value: 'admin',
    label: 'admin',
  },
  {
    value: 'user',
    label: 'user',
  },
  {
    value: 'proj_manager',
    label: 'proj_manager',
  },
  {
    value: 'engineer1', // only his task
    label: 'engineer1',
  },
  {
    value: 'engineer2', //see all engineering task
    label: 'engineer2',
  },
  {
    value: 'maker',
    label: 'maker',
  },
  {
    value: 'viewer',
    label: 'viewer',
  },
  {
    value: 'delivery', //delivery scanning + vactooling + vactool + machine shop
    label: 'delivery',
  },
  {
    value: 'cnc', // cnc users dashboad
    label: 'cnc',
  },
  {
    value: 'handler', // future material handler
    label: 'handler',
  },
  {
    value: 'inactive',
    label: 'inactive',
  },
]);

export const jobMembersAtoms = atom();

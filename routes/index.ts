function path(root: string, sublink: string) {
  return `${root}${sublink}`;
}

const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_TASKS = '/tasks';
const ROOTS_AUTH = '/authentication';
const ROOTS_INVENTORY_ITEMS = '/inventory/items';
const ROOTS_INVENTORY_LOCATIONS = '/inventory/locations';
const ROOTS_INVENTORY = '/inventory';

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  default: path(ROOTS_DASHBOARD, '/default'),
};

export const PATH_INVENTORY_ITEMS = {
  default: path(ROOTS_INVENTORY_ITEMS, '/list'),
  register: path(ROOTS_INVENTORY_ITEMS, '/register'),
};

export const PATH_INVENTORY_LOCATIONS = {
  default: path(ROOTS_INVENTORY_LOCATIONS, '/list'),
  register: path(ROOTS_INVENTORY_LOCATIONS, '/register'),
};

export const PATH_INVENTORY_QR = {
  default: path(ROOTS_INVENTORY, '/scan-qr'),
};

export const PATH_TASKS = {
  root: ROOTS_TASKS,
};

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  signin: path(ROOTS_AUTH, '/signin'),
  signup: path(ROOTS_AUTH, '/signup'),
  passwordReset: path(ROOTS_AUTH, '/password-reset'),
};

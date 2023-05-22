import { INavData } from './gp-sidebar-nav';

export const navItemsMainMenu: INavData[] = [
  {
    title: true,
    label: 'APP.MENU.Dashboard',
    path: 'dashboard',
    url: '/dashboard',
    icon: 'dashboard',
    permission: 'DASHBOARD',
    attributes: { disabled: false }
  },
];

import { ExtendedFabClass } from 'projects/link-lab/src/lib/it/link/classes/definitions';
import { Tools } from 'projects/tools/src/lib/tools.service';


export enum ActionType {
  Global = 'Global',
  Transit = 'Transit',
  Context = 'Context',
  TwinContext = 'TwinContext',
  Menu = 'Menu',
  Message = 'Message',
  Main = 'Main'
}

export enum ActionArea {
  Default = 'Default',
  Home = 'Home',
  Journals = 'Journals',
  JournalDetails = 'JournalDetails',
  Payments = 'Payments',
  PaymentDetails = 'PaymentDetails',
  Organizations = 'Organizations',
  OrganizationDetails = 'OrganizationDetails',
  Announcements = 'Announcements',
  AnnouncementDetails = 'AnnouncementDetails',
  Competitions = 'Competitions',
  CompetitionDetails = 'CompetitionDetails',
  Candidacies = 'Candidacies',
  CandidacieDetails = 'CandidacieDetails',
  Transactions = 'Transactionss',
  TransactionsDetails = 'TransactionsDetails'
}

const noFilter: () => {} = () => {
  return true;
};

const DownloadPDF: any[] = [
  { value: 'download', label: 'Visualizza scheda' }
];

export function DefaultAction(): any {
  return {
    [ActionType.Main]: { Action: null, Filter: noFilter },
    [ActionType.Global]: { Actions: [], Filter: noFilter },
    [ActionType.Menu]: { Actions: [], Filter: noFilter },
    [ActionType.Message]: '',
    [ActionType.Context]: { Actions: [], Filter: noFilter },
    [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
  };
}

export const MatMenuDivider: any = { value: 'mat-divider', label: '' };
export const SearchOnly: any[] = [{ icon: 'search', toggle: 'search_off' }];
export const RicercaToggleOpen: any = { icon: 'search_off', toggle: 'search' };
export const ViewListToggleMode: any = { icon: 'view_list', toggle: 'view_module' };

export let ToolbarActions: any;
export const ActionsUpdate: () => void = () => {
  ToolbarActions = {
    [ActionArea.Default]: DefaultAction(),
    [ActionArea.Home]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [{ icon: 'search', toggle: 'search_off' }], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Journals]: {
      // [ActionType.Main]: { Action: new ExtendedFabClass({ icon: 'add', label: 'Nuovo Giornale' }), Filter: noFilter },
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [{ icon: 'search', toggle: 'search_off' }], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.JournalDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Payments]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.PaymentDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Organizations]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.OrganizationDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Announcements]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.AnnouncementDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Competitions]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [{ icon: 'search', toggle: 'search_off' }], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.CompetitionDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Candidacies]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [{ icon: 'search', toggle: 'search_off' }], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.CandidacieDetails]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
    [ActionArea.Transactions]: {
      [ActionType.Main]: { Action: null, Filter: noFilter },
      [ActionType.Global]: { Actions: [{ icon: 'search', toggle: 'search_off' }], Filter: noFilter },
      [ActionType.Menu]: { Actions: [], Filter: noFilter },
      [ActionType.Message]: '',
      [ActionType.Context]: { Actions: [], Filter: noFilter },
      [ActionType.TwinContext]: { Actions: [], Filter: noFilter }
    },
  };
};

export function ResetDefault(): any {
  SetToolsPropertyByID(ActionArea.Default, DefaultAction());
}

export function GetToolsByID(value: string | ActionArea, hrefs: any, preserveQuery: boolean = false): any {
  let cfg: any = ToolbarActions.Default;
  const ref: string | ActionArea = !preserveQuery ? (value || '').toString().split('?')[0] : value;
  Object.keys(hrefs).some((hKey: string) => {
    if ((hrefs[hKey].url === ref || hKey === ref) && ToolbarActions.hasOwnProperty(hKey)) {
      cfg = ToolbarActions[hKey];
      return true;
    }
    return false;
  });
  return cfg;
}

export function SetToolsPropertyByID(property: ActionArea, value: any) {
  ToolbarActions[property] = value;
}

export function GetToolsActionType(area: ActionArea, type: ActionType): any {
  let cfg: any = ToolbarActions.Default;
  if (ToolbarActions.hasOwnProperty(area.toString()) && ToolbarActions[area.toString()].hasOwnProperty(type.toString())) {
    cfg = ToolbarActions[area.toString()][type.toString()];
  }
  return cfg;
}

export function SetToolsActionType(area: ActionArea, type: ActionType, value: any) {
  if (ToolbarActions.hasOwnProperty(area.toString()) && ToolbarActions[area.toString()].hasOwnProperty(type.toString())) {
    ToolbarActions[area.toString()][type.toString()] = value;
  }
}

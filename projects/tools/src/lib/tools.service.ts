import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { MultiSnackbarComponent } from 'projects/components/src/lib/dialogs/multi-snackbar/multi-snackbar.component';
import { GridFormatters } from './utils/grid-formatters';
import { FieldClass, FieldLinksClass } from 'projects/link-lab/src/lib/it/link/classes/definitions';

import cssVars from 'css-vars-ponyfill';

import { Subscription } from 'rxjs';

import * as moment from 'moment';
declare const $: any;

@Injectable({
  providedIn: 'root'
})
export class Tools {

  public static EmergencyCall: Subscription[] = [];
  protected static Spinner: boolean = false;
  protected static SpinnerCount: number = 0;
  protected static SpinnerGlobal: boolean = false;

  public static Versione: string;

  public static TaxonomiesPagoPA: any[] = [];

  // Utente di sessione
  public static USER_LOGGED: any;

  static translate: any;

  public static Applications: any[] = [];
  public static CurrentApplication: any;

  constructor(
    private translate: TranslateService
  ) { }

  getSpinner(): any {
    return Tools.Spinner;
  }

  isSpinnerGlobal(): any {
    return Tools.SpinnerGlobal;
  }

  public static WaitForResponse(value: boolean = true, ecall: boolean = false, global: boolean = true) {
    Tools.SpinnerGlobal = global;
    Tools.SpinnerCount = (value) ? Tools.SpinnerCount + 1 : Tools.SpinnerCount - 1;
    if (!Tools.Spinner || Tools.SpinnerCount <= 0 || ecall) {
      Tools.Spinner = value;
      if (Tools.SpinnerCount < 0 || ecall) {
        Tools.SpinnerCount = 0;
      }
      if (Tools.SpinnerCount === 0 && Tools.EmergencyCall) {
        Tools.EmergencyCall.forEach(ec => ec.unsubscribe());
        Tools.EmergencyCall = [];
      }
    }
  }

  public static SetThemeColors(colors: any) {
    if (colors) {
      const _options: any = {
        variables: {}
      };
      const rex: any = /^#[abcdefABCDEF0-9]{6}$/;
      if (colors.Variables) {
        Object.keys(colors.Variables).forEach((key: any) => {
          const color = colors.Variables[key];
          if (color && color.search(rex) !== -1) {
            document.documentElement.style.setProperty(key, color);
            _options.variables[key] = color;
          }
        });
      }
      cssVars(_options);
    }
  }

  public static formatValue(value: any, data: any, html: boolean = true, options: any = null): string {
    switch (data.type) {
      case 'number':
        return GridFormatters.numberFormatter({ value: value }, html);
      case 'date':
        return GridFormatters.dateFormatter({ value: value, format: data.format || 'DD-MM-YYYY' }, html);
      case 'currency':
        return GridFormatters.currencyFormatter({ value: value }, html);
      case 'progress':
        return html ? GridFormatters.progressFormatter({ value: value }) : value;
      case 'tag':
        return GridFormatters.typeTagFormatter({ field: data, value: value, optionsName: data.options, options: options });
      default:
        return value;
    }
  }

  public static simpleItemFormatter(fields: any[], data: any, options: any = null, join: string = ' · ') {
    const $this = this;
    const results: string[] = [];
    fields.forEach(field => {
      const value = Tools.getObjectValue(data, field.field); // data[field.field]
      switch (field.type) {
        case 'number':
          results.push(GridFormatters.numberFormatter({ value: value }, false));
          break;
        case 'currency':
          results.push(GridFormatters.currencyFormatter({ value: value }, false));
          break;
        case 'date':
          results.push(GridFormatters.dateFormatter({ value: value, format: field.format }, false));
          break;
        case 'progress':
          results.push(GridFormatters.progressFormatter({ value: value }));
          break;
        case 'message':
          results.push(field.field);
          break;
        case 'currentDate':
          results.push(moment().format(field.format));
          break;
        case 'status':
          results.push(GridFormatters.statusFormatter({ value: value, options: options }));
          break;
        case 'label':
          results.push(GridFormatters.typeLabelFormatter({ field: field.field, value: value, optionsName: field.options, options: options }));
          break;
        case 'cardinal':
          results.push(`#${value}`);
          break;
        default:
          results.push(value);
      }
    });
    return results.join(join);
  }

  public static generateFields(fields: any, data: any, empty: boolean | string = false, options: any = null) {
    const _list: any[] = [];
    fields.map((field: any) => {
      if (field.type === 'download') {
        _list.push(new FieldClass({ label: 'APP.LABEL.Content', value: field.field, download: true, icon: 'download', json: data }));
      } else {
        const value = Tools.getObjectValue(data, field.field); // data[field.field]
        if (value) {
          _list.push(new FieldClass({ label: field.label, value: Tools.formatValue(value, field, false, options), json: data }));
        } else {
          if (empty) {
            _list.push(new FieldClass({ label: field.label, value: empty, json: data }));
          }
        }
      }
    });
    return _list;
  }

  public static getObjectValue(obj: any, path: string): any {
    if (!path) { return obj; }
    const properties: string[] = path.split('.');
    const first = properties.shift() || '';
    const _objFirst = (typeof obj[first] === 'boolean') ? obj[first].toString() : obj[first];
    return _objFirst ? this.getObjectValue(obj[first], properties.join('.')) : '';
  }

  public static ScrollTo(offset: number, callback: Function | null = null) {
    setTimeout(() => {
      const $routeSection: any = $('#route-section');
      if ($routeSection && $routeSection.length !== 0) {
        $routeSection.animate({
          scrollTop: offset
        }, 800, () => {
          if (callback) {
            callback();
          }
        });
      }
    }, 250);
  }

  public static ScrollElement(elementId: string, offset: number, callback: Function | null = null) {
    setTimeout(() => {
      const $section: any = $(`#${elementId}`);
      if ($section && $section.length !== 0) {
        $section.animate({
          scrollTop: offset
        }, 400, () => {
          if (callback) {
            callback();
          }
        });
      }
    }, 250);
  }

  public static GetErrorMsg(error: any) {
    let _msg = 'Warning: status ' + error.status;
    const _msgA: string[] = [];
    try {
      if (error.error && (error.error.title || error.error.detail)) {
        if (error.error.title) {
          _msgA.push(error.error.title);
        }
        if (error.error.detail) {
          _msgA.push(error.error.detail);
        }
        _msg = _msgA.join(' - ');
      } else {
        if (error.status !== 0 && error.statusText) {
          _msg = error.status + ': ' + error.statusText;
          if (error.status === 404) {
            _msg += error.url ? ` ${error.url.split('?')[0]}` : '';
          }
        } else {
          _msg = error.message;
        }
      }
      if (error.name && !error.error) {
        _msg = this.translate.instant(`APP.MESSAGE.ERROR.${error.name}`);
      }
    } catch (e) {
      _msg = 'Si è verificato un problema non previsto.';
    }

    return _msg;
  }

  public static MultiSnackbarDestroyAll() {
    MultiSnackbarComponent.DestroyAllStickyMessages();
  }

  /**
   * On error handler
   * @param error
   * @param {string} customMessage
   */
  public static OnError(error: any, customMessage?: string) {
    let _msg = 'Warning: status ' + error.status;
    const _keep: boolean = false;
    const _msgA: string[] = [];
    try {
      if (customMessage) {
        _msg = customMessage;
      } else {
        _msg = Tools.GetErrorMsg(error);
      }
      if (_msg.length > 200) {
        _msg = _msg.substring(0, 200);
      }
    } catch (e) {
      _msg = 'Si è verificato un problema non previsto.';
    }
    MultiSnackbarComponent.PushMessage((_msg || error.message), true, _keep);
    // Tools.Alert(_msg || error.message);
  }

  /**
   * Hex to RGB
   * @param {string} hex
   * @returns {any} { r: number; g: number; b: number }
   * @constructor
   */
  public static HexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }

  public static IsBase64(str: any): boolean {
    if (str === undefined || str === null || str === '' || str.trim() === '') {
      return false;
    }
    try {
      return (str.fromBase64().toBase64() === str);
    } catch (err) {
      return false;
    }
  }

  static DateFormatByLanguage(timestamp: boolean = false): string {
    let currentFormat = '';
    switch (this.translate.currentLang) {
      case 'en':
        currentFormat = timestamp ? 'YYYY/MM/DD, HH:mm:ss' : 'YYYY/MM/DD';
        break;
      case 'it':
        currentFormat = timestamp ? 'DD-MM-YYYY, HH:mm:ss' : 'DD-MM-YYYY';
        break;
      default:
        currentFormat = timestamp ? 'DD-MM-YYYY, HH:mm:ss' : 'DD-MM-YYYY';
    }
    return currentFormat;
  }

  getNumberFormatByLanguage(): string {
    let currentFormat = '';
    switch (this.translate.currentLang) {
      case 'en':
        currentFormat = 'en-US';
        break;
      case 'it':
        currentFormat = 'it-IT';
        break;
      default:
        currentFormat = 'it-IT';
    }
    return currentFormat;
  }

  dateFormat(date: string, format: string = 'YYYY-MM-DD', timestamp: boolean = false) {
    return (moment(date, format).format(Tools.DateFormatByLanguage()));
  }

  /**
   * Numero in formato valuta €
   * @param value
   * @returns
   */
  currencyFormat(value: number): string {
    if (!isNaN(value)) {
      let currency;
      try {
        currency = new Intl.NumberFormat(this.getNumberFormatByLanguage(), {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }).format(value);
      } catch (e) {
        currency = 'n/a';
      }
      return '€ ' + currency;
    }
    return '';
  }

  public static DecodeB64(str: string): string {
    try {
      return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
    } catch (e) {
      console.log('Formato non corretto');
      return '';
    }
  }

  B64toBlob(b64Data: any, contentType: string = '', sliceSize: number = 512): any {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });

    return blob;
  }

  public static GetFilenameFromHeader(response: any): string {
    let name: string = '';
    if (response) {
      const _cd = response.headers.get('content-disposition');
      const _re = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/gm;
      const _results = _re.exec(_cd);
      if (_results && _results[1]) {
        name = _results[1].replace(/['"]/g, '');
      }
    }

    return name;
  }

  /**
   * Convert code AA_BB or aa_bb to AaBb
   * @param {string} str
   * @returns {string}
   * @constructor
   */
  CamelCode(str: string): string {
    return str.toLowerCase().split('_').map((s: string) => {
      return s.charAt(0).toUpperCase() + s.substring(1);
    }).join('');
  }

  /**
   * Download CSV file
   * @param {any} data
   * @param {string} filename
   */
  public static DownloadCSVFile(data: any, filename: string = 'data') {
    if (!data) { return; }
    let csvData = Tools.ConvertToCSV(data);
    // console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  public static ConvertToCSV(objArray: any[]) {
    const headerList: any[] = Object.keys(objArray[0]);
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'Index,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }
}

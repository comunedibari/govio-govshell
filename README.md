# GovShell Workspace

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.0.

## Install

Run `npm install`.

This command installs a package and any packages that it depends on. If the package has a package-lock the installation of dependencies will be driven by that, respecting the following order of precedence.

It must be performed only if the "node_module" folder is not present or if the packages are updated.

## Development server

Run `npm run start-govshell` for a dev server. Navigate to `http://localhost:5200/`. The app will automatically reload if you change any of the source files.

## Development server with proxy

Run `npm run start-govshell-proxy` for a dev server with proxy.

## Build

Run `npm run distribution-govshell` to build the project. The build artifacts will be stored in the `dist/govshell-app/` directory.

## Build Production

Run `npm run production-govshell` to build the project clean and qwith version upgrade. The build artifacts will be stored in the `dist/govshell-app/` directory.

## Application configuration

To configure the application it is necessary to edit the "app-config.jon" file in the "assets/config" folder.

### Host

Change the "HOST" attribute in the "GOVAPI" section:

```json
{
    ...
    "GOVAPI": {
      "HOST": "http://localhost:5200",
      ...
    },
    ...
}
```

### Show/Hide HeaderBar

```json
{
    ...
    "Layout": {
      "showHeaderBar": true,
      ...
    },
    ...
}
```

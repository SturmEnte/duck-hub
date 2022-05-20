# Duck Hub

## About

Duck Hub is a self-hostable app that can be used to do nearly anything with the support of plugins. You can create multiple accounts and add as many plugins to your instance as you want. There is a simple front-end api for interacting with the server without the need for any fetch() calls (on the developers site). The web-interface has PWA (Progressive Web App) support and can be completly ussed offline.

## Notice

In some folders such as server is a README file that contains important information about it.

## How to build

### Server

At first you need to install gulp globaly with following command.

```bash
npm i -g gulp gulp-cli
```

After that you need to install the dependencies with following command.

```bash
npm i
```

Run following command in the root directory.

```bash
gulp server
```

That will build the server in following folder `build/server/`. The depenencies will not be installed automaticly. For that you need to run following command in the just mentioned directory.

```bash
npm i
```

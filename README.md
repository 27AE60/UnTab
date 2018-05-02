# UnTab
Minimal newtab with amazing wallpapers form Unsplash!

## Install

[![Mozilla Add-on](https://img.shields.io/amo/v/untab.svg)](https://addons.mozilla.org/en-US/firefox/addon/untab)

## Screen Shots

Newtab with images from [Unsplash.com](https://unsplash.com)

![Basic screenshot](https://raw.githubusercontent.com/27AE60/UnTab/master/screenshots/Screen%20Shot%201.png)

Ability to filter images on basis of keywords.

![Basic screenshot with filter query](https://raw.githubusercontent.com/27AE60/UnTab/master/screenshots/Screen%20Shot%202.png)

## Building

Install dependencies

```
$ yarn install
```

Modify `config/development.json` or `config/production.json` to add the `Unsplash` api-key in the `accessKey` field. Api key can be obtained from [Unsplash Developers](https://unsplash.com/developers). After adding api key, use below commands to build extension for respective platforms.

Build for `Chrome` dev | prod

```
$ yarn chrome-dev
$ yarn chrome-prod
```
Build for `Firefox` dev | prod

```
$ yarn firefox-dev
$ yarn firefox-prod
```

NOTE: No support for `Opera`, as overidding newtab page is not supported.

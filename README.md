# UnTab
Minimal newtab with amazing wallpapers form Unsplash!

## Screen Shots



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
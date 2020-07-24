# plantuml-proxy-cli
[![license](https://img.shields.io/github/license/vectronic/plantuml-proxy-cli.svg)](https://github.com/vectronic/plantuml-proxy-cli/blob/master/LICENSE)
[![npm](https://img.shields.io/npm/v/plantuml-proxy-cli.svg)](https://www.npmjs.com/package/plantuml-proxy-cli)

> Simple NodeJS CLI to render local PlantUML files to images using the online PlantUML service.

## Overview
This project provides a simple NodeJS CLI which will look for local PlantUML source files and for each one:

- [encode](https://plantuml.com/text-encoding) the file contents
- perform an HTTPS request to the PlantUML [service](https://plantuml.com/server) to render the image
- save the rendered image

## Motivation
This mechanism:
 
- avoids the need to have the required software for PlantUML rendering (Java etc.) installed.
- can easily be used in Git pre-commit hook to ensure rendered images are always up to date.

## Alternative

The key driver for this was to ensure I could include rendered UML diagrams could be included in Markdown files
stored in GitHub. A documented
[mechanism to achieve this](https://stackoverflow.com/questions/32203610/how-to-integrate-uml-diagrams-into-gitlab-or-github) does exist:

However, as noted in this [excellent post](https://blog.anoff.io/2018-07-31-diagrams-with-plantuml/), 
"the downside of this approach is that it will always render the latest commit in your repository even if you browse old versions."

## Install

```
npm install plantuml-proxy-cli
```

## Usage

```
Render local PlantUML files to images using the online PlantUML service.

  version                 1.0.3

Usage

  plantrender --sourceFolder <value> --destFolder <value> [--sourceExt <value>] [--destFormat <value>] [--url <value>]

Command Arguments

  --sourceFolder          Folder path which contains PlantUML files.
  --destFolder            Folder path for output of rendered images.
  --sourceExt             Source PlantUML file extension.
                          (default: iuml)
  --destFormat            Output rendered image format.
                          (valid values: png,txt,svg)
                          (default: png)
  --url                   URL of the PlantUML render service.
                          (default: http://www.plantuml.com/plantuml/)

Other Arguments

  --help                  Display application help
  --version               Show version information
  -h                      Display application help
  -v                      Show version information
  help                    Display application help
```

## Git Hook

An example Git hook defined in a [Husky](https://github.com/typicode/husky) config file using command
argument defaults would be:

```
{
    "hooks": {
        "pre-commit": "npx plantrender --sourceFolder=uml/source --destFolder=docs/images && git add docs/images/*.png"
    }
}
```

Otherwise, get funky with the other options:

```
{
    "hooks": {
        "pre-commit": "npx plantrender --sourceFolder=uml/source --destFolder=docs/images --sourceExt=uml --destFormat=txt && git add docs/images/*.png"
    }
}
```


## Development

Firstly:

```
npm install
```

then:

```
npm run build
```

After building, the CLI can be run with:

```
bin/plantrender
```

If you get stuck trying running with debug logging:

```
DEBUG='*' bin/plantrender
```

## Help etc.

If you have a query or problem, raise an issue in GitHub, or better yet submit a PR!

## License

MIT © Vectronic

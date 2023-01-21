# Trot: A scriptlet runner.

## Description.
Trot is a scriptlet runner. It fills the same role as 'npm run-script', only without being specific to npm and being more flexible.


## Installation
`npm -g install @theroyalwhee0/trot`

*or*

`yarn global add @theroyalwhee0/trot`


## Usage.
trot [...trot arguments] [action-name] [...action arguments]

Running "trot --help" will display the command line help.

Running "trot --list" will display the available actions in the current folder and their source files.

The action name is a string that matches an action in the source files. Action names must be alpha numeric + dash and not start with '--' or '-'. Arguments before the action name are consumed by trot.
Any arguments after the action name are passed to the scriptlet.

Trot will scan the current folder for any supported files. In each supported file it will check to see if the action is present and run it if found.

Multiple actions can be specified by providing a comma seperated list of actions. These actions will be run in order serially. (ex "clean,build,deploy")


## Supported file formats.
Trot uses its own file format Trotfile.toml (or Trotfile.json if you prefer).

It also supports package.json files and if a matching action is found in the package.json it will run that action though npm.


## Trotfile format.
See [Trotfile.format.md](./Trotfile.format.md) for documentation on the Trotfile.toml format.

Trot also supports Trotfile.json files using the same structure as .toml files.

See the [examples](./example/) folder for sample usage.


## Debugging.
Use the environment variable 'TROT_LOGLEVEL' to control logging. Setting it to warn, info, debug, or trace will provide additional details. For example `TROT_LOGLEVEL='trace' trot --list`.

The `--dump` command will display the details of an action without running that action. For example, assuming there is an action named 'start', `trot --dump start`.


## Source Code Terminology
- Run Type - The source where the scriptlets are pulled from (package.json, Trotfile.toml, etc.)
- Shell Type - These are the types of shell scripts that can be used as scriptlets from a Trotfile. (bash, python3, perl, etc.)


## Links
- GitHub: https://github.com/theroyalwhee0/trot
- NPM: https://www.npmjs.com/package/@theroyalwhee0/trot
- Changelog: https://github.com/theroyalwhee0/trot/blob/main/changelog.md


## Legal & License
Copyright 2019-2023 Adam Mill

This application is released under GPL 3 license. See [LICENSE](https://github.com/theroyalwhee0/trot/blob/master/LICENSE) for more details.

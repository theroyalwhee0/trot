# Trotfile.toml format

A Trotfile.toml file is a [TOML](https://github.com/toml-lang/toml#toml) file.


## TOML Format
```
[actions]
# NOTE: myaction is multiline
myaction='''
echo 1 - Line 1
echo 2 - Line 0x2
echo 3 - Line III
'''
```
TOML files are a user friendly alternative to JSON files. Since the Trotfile is a TOML file you can use TOML comments and multiline strings


## Basic Actions
```
[actions]
start='node index.js'
init='node initialize.js'
```

The `[actions]` section specifies the various actions that can be run. The left hand value is the name of the action and the right hand side is run as a bash script when specified. For example `trot start` would run 'node index.js' under a bash script.

Since the actions are run in a bash script returns via `exit`, arguments via `$*` or `$1`, or bash functions are valid.


## Environment
```
[env]
WORLD='World'

[action]
hello='echo Hello $WORLD'
```

The `[env]` section specifies environmental variables to be added to any run shells.


## Other Shells
```
[actions]
pyhello={ shell='python3', action='print("Hello")' }
```
Intead of running the action as a bash script you can specify a different shell to be used.

The following shell types are spported: bash, node, perl, python2, python3, and sh.


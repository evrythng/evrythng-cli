# evrythng-cli

CLI for working with the EVRYTHNG API from a terminal or scripts with ease.


## Installation

Install the `npm` module globally as a command:

```
$ npm i -g evrythng-cli
```

Then add at leasy one Operator using an Operator API Key available
from the 'Account Settings' page of the EVRYTHNG Dashboard:

```
$ evrythng operator add $name $region $apiKey
```

For example:

> Key truncated for brevity.

```
$ evrythng operator add prod us AGiWrH5OteA4aHiM...
```


## Usage

After installation, the global `npm` module can be used directly. In general, 
the argument structure is:

```
$ evrythng <command> <params>... [<switches>...]
```

Run `evrythng` to see all commands and switches. 


## Authentication

Authentication is provided in two ways.

1. Using the `operator` command to store Operator API Keys associated with 
   different accounts and regions in the user's `~/.evrythng-cli-config` file. 
   Any request that can be done as an Operator is done with the currently 
   selected Operator.

2. Using the `--api-key` switch to either override the current operator, or 
   provide a separately required key (such as the Application API Key when 
   creating Application Users).

You must add at least one Operator before you can begin using the CLI.


## Running Tests

Run `npm test` to run the Mocha tests in the `tests` directory.

Afterwards, see `reports/index.html` for code coverage results.


## Architecture

### Launch Parameters

The structure of launch parameters is thus:

```
$ evrythng <command> <params>... [<switches>...]
```

A command is implemented by adding to `commands.js`, and must have the following 
exported structure:

```js
{
  about,
  startsWith,
  operations,
}
```

For example: 

```js
module.exports = {
  about: 'View rate limit information',
  startsWith: 'rate-limit',
  operations: {
    read: {
      execute: async () => http.get('/rateLimits'),
      pattern: 'rate-limit read',
    },
  },
};
```

This is so that a command can safely implements its functionality using 
parameters that were provided to it. A command is selected when all arguments 
match the `pattern` provided by any given `operations` item, including keywords
such as `$id` or `$type`.

If no command is matches, the help is displayed. If a command is not fully 
matched, but the arguments do start with a module's `startsWith`, the syntax
for the module's `operations` is printed to help guide the user.

So for example, the `thng` command:

```
$ evrythng thng UnghCKffVg8a9KwRwE5C9qBs read
``` 
would receive all tokens after its own name:

```js
console.log(args);
```

```
[ 'UnghCKffVg8a9KwRwE5C9qBs', 'read' ];
```

and is implemented thus:

```js
module.exports = {
  about: 'Work with Thng resources.',
  startsWith: 'thng',
  operations: {
    readThng: {
      execute: async ([id]) => http.get(`/thngs/${id}`),
      pattern: 'thng $id read',
    },
  },
};
```

This architecture allows easy extension for subcommands of existing commands,
or as entirely new commands that are all agnostic to each other.


### Requests

HTTP requests are performed using the `post`, `get`, `put`, and `delete` methods
exported by `src/modules/http.js`. 

Switches that affect pre- and post-request behavior (such as printing extra 
logs, applying query params, or formatting the API response) are handled 
transparently in this module, so the commands do not have to handle them 
themselves.


### Use of Swagger

The EVRYTHNG CLI uses the `evrythng-swagger` `npm` module to allow interactive
building of `POST` request payloads using the `definitions` provided by the
EVRYTHNG `swagger.json` API description. This is invoked with the `--build` 
switch:

```
$ evrythng thng create --build
```

The CLI then asks for each field in the `definition` specified in the command
that implements `payloadBuilder.build()`, in this case `ThngDocument`:

```
laptop:evrythng-cli chrislewis$ evrythng thng create --build

Provide values for each field (or leave blank to skip):

1/7: name (string): My New Thng
2/7: tags (comma-separated list of string): cli,generated,objects
3/7: description (string): This Thng was created interactively
4/7: customFields (object, leave 'key' blank to finish)
  key: origin
  value: evrythng-cli
  key:
5/7: identifiers (object, leave 'key' blank to finish)
  key: serial
  value: 432897
  key:
6/7: product (string):
7/7: collections (comma-separated list of string):

{
  "id": "U5AgdeSQBg8aQKawwHsxkbcs",
  "createdAt": 1530278943537,
  "customFields": {
    "origin": "evrythng-cli"
  },
  "tags": [
    "cli",
    "generated",
    "objects"
  ],
  "updatedAt": 1530278943537,
  "name": "My New Thng",
  "description": "This Thng was created interactively",
  "identifiers": {
    "serial": "432897"
  }
}
```


### Switches

Any launch parameter that begins with `--` is treated as a switch, and is 
extracted from the launch parameters by `switches.js` in the `extract()` method
before the remaining `args` are provided to the matched command.

After `extract()` is called, a switch's state in any given invocation can be 
determined as shown below for an example command:

```
$ evrythng thng list --scopes
```

```js
const switches = require('../modules/switches');

if (switches.using(switches.SCOPES)) {
  // --scopes was specified
}
```

If a switch is configured in `SWITCH_LIST` to be given with a value 
(`hasValue`), it is made available as `value`. This is specified at invocation 
time as follows:

```
$ evrythng thng list --filter tags=test
```

The value would be read in code as:

```
const filter = switches.using(switches.FILTER);

if (filter) console.log(`Filter value was ${filter.value}`);
```

```
Filter value was tags-test
```

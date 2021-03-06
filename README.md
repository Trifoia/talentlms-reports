# TalentLMS Reports
Custom reporting engine for TalentLMS

## Usage
First, instantiate the module with your TalentLMS API credentials
```js
const TalentLMSReports = require('talentlms-reports');
const reports = new TalentLMSReports({
  apiKey: 'Your API key',
  domain: 'Your domain',
});
```

Then use the async `generate` method on the instantiated object to generate a report of the
desired type
```js
const results = await reports.generate({type: 'group', groupId: '3'});
```

This package supports some advanced features, such as data caching. See the in-line documentation for more details

## Report Types
### Group
Takes a `groupId` and returns the following information for each user in that group:

| Property | Description |
| ---- | - |
| `id` | The user's TalentLMS id |
| `email` | The user's email address |
| `fullName` | The user's full name (first name + last name) |
| `createdOn` | Date the user was first created |
| `lastLogin` | When the user last logged in and did something |
| `courses` | Array of course information for the user |
| `courses[n].id` | Id of the course |
| `courses[n].name` | Name of the course |
| `courses[n].completionPercentage` | User's completion percentage between 0-100 |
| `courses[n].completedOn` | Date when the user completed the course, if applicable |

If there is an error generating the report, an object will be returned with an `error` property that includes error details

# Template Notes
## NPM Script Commands
Run all tests
```sh
npm test
```

Run only "quick" tests
```sh
npm run test-quick
```

Lint
```sh
npm run lint
```

Lint and automatically fix issues
```sh
npm run lint-fix
```

## Project Structure
All code should be added to the [src](./src) directory. The structure of the source directory should be replicated in the [test](./test) folder, and all files except for control files should have an associated unit test file that folder

## Unit Testing
This project uses the [Mocha](https://mochajs.org/) library to run unit tests. The principles of "Test Driven Development" should be followed when writing code in this project. That is, unit tests should be leveraged as a development tool and all major functionality should have associated unit tests. Code should be written in a way that allows for easy mocking, either by taking all required instantiated libraries as arguments, or by using an internal state that can be modified externally

### Slow Tests
External resources should generally be mocked when testing to reduce the time it takes for tests to complete. Long running tests can cause development slowdown, since the unit test suite should be run at will whenever updates are made. However that is not always efficient to do. When external libraries or long processes cannot be mocked the [it-slowly](./test/test-utils/it-slowly.js) test utility should be used. By using `itSlowly` in place of `it` within a unit test, the test will automatically be skipped when running unit tests in "quick" mode

## Debugging
This project has built-in utilities for debugging unit tests with VSCode (breakpoints, process stepping, etc). Run the `Mocha` or `Mocha Quick` debug launch configuration to debug all tests or only quick tests respectively

## Configuration
This project uses a standard configuration system that allows for global configuration values to be easily defined and overwritten locally. See the [config](./config.js) file in the root directory for more information

## EcmaScript vs CommonJs
Currently, all Nodejs projects use the CommonJs syntax because ESM modules are still considered "Experimental" as of Nodejs v14.0 and may be subject to breaking changes in future minor version updates. The existing configuration system also requires use of CommonJs and would need to be refactored significantly to support ESM

# TS Error Parser

TS Error Parser is a TypeScript library designed to parse TypeScript error messages from logs, transforming them into a structured format. This utility is particularly useful for tools and applications that need to programmatically analyze or display TypeScript compilation errors in a more user-friendly or structured way.

## Features

- Parses entire TypeScript error logs, including multi-line error messages.
- Outputs structured `Diagnostic` objects containing detailed error information.

## Installation

To use TS Error Parser in your project, you'll need to install it via npm. Run the following command in your project directory:

```bash
npm install ts-error-parser
```

## Usage

### Parsing an Entire Log

To parse an entire TypeScript error log:

```typescript
import { parseTSErrors } from 'ts-error-parser';
import fs from 'fs';

const logContent = fs.readFileSync('path/to/your/error.log', 'utf8');
const diagnostics = parseTSErrors(logContent);
console.log(diagnostics);
```

### Example

Given a TypeScript error log like this:

```plaintext
frontend/components/ExampleComponent.ts(10,5): error TS2322: Type 'number' is not assignable to type 'string'.
frontend/components/AnotherComponent.ts(15,12): error TS7006: Parameter 'event' implicitly has an 'any' type.
```

The `parseTSErrors` function will output structured diagnostics:

```json
[
  {
    "location": {
      "path": "frontend/components/ExampleComponent.ts",
      "lineNode": {
        "startLine": 10,
        "endLine": 5
      }
    },
    "errorReport": {
      "errorCode": 2322,
      "message": "Type 'number' is not assignable to type 'string'."
    }
  },
  {
    "location": {
      "path": "frontend/components/AnotherComponent.ts",
      "lineNode": {
        "startLine": 15,
        "endLine": 12
      }
    },
    "errorReport": {
      "errorCode": 7006,
      "message": "Parameter 'event' implicitly has an 'any' type."
    }
  }
]
```

## Building from Source

If you're contributing to TS Error Parser or want to build it from source, clone the repository and run:

```bash
npm install
npm run build
```

This compiles the TypeScript source code to JavaScript, outputting to the `dist` directory.

## Running Tests

To run the test suite:

```bash
npm run test
```

## Contributing

Contributions to TS Error Parser are welcome! Please feel free to submit issues or pull requests.

## License

TS Error Parser is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.


export type Diagnostic = {
  location: LocationNode;
  errorReport: ErrorReport;
};

type LocationNode = {
  path: string;
  lineNode: LineNode;
};
type LineNode = {
  startLine: number;
  endLine: number;
};

type ErrorReport = {
  errorCode: number;
  message: string;
};

export function parseLine(log: string): Diagnostic {
  console.debug(`Parsing line: \n${log}`);

  // Adjusted to capture any file path until the line number pattern
  const pathAndLine = log.match(/^(.*?)\((\d+),(\d+)\):/);
  if (!pathAndLine)
    throw new Error(
      `Could not parse file path and line numbers for line: '${log}'`
    );

  const errorCode = log.match(/TS(\d+):/);
  if (!errorCode)
    throw new Error(`Could not parse TS Error Code for line: '${log}'`);

  const errorMessage = log.match(/TS\d+: (.*)/);
  if (!errorMessage)
    throw new Error(`Could not parse TS Error Message for line: '${log}'`);

  return {
    location: {
      path: pathAndLine[1],
      lineNode: {
        startLine: parseInt(pathAndLine[2]),
        endLine: parseInt(pathAndLine[3]), // Adjusted to capture the end line if different
      },
    },
    errorReport: {
      errorCode: parseInt(errorCode[1]),
      message: errorMessage[1],
    },
  };
}

export function parseTSErrors(logContent: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const diagnosticRegex =
    /(.+)\((\d+),(\d+)\): error TS(\d+): ([\s\S]+?)(?=\n\S|$)/g;
  let match;

  while ((match = diagnosticRegex.exec(logContent)) !== null) {
    const [, path, startLine, endLine, errorCode, message] = match;
    if (message) {
      // Ensure message is defined before trimming
      diagnostics.push({
        location: {
          path,
          lineNode: {
            startLine: parseInt(startLine),
            endLine: parseInt(endLine),
          },
        },
        errorReport: {
          errorCode: parseInt(errorCode),
          message: message.trim().replace(/\n\s+/g, " "), // Replace newlines and indentation with a single space
        },
      });
    }
  }

  return diagnostics;
}

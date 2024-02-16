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

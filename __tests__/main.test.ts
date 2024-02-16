import { it, expect } from "vitest";
import { Diagnostic, parseLine } from "../main";

it("should parse diagnostic line correctly", () => {
  const expected: Diagnostic = {
    location: {
      path: "path/to/some/file.ts",
      lineNode: {
        startLine: 14,
        endLine: 19,
      },
    },
    errorReport: {
      errorCode: 18046,
      message: "'hoge' is of type 'unknown'.",
    },
  };
  const strPattern = `path/to/some/file.ts(14,19): error TS18046: 'hoge' is of type 'unknown'.`;
  expect(parseLine(strPattern)).toEqual(expected);
});

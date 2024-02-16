import { it, expect, describe } from "vitest";
import { Diagnostic, parseLine, parseTSErrors } from "../main";

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

describe("parseTSErrors", () => {
  it("should correctly parse a log with multi-line error messages, including detailed descriptions", () => {
    const logContent = `
frontend/components/gibberish/WidgetFrobnicator.vue(8,32): error TS2345: Argument of type '(status: keyof typeof WIDGET_STATUS_MAP) => "is-foo" | "is-bar" | "is-baz"' is not assignable to parameter of type '0 | 1 | 2'.
frontend/components/gibberish/ComplexComponent.vue(28,57): error TS2345: Argument of type '{ date: number | false; title: "string"; type: "OutputType"; url: "string"; blog: { tags: string[]; }; career: { type: "string"; }; connpass: { status: number; }; github: { contributions: number; contributionsUrl: "string"; ... 11 more ...; updatedAt: number; }; ... 8 more ...; viewsDetail: ViewsDetail[]; }' is not assignable to parameter of type 'Output'.
  Types of property 'date' are incompatible.
    Type 'number | false' is not assignable to type 'number'.
      Type 'boolean' is not assignable to type 'number'.
frontend/components/gibberish/AnotherComponent.vue(147,7): error TS2322: Type 'unknown' is not assignable to type 'string | number | symbol | undefined'.
    `;

    const expectedDiagnostics = [
      {
        location: {
          path: "frontend/components/gibberish/WidgetFrobnicator.vue",
          lineNode: {
            startLine: 8,
            endLine: 32,
          },
        },
        errorReport: {
          errorCode: 2345,
          message:
            'Argument of type \'(status: keyof typeof WIDGET_STATUS_MAP) => "is-foo" | "is-bar" | "is-baz"\' is not assignable to parameter of type \'0 | 1 | 2\'.',
        },
      },
      {
        location: {
          path: "frontend/components/gibberish/ComplexComponent.vue",
          lineNode: {
            startLine: 28,
            endLine: 57,
          },
        },
        errorReport: {
          errorCode: 2345,
          message:
            "Argument of type '{ date: number | false; title: \"string\"; type: \"OutputType\"; url: \"string\"; blog: { tags: string[]; }; career: { type: \"string\"; }; connpass: { status: number; }; github: { contributions: number; contributionsUrl: \"string\"; ... 11 more ...; updatedAt: number; }; ... 8 more ...; viewsDetail: ViewsDetail[]; }' is not assignable to parameter of type 'Output'. Types of property 'date' are incompatible. Type 'number | false' is not assignable to type 'number'. Type 'boolean' is not assignable to type 'number'.",
        },
      },
      {
        location: {
          path: "frontend/components/gibberish/AnotherComponent.vue",
          lineNode: {
            startLine: 147,
            endLine: 7,
          },
        },
        errorReport: {
          errorCode: 2322,
          message:
            "Type 'unknown' is not assignable to type 'string | number | symbol | undefined'.",
        },
      },
    ];

    const diagnostics = parseTSErrors(logContent);
    expect(diagnostics).toEqual(expectedDiagnostics);
  });
});

import { CONSTANTS } from "../../config";

const getPreviousFunctionName = (d: number) => {
  try {
    const error = new Error();
    let r = "";
    if (error.stack != null) {
      const firefoxMatch = (error.stack.split("\n")[d].match(/^.*(?=@)/) ||
        [])[0];
      const chromeMatch = (
        (((error.stack.split("at ") || [])[1 + d] || "").match(
          /(^|\.| <| )(.*[^(<])( \()/
        ) || [])[2] || ""
      )
        .split(".")
        .pop();
      const safariMatch = error.stack.split("\n")[d];

      r = firefoxMatch || chromeMatch || safariMatch;
    }
    return r;
  } catch (e) {
    // eslint-disable-next-line no-console
    // console.error(`🚨`, e)
    return "";
  }
};

export const print = (...message: any[]) => {
  message = message.filter((value) => value != undefined || value != null);
  const previousFunction: string = getPreviousFunctionName(2);
  const hideDescription: boolean =
    previousFunction.includes("callee") ||
    previousFunction.includes("eval") ||
    previousFunction.includes("@") ||
    previousFunction === "";
  const environ = CONSTANTS.appEnv;

  if (environ != "production") {
    // eslint-disable-next-line no-console
    if (hideDescription) console.log(`🖨 `, ...message);
    // eslint-disable-next-line no-console
    else console.log(`🖨 `, `${previousFunction}`, ...message);
  }
};

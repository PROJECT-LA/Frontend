import { CONSTANTS } from "../../config";
import childProcess from "child_process";

export const execChildProcess = async (comando: string) => {
  const childProcess = require("child_process");
  return await new Promise((resolve, reject) => {
    childProcess.exec(
      comando,
      (error: childProcess.ExecException, stdout: string, stderr: string) => {
        return error ? reject(stderr) : resolve(stdout);
      }
    );
  });
};

export const isValidEmail = (email: string): boolean => {
  const match = String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-\d]+\.)+[a-zA-Z]{2,}))$/
    );

  return !!match;
};

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString("base64");
};
export const decodeBase64 = (data: string) => {
  return Buffer.from(data, "base64").toString("ascii");
};

export const handleAddBase64Image = (base64String: string): File => {
  const base64ToBlob = (base64: string, contentType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  };

  const contentType = "image/jpeg";
  const base64Data = base64String.split(",")[1];
  const blob = base64ToBlob(base64Data, contentType);
  const file = new File([blob], "image.jpg", { type: contentType });
  return file;
};

const isHTML = RegExp.prototype.test.bind(/^(<([^>]+)>)$/i);

export const serializeError = (err: unknown) =>
  JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)));

export const MessagesInterpreter = (mensaje: any): string => {
  try {
    const errorMessage = serializeError(mensaje);
    return (
      errorMessage.mensaje ??
      errorMessage.message ??
      errorMessage.error ??
      "Solicitud errónea 🚨"
    );
  } catch (e) {
    return isHTML(mensaje) ? "Solicitud errónea 🚨" : `${mensaje}`;
  }
};

export const titleCase = (word: string) => {
  return word.length <= 1
    ? word.toUpperCase()
    : word
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const siteName = () => {
  return CONSTANTS.siteName ?? "";
};

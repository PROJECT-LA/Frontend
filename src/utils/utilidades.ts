import childProcess from 'child_process'

export const execChildProcess = async (comando: string) => {
  const childProcess = require('child_process')
  return await new Promise((resolve, reject) => {
    childProcess.exec(
      comando,
      (error: childProcess.ExecException, stdout: string, stderr: string) => {
        return error ? reject(stderr) : resolve(stdout)
      }
    )
  })
}

export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const encodeBase64 = (data: string) => {
  return Buffer.from(data).toString('base64')
}
export const decodeBase64 = (data: string) => {
  return Buffer.from(data, 'base64').toString('ascii')
}

const isHTML = RegExp.prototype.test.bind(/^(<([^>]+)>)$/i)

export const serializeError = (err: unknown) =>
  JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))

export const InterpreteMensajes = (mensaje: any): string => {
  try {
    const errorMessage = serializeError(mensaje)
    return (
      errorMessage.mensaje ??
      errorMessage.message ??
      errorMessage.error ??
      'Solicitud errónea 🚨'
    )
  } catch (e) {
    return isHTML(mensaje) ? 'Solicitud errónea 🚨' : `${mensaje}`
  }
}

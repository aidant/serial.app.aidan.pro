/**
 * @param {ReadableStream<string>} stream
 */
async function * getAsyncIterableFromStream (stream) {
  const reader = stream.getReader()

  try {
    while (true) {
      const result = await reader.read()
      if (!result.done) yield result.value
    }
  } finally {
    reader.releaseLock()
  }
}

export const getSerialPort = async () => {
  const port = await navigator.serial.requestPort()
  return port
}

export const getSerialPortStream = async (port, options) => {
  const input = new TextEncoderStream()
  const output = new TextDecoderStream()

  await port.open(options)

  port.readable.pipeTo(output.writable)
  input.readable.pipeTo(port.writable)

  return {
    input: input.writable,
    output: getAsyncIterableFromStream(output.readable)
  }
}

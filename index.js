import * as serial from './lib/serial.js'

window.addEventListener('load', () => {
  if (!('serial' in navigator)) {
    const warning = document.createElement('span')
    warning.id = 'warning'
    warning.textContent = 'The Web Serial API is not supported/enabled in your browser.'
    document.body.prepend(warning)
  }
})

window.addEventListener('load', () => {
  /** @type {HTMLFormElement} */
  const form = document.querySelector('form[name="serial-options"]')
  /** @type {HTMLSpanElement} */
  const output = document.querySelector('#output')

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const serialOptions = {
      baudRate: parseInt(event.target.elements['baud-rate'].value, 10),
      dataBits: parseInt(event.target.elements['data-bits'].value, 10),
      stopBits: parseInt(event.target.elements['stop-bits'].value, 10),
      parity: event.target.elements['parity'].value,
      bufferSize: parseInt(event.target.elements['buffer-size'].value, 10),
      flowControl: event.target.elements['flow-control'].value,
    }

    const port = await serial.getSerialPort()
    const io = await serial.getSerialPortStream(port, serialOptions)
    output.textContent = ''
    for await (const chunk of io.output) {
      output.textContent += chunk
      window.scrollTo({
        top: output.scrollHeight
      })
    }
  })
})

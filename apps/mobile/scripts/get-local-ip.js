const { exec } = require('child_process')
require('dotenv').config({ path: './.env.local' })

// Execute the command and capture the output
exec(
  `netsh.exe interface ip show address "${process.env.LOCAL_CONNECTION_INTERFACE_NAME}"`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing the command: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Command error: ${stderr}`)
      return
    }

    // Find and print the IPv4 address
    const lines = stdout.split('\n')
    for (const line of lines) {
      if (line.includes(process.env.LOCAL_CONNECTION_IPV4_SEARCH)) {
        const matches = line.match(/\b\d{1,3}(\.\d{1,3}){3}\b/g)
        if (matches && matches.length > 0) {
          console.log(matches[0])
          return
        }
      }
    }

    console.log('IPv4 address not found.')
  },
)

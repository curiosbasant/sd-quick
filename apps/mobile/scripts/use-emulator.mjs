// @ts-check
import { exec, spawn } from 'child_process'
import { createInterface } from 'readline'

/*
  ANDROID_HOME_WIN points to the mounted Windows Android SDK path
  e.g. /mnt/c/Users/<user>/AppData/Local/Android/Sdk
*/
const RUN_CMD = `${process.env.ANDROID_HOME_WIN}/emulator/emulator`
const LIST_CMD = `${process.env.ANDROID_HOME_WIN}/emulator/emulator -avd -list-avds`

await runEmulator()

async function runEmulator() {
  const emulators = await getDevices()

  if (emulators.length === 0) {
    console.log('No devices available.')
    return
  }

  console.log('Select an emulator:\n')
  emulators.forEach((emulator, index) => {
    console.log(`   [${index + 1}] ${emulator}`)
  })

  const selectedEmulatorIndex = await getUserInput('\nEmulator: ')

  if (isValidIndex(selectedEmulatorIndex, emulators.length)) {
    const selectedEmulator = emulators[selectedEmulatorIndex - 1]
    console.log(`\nStarting ${selectedEmulator}...`)
    try {
      const emulatorProcess = spawn(RUN_CMD, ['-avd', selectedEmulator])

      emulatorProcess.on('close', (code) => {
        if (code !== 0) console.log(`${selectedEmulator} exited with error.`)
        else console.log(`${selectedEmulator} exited gracefully.`)
      })

      emulatorProcess.stderr.on('error', () => {
        console.log(`${selectedEmulator} encountered an error and had to be shut down.`)
      })
    } catch (err) {
      console.error('Error running emulator.')
    }
  } else {
    console.log('Invalid selection.')
  }
}

/**
 * @returns {Promise<string[]>}
 */
function getDevices() {
  return new Promise((resolve, reject) => {
    exec(LIST_CMD, (error, stdout) => {
      if (error) {
        if (error.message.includes('emulator/emulator:')) {
          console.error(
            'Error retrieving device list, unpatched Sdk directory. Please run wsl-setup first.', // <-- .exe files have not been copied to their non-exe counterparts
          )
        } else {
          console.error(`Error retrieving list of devices: ${error.message}`)
        }
        reject(error)
        return
      }

      const devices = stdout
        .split('\n')
        .map((name) => name.trim())
        .filter((name) => name)
      resolve(devices)
    })
  })
}

/**
 * @param {string} prompt
 * @returns {Promise<number>}
 */
function getUserInput(prompt) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close()
      resolve(+answer.trim())
    })
  })
}

/**
 * @param {number} index
 * @param {number} arrayLength
 * @returns {boolean}
 */
function isValidIndex(index, arrayLength) {
  return !isNaN(index) && index >= 1 && index <= arrayLength
}

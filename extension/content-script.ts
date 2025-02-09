import { actions, onRuntimeMessage } from './utils'

onRuntimeMessage<{ type: string; payload?: any }, any>(async (message, sender) => {
  console.log('content: request received', { message, sender })
  return await actions[message.type]?.handler(message.payload)
})

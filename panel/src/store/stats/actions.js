export function event (_, { client, event, data }) {
  try {
    client.socket.post('/v1/stats', {
      event,
      data
    })
  } catch (err) {
    if (err) {
      // do nothing
    }
  }
}

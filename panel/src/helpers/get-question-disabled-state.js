export default function (question) {
  if (this.state.round.running === false) {
    return true
  }

  if (question.winner > 0) {
    return true
  }

  if (this.activeQuestion !== null) {
    return true
  }

  return false
}

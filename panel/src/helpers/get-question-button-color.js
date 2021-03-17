export default function (question) {
  let color = 'primary'

  if (question.active || question.user) {
    color = 'grey'
  } else {
    if (question.winner === 1) {
      color = 'blue'
    }
    if (question.winner === 2) {
      color = 'orange'
    }
    if (question.winner === 0) {
      color = 'black'
    }
  }

  return color
}

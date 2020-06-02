module.exports = {
  setupHandMotions
}

function setupHandMotions(gripButton, releaseButton, indexThumbServo, threeFingerServo) {
  gripButton.on("hold", () => {
    indexThumbServo.cw(0.5) // Run servo at half speed in clockwise direction
    threeFingerServo.cw(0.5)
  })

  gripButton.on("release", () => {
    indexThumb.stop() // Stop the servo
    threeFinger.stop()
  })

  releaseButton.on("hold", () => {
    indexThumb.ccw(0.5) // Run at half speed in counter-clockwise direction
    threeFinger.ccw(0.5)
  })

  releaseButton.on("release", () => {
    indexThumb.stop()
    threeFinger.stop()
  })

}

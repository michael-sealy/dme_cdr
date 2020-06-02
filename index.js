var {
  initializeBoard,
  initializeIndexThumbServo,
  initializeThreeFingerServo,
  initializeForceSensor,
  initializeThermometer,
  initializeAccelerometer,
  initializeHealthyLed,
  initializeUnhealthyLed,
  initializeGripButton,
  initializeReleaseButton,
  initializeEmergencyShutoffButton
} = require('./initialization.js')
var { setupEmergencyShutoff } = require('./emergency-shutoff.js')
var { setupHandMotions } = require('./hand-motion.js')

var board = initializeBoard();

/* Initialize hand
 * When we receive the ready signal the arduino uno has
 * initialized and been connected to successfully
*/
board.on("ready", () => {
  console.log("Successfully initialized board")

  /* Initialize all the board components
  */
  var healthyLed = initializeHealthyLed()
  var unhealhtyLed = initializeUnhealthyLed()
  var forceSr = initializeForceSensor()
  var accelerometer = initializeAccelerometer()
  var thermometer = initializeThermometer()
  var indexThumb = initializeIndexThumbServo()
  var threeFinger = initializeThreeFingerServo()
  var gripButton = initializeGripButton()
  var releaseButton = initializeReleaseButton()
  var emergencyShutoffButton = initializeEmergencyShutoffButton()

  /* Function that sets up the grip and release, start and stop
   * motions for the hand. Simple code to simulate the real thing
   */
  setupHandMotions(gripButton, releaseButton, indexThumb, threeFinger)

  /* Function that watches the accelerometer, thermometer and force sensor 
   * and turns off the servos in case of thresholds being exceeded
  */
  setupEmergencyShutoff(
    healthyLed,
    unhealhtyLed,
    forceSr,
    accelerometer,
    thermometer,
    servo
  )

  emergencyShutoffButton.on("press", () => {
    doEmergencyShutoff(
      healthyLed,
      unhealhtyLed,
      indexThumb,
      threeFinger,
      "Emergency shutoff button pressed"
    )
  });

  // Cleanup on board exit
  setupBoardCleanup(healthyLed, unhealhtyLed, indexThumb, threeFinger)
});


// Ensure leds are switched off on clean shutdown
function setupBoardCleanup(healthyLed, unhealthyLed, indexThumb, threeFinger){
  board.on("exit", function () {
    healthyLed.off()
    unhealhtyLed.off()
    indexThumb.stop()
    threeFinger.stop()
  })
}



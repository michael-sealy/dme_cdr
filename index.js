const { Board, Led, Sensor, Accelerometer, Thermometer, Servo } = require("johnny-five");

/* Component Values
 * Format: (name) - identifying feature { value } - role
 * (Servo) - { 4 } - Hand servo
 * (Accelerometer) - {5,6,7} - x,y,z accelerometer
 * (Force Sr) - { 9 } - Force Sensitive Resistor
 * (Healthy) - Green { 10 } - Board initialized and healthy
 * (UnHealthy) - Red { 11 } - There is an error/emergency shutdown
 * */

const board = new Board();

/* Initialize hand
 * When we receive the ready signal the arduino uno has
 * initialized and been connected to successfully
*/
board.on("ready", () => {
  console.log("Successfully initialized device")

  var healthyLed = initializeHealthyLed()
  var unhealhtyLed = initializeUnhealthyLed()
  var forceSr = initializeForceSensor()
  var accelerometer = initializeAccelerometer()
  var thermometer = initializeThermometer()
  var servo = initializeServo()


  setupEmergencyShutoff(
    healthyLed,
    unhealhtyLed,
    forceSr,
    accelerometer,
    thermometer,
    servo
  )

  // Cleanup on board exit
  setBoardCleanup(healthyLed, unhealhtyLed)
});

// Ensure leds are switched off on clean shutdown
function setBoardCleanup(healthyLed, unhealthyLed){
  board.on("exit", function () {
    healthyLed.off()
    unhealhtyLed.off()
  }
}

/* Setup emergency shutdown functions
*/
function setupEmergencyShutoff(hl, unhl, fsr, acc, therm, servo){
  watchForceSensorTooHigh(hl, unhl, fsr, servo)
  watchAccelerationTooHigh(hl, unhl, acc, servo)
  watchTemperatureTooHigh(hl, unhl, therm, servo)
}

// Shutdown hand in case force exceeds 20N
function watchForceSensorTooHigh(hl, unhl, forceSensor, servo)
  forceSensor.on("data", () => {
    var force = forceSensor.scaleTo(0, 50)

    if (force > 20) {
      doEmergencyShutoff(hl, unhl, servo, "Force exceeds 20N")
    } else {
      console.log("Force within acceptable parameters: " + force)
    }
  })
}

// Acceleration cannot exceed 9.81 m/s^2
function watchAccelerationTooHigh(hl, unhl, acc, servo){
  acc.on("change", () => {
    if (acc.x >= 9.81 || acc.y >= 9.81 || acc.z >= 9.81) {
      doEmergencyShutoff(hl, unhl, servo, "Acceleration exceeds 9.81m/s^2")
    } 
  })
}

// Temperature exceeds 60C
function watchTemperatureTooHigh(hl, unhl, therm, servo){
  therm.on("data", () => {
    if (therm.C > 60) {
      doEmergencyShutoff(hl, unhl, servo, "Temperature exceeds 60C")
    } 
  })

}

function stopServoRunning(servo, reason) {
  servo.off()
  console.log("Servo shutdown for reason: " + reason)
}

function doEmergencyShutoff(healthyLed, unhealthyLed, servo, reason) {
  healthyLed.off()
  unhealhtyLed.strobe(1000)
  stopServoRunning(servo, reason)
}


function initializeServo() {
  var servo = new Servo({
    pin: 4,
    center: true
  })

  return servo
}

function initializeForceSensor() {
  var forceSr = new Sensor({
    pin: 9,
    freq: 25
  })

  return forceSr
}

function initializeHealthyLed() {
  // Blink once to indicate board is working
  var healthyLed = new Led(10)
  healthyLed.blink(500)

  healthyLed.on()

  return healthyLed
}

function initializeUnhealthyLed() {
  // Blink once to indicate board is working
  var statusLed = new Led(11)
  statusLed.blink(500)

  return statusLed
}

function initializeThermometer() {
  var thermometer = new Thermometer({
    pin: 8 
  })

  return thermometer
}

function initializeAccelerometer() {
  var accelerometer = new Accelerometer({
    pins: [5,6,7],
    sensitivity: 100
  })

  return accelerometer
}

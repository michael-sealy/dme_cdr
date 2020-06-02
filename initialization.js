const { Board, Led, Sensor, Accelerometer, Thermometer, Servo, Button } = require("johnny-five")

module.exports = {
  initializeBoard,
  initializeIndexThumbServo,
  initializeThreeFingerServo,
  initializeForceSensor,
  initializeThermometer,
  initializeAccelerometer,
  initializeHealthyLed,
  initializeUnhealthyLed,
  initializeGripButton,
  initializeReleaseButton
}

// Setup the board
function initializeBoard() {
  return new Board()
}

/* Component Values
 * Format: (name) - identifying feature { value } - role
 * (Force Sensors) - { A0, A1, A3 } - Force Sensitive Resistor
 * (Thermometer) - { A2 } - Thermometer
 * (Accelerometer) - {4,5} - x,y accelerometer
 * (Button) - { 12 } - Grip Button
 * (Button) - { 2 } - Release Button
 * (Button) - { 6 } - Emergency Shutoff Button
 * (Servo) - { A4 } - Index/Thumb servo
 * (Servo) - { A5 } - Three Finger servo
 * (Led) - Green { 5 } - Board health state
 * */

/*
 * Board initialization
*/

function initializeIndexThumbServo() {
  var servo = new Servo({
    pin: "A4",
    center: true
  })

  return servo
}

function initializeThreeFingerServo() {
  var servo = new Servo({
    pin: "A5",
    center: true
  })

  return servo
}

function initializeGripButton() {
  return new Button(12) 
}

function initializeReleaseButton() {
  return new Button(2)
}

function initializeEmergencyShutoffButton() {
  return new Button(6)
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
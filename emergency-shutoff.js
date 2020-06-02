module.exports = {
  setupEmergencyShutoff,
  doEmergencyShutoff
}

/* Setup emergency shutdown functions
*/
function setupEmergencyShutoff(healthyLed, unhealthyLed, forceSensor, accelerometer, thermometer, servo){
  watchForceSensorTooHigh(healthyLed, unhealthyLed, forceSensor, servo)
  watchAccelerationTooHigh(healthyLed, unhealthyLed, accelerometer, servo)
  watchTemperatureTooHigh(healthyLed, unhealthyLed, thermometer, servo)
}

// Shutdown hand in case force exceeds 20N
function watchForceSensorTooHigh(hl, unhl, forceSensor, servo){
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


function doEmergencyShutoff(healthyLed, unhealthyLed, indexThumb, threeFinger, reason) {
  healthyLed.off()
  unhealhtyLed.strobe(1000)
  indexThumb.off()
  threeFinger.off()
  console.log("Hand has shutdown because: " + reason)
}
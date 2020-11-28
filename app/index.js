import clock from "clock";
import document from "document";
import { zeroPad } from "../common/utils";
import { me as appbit } from "appbit";
import { today } from "user-activity";
import { HeartRateSensor } from "heart-rate";
import { display } from "display";
import { battery } from "power";

const batLabel = document.getElementById("batLabel");
const dateLabel = document.getElementById("dateLabel");
const monLabel = document.getElementById("monLabel");
const clockLabel = document.getElementById("clockLabel");
const dayLabel = document.getElementById("dayLabel");
const zonLabel = document.getElementById("zonLabel");
const stepLabel = document.getElementById("stepLabel");
const floorLabel = document.getElementById("floorLabel");
const hrLabel = document.getElementById("hrLabel");

clock.granularity = "minutes";
clock.addEventListener("tick", updateClock);

if (HeartRateSensor) {
  const hrm = new HeartRateSensor();
  hrm.addEventListener("reading", () => {
    hrLabel.text = `${hrm.heartRate}`;
  });
  display.addEventListener("change", () => {
    display.on ? hrm.start() : hrm.stop();
  });
  hrm.start();
}
function getSteps(){
 if (appbit.permissions.granted("access_activity")) {
    console.log(`${today.adjusted.steps} Steps`);
    stepLabel.text=`${today.adjusted.steps}`;
    if (today.local.elevationGain !== undefined) {
      console.log(`${today.adjusted.elevationGain} Floor(s)`);
       floorLabel.text=`${today.adjusted.elevationGain}`;
    }
 }
}

function getBat(){
  batLabel.text = `${Math.floor(battery.chargeLevel)}`;
}

function getZone(){
  console.log(`${today.adjusted.activeZoneMinutes.total}`);
  zonLabel.text = `${today.adjusted.activeZoneMinutes.total}`;
}
 
let hourHand = document.getElementById("hours");
let minHand = document.getElementById("mins");

function hoursToAngle(hours, minutes) {
  let hourAngle = (360 / 12) * hours;
  let minAngle = (360 / 12 / 60) * minutes;
  return hourAngle + minAngle;
}

function minutesToAngle(minutes) {
  return (360 / 60) * minutes;
}

function updateDay(dagen) {
  if(dagen == "0"){dayLabel.text = "S";}
  else if(dagen == "1"){dayLabel.text = "M";}
  else if(dagen == "2"){dayLabel.text = "T";}
  else if(dagen == "3"){dayLabel.text = "O";}
  else if(dagen == "4"){dayLabel.text = "T";}
  else if(dagen == "5"){dayLabel.text = "F";}
  else if(dagen == "6"){dayLabel.text = "L";}
}

function updateClock() {
  let today = new Date();
  let hours = today.getHours() % 12;
  let mins = today.getMinutes();
  let tfhours = today.getHours();
  let zhours = zeroPad(tfhours);
  let zmins = zeroPad(mins);
  let dagen = today.getDay();
  getSteps();
  getBat();
  getZone();
  clockLabel.text = (`${zhours}${zmins}`);
  dateLabel.text = `${today.getDate()}`;
  monLabel.text = `${today.getMonth() +1}`;
  updateDay(dagen);
  hourHand.groupTransform.rotate.angle = hoursToAngle(hours, mins);
  minHand.groupTransform.rotate.angle = minutesToAngle(mins);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); 
  }


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



function renderTime() {
  var renderedTime = '00:00'
  var minutes = Math.floor(gGame.secsPassed / 60)
  var seconds = gGame.secsPassed
  if (minutes < 10) minutes = "0" + minutes
  if (seconds > 59) seconds = seconds % 60
  if (seconds < 10) seconds = "0" + seconds
  renderedTime = minutes + ":" + seconds
  var elTimer = document.querySelector('.timer-div');
  elTimer.innerHTML = renderedTime;
}
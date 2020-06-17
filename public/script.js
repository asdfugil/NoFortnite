fetch("/api/v1/bans")
  .then(r => r.text())
  .then(text => document.getElementById("ban-count").innerHTML = text)
  .catch(error => {
    console.error(error)
    document.getElementById("ban-count").innerHTML = "Failed to fetch ban count from https://no-fortnite.glitch.me/api/v1/bans"
  })
window.odometerOptions = {
  selector: '.my-numbers',
  format: '(,ddd).dd', 
  duration: 3000,
  theme: 'car',
  animation: 'count' 
}
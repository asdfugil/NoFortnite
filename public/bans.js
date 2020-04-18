    fetch("/api/v1/bans")
      .then(r =>r.text())
      .then(text => document.getElementById("ban-count").innerHTML = text + " people has been banned")
      .catch(error => {
      console.error(error)
      document.getElementById("ban-count").innerHTML = "Failed to fetch ban count from https://no-fortnite.glitch.me/api/v1/bans"
    })
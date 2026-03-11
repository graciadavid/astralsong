export default async function handler(req, res) {
  const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
    },
    body: "grant_type=client_credentials"
  })

  const tokenData = await tokenRes.json()
  const token = tokenData.access_token

  const searchRes = await fetch(
    "https://api.spotify.com/v1/search?q=happy&type=track&limit=1",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  const data = await searchRes.json()
  const track = data.tracks.items[0]

  const html = `
  <html>
  <body style="font-family:Arial;background:#0f1118;color:white;text-align:center;padding:40px">
  <h2>Tu canción cósmica de hoy</h2>
  <p style="font-size:22px">${track.name}</p>
  <p>${track.artists[0].name}</p>
  <a href="${track.external_urls.spotify}" target="_blank"
  style="background:#1db954;color:white;padding:12px 20px;border-radius:8px;text-decoration:none">
  Escuchar en Spotify
  </a>
  </body>
  </html>
  `

  res.setHeader("Content-Type", "text/html")
  res.status(200).send(html)
}
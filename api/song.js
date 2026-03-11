export default async function handler(req, res) {

res.setHeader("Access-Control-Allow-Origin", "*")
res.setHeader("Access-Control-Allow-Methods", "GET")

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET

const tokenRes = await fetch(
"https://accounts.spotify.com/api/token",
{
method:"POST",
headers:{
"Content-Type":"application/x-www-form-urlencoded",
Authorization:
"Basic " + Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64")
},
body:"grant_type=client_credentials"
}
)

const tokenData = await tokenRes.json()

const token = tokenData.access_token

const search = await fetch(
"https://api.spotify.com/v1/search?q=happy&type=track&limit=1",
{
headers:{
Authorization:`Bearer ${token}`
}
}
)

const data = await search.json()

const track = data.tracks.items[0]

res.status(200).json({
song:track.name,
artist:track.artists[0].name,
url:track.external_urls.spotify
})

}
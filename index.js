import fetch from "node-fetch"
import {interpolate} from "./interpolate"

const btcUrl = "https://api.coindesk.com/v2/bpi/currentprice.json"
const goldUrl = "https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD"
const djiUrl = "https://query1.finance.yahoo.com/v7/finance/quote?symbols=^dji"

const htmlString ="<style>html {background: #161719; color:#d0d0d0}* {overflow: hidden;font:72px Lucida Console,Lucida Sans Typewriter,monaco,Bitstream Vera Sans Mono,monospace} div {display: flex} div > span {opacity: .3;margin-right:50px}</style><div><span>Bitcoin</span>$${btc}</div><div><span>Gold</span>$${au}</div><div><span>Dow </span>$${dji}</div><div style='position:absolute; width: 100%; height: 200px; bottom: 0px; left: 0px;background:black'><span style='padding:10px;opacity:1'>$ curl https://cli.news</span></div>"
const curlString = "Btc = $${btc}\nAu  = $${au}\nDow = $${dji}\n"

async function getBtc(currency) {
  // Currency: "USD", "GBP", "EUR", "CNY"
  if (!currency) currency = "USD"
  let res = await fetch(btcUrl)
  res = await res.json()
  return res.bpi[currency].rate_float
}

async function getGold() {
  let res = await fetch(goldUrl)
  res = await res.json()
  return res[0].spreadProfilePrices[0].ask
}

async function getDji() {
  let res = await fetch(djiUrl)
  res = await res.json()
  return res.quoteResponse.result[0].regularMarketPrice
}

module.exports = async (req, res) => {
  try {
    const userAgent = req.headers["user-agent"].toLowerCase()
    const btcPrice = await getBtc("USD")
    const goldPrice = await getGold()
    const djiPrice = await getDji()
    const data = {
      btc: btcPrice, au: goldPrice, dji: djiPrice
    }
    if (userAgent.includes("curl") || userAgent.includes("wget")) {
      res.status(200).send(interpolate(curlString, data))
    } else {
      res.status(200).send(interpolate(htmlString, data))
    }
  } catch (err){
    console.log(err)
    process.exit(1)
  }
}

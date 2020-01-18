let templateCache = {}

async function getTemplate(url) {
  let templateString
  // if not ref html file, assumes a string (as in error)
  if (url.split('.html').length === 1) { return url }
  // if in the cache, return without fetch
  if (templateCache[url]) return templateCache[url]
  // get the html file return text
  // if browser
  if (typeof window === 'undefined') {
    const { readFileSync } = require('fs')
    const { join } = require('path')
    const mySchema = readFileSync(join(__dirname, url)).toString('utf8')
    console.log(mySchema)
  } else {
    let res = await fetch(url)
    const templateString = res.text()
  }

  templateCache[url] = templateString
  return templateString
}

export function interpolate(templateString, data) {
  const names = Object.keys(data);
  const vals = Object.values(data);
  return new Function(...names, `return \`${templateString}\`;`)(...vals)
}



export async function render(template, data) {
  const templateString = await getTemplate(template)
  const interpolatedTemplateString = interpolate(templateString, data)
}

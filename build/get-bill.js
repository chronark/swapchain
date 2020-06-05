/**
 * Helper script to extract all 3rd party dependencies from package.json into a .tsv file.
 * This can be used by our product owners to update the bill of materials on their own.
 *
 * Licenses can obviously not be extracted but those are unlikely to change in the first place.
 *
 * Quickstart:
 *      cd ./build
 *      node ./get-bill.js
 *
 *      copy paste dependencies from billofmaterials.tsv to the google spreadsheet
 */

const fs = require("fs")
const package = JSON.parse(fs.readFileSync("../package.json"))

let table = []
let file = ""
let id = 0

Object.entries({ ...package.devDependencies, ...package.dependencies }).forEach((dep) => {
  table.push({ "#": id++, Name: dep[0], Version: dep[1] })
  file += `${id++}\t${dep[0]}\t${dep[1]}\n`
})
console.table(table)
fs.writeFileSync("billofmaterials.tsv", file)

console.log(">billofmaterials.tsv has been created!")

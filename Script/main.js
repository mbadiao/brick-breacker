import { initMap, createTwoDiv, removeOldBricks } from './buildMap.mjs'
import { homeHtml, allBrickHome } from './templates.mjs'
import { play } from './gameplay.mjs'
import { playSound } from "./utils.mjs";

document.addEventListener('DOMContentLoaded', function () {
  start()
  let life = 3
  document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      play(life)
    }
  })
})

function start () {
  gameBody.innerHTML = homeHtml
  createTwoDiv()
  initMap(allBrickHome)
}

const intervalle =
  (gameBody.offsetWidth - gameBody.offsetWidth * 0.05 * 16) / 17;


export function createTwoDiv() {
  let firstDiv = document.createElement('div'),
    secondDiv = document.createElement('div');
  firstDiv.setAttribute('id', 'firstdiv');
  secondDiv.setAttribute('id', 'secondDiv');
  firstDiv.style.width = '100%';
  secondDiv.style.width = '100%';
  firstDiv.style.height = '95%';
  secondDiv.style.height = '5%';
  gameBody.append(firstDiv, secondDiv);
}

export function initMap(allBrick) {
  allBrick.forEach((line, rowIndex) => {
    let divLine = document.createElement('div');
    divLine.classList.add('divline');
    divLine.setAttribute('id', 'divline' + rowIndex.toString());
    let toThediv = document.getElementById('firstdiv');
    toThediv.appendChild(divLine);
    line.forEach((type, columnIndex) => {
      let color = type == 1 ? 'rgba(255, 75, 0, 1)' : 'rgba(242, 0, 19, 1)';
      setBrick(color, columnIndex, rowIndex);
    });
  });
}

function setBrick(color, columnIndex, rowIndex) {
  const id = 'brickId' + rowIndex.toString() + columnIndex.toString();
  const div = document.createElement('div');
  div.classList.add('setBrick');
  div.setAttribute('id', id);
  div.style.backgroundColor = color;
  div.style.marginLeft = `${intervalle + columnIndex * (intervalle + 0.05 * gameBody.offsetWidth)}px`;
  const name = 'divline' + rowIndex.toString();
  document.getElementById(name).appendChild(div);
}

export function removeOldBricks() {
  const oldBrickContainers = document.querySelectorAll('.divline');
  oldBrickContainers.forEach(container => container.remove());
}

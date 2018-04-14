const POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

function fetchPkmn(num) {
  const req = new Request(`${POKEAPI}/${num}`);
  return fetch(req);
}

window.onload = () => {
  document.querySelector('body').addEventListener('click', (event) => {
    console.log(event);
    const modal = document.querySelector('#modal');
    const content = document.querySelector('.modal-content');
    const contentName = document.querySelector('.modal-content__header__name');
    const contentNum = document.querySelector('.modal-content__header__number');
    const contentSprite = document.querySelector('.modal-content__body__sprite__img',);
    const contentType = document.querySelector('.modal-content__body__type');
    const contentHeight = document.querySelector('.modal-content__body__stats__height',);
    const contentWeight = document.querySelector('.modal-content__body__stats__weight',);
    // let loading = true;
    let { num } = event.target.dataset;
    if (!num && event.target.parentElement) {
      num = event.target.parentElement.dataset.num;
    }
    if (num) {
      const pokedata = fetchPkmn(num);
      pokedata
        .then(res => res.json())
        .then((data) => {
          // content.innerText = JSON.stringify(data, null, 2);
          contentName.innerText = data.name.toUpperCase();
          contentNum.innerText = `#${num}`;
          contentSprite.src = `./img/${num}.png`;
          contentSprite.classList.remove('loading');
          const typesStr = data.types
            .map(type => type.type.name)
            .join(', ')
            .toUpperCase();
          contentType.innerText = typesStr;
          contentHeight.innerText = `HEIGHT ${data.height}`;
          contentWeight.innerText = `WEIGHT ${data.weight}`;
          return data;
        })
        .catch(err => console.error(err));
      modal.style.display = 'flex';
      // loading = false;
    }
    if (event.target === modal) {
      modal.style.display = 'none';
      contentName.innerText = '';
      contentNum.innerText = '';
      contentSprite.src = './img/pokeball.png';
      contentSprite.classList.add('loading');
      contentType.innerText = 'searching ..';
      contentHeight.innerText = '';
      contentWeight.innerText = '';
      // loading = true;
    }
  });
};

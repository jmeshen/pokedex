const POKEAPI = 'https://pokeapi.co/api/v2/pokemon';

function fetchPkmn(num) {
  const req = new Request(`${POKEAPI}/${num}`);
  return fetch(req);
}

window.onload = () => {
  document.querySelector('body').addEventListener('click', (event) => {
    const modal = document.querySelector('#modal');
    const content = document.querySelector('.modal-content');
    const searching = document.querySelector('.modal-searching');
    const searchingSprite = document.querySelector('.modal-searching__body__sprite',);
    const searchingError = document.querySelector('.modal-searching__body__error',);
    const modalNext = document.querySelector('.modal-next');
    const modalPrev = document.querySelector('.modal-prev');
    const contentName = document.querySelector('.modal-content__header__name');
    const contentNum = document.querySelector('.modal-content__header__number');
    const contentSprite = document.querySelector('.modal-content__body__sprite__img',);
    const contentType = document.querySelector('.modal-content__body__type');
    const contentHeight = document.querySelector('.modal-content__body__stats__height',);
    const contentWeight = document.querySelector('.modal-content__body__stats__weight',);
    let { num } = event.target.dataset;
    if (!num && event.target.parentElement) {
      num = event.target.parentElement.dataset.num;
    }

    if (event.target === modalNext || event.target === modalPrev) {
      if (contentNum.innerText) {
        num = +contentNum.innerText.slice(1);
        contentName.innerText = '';
        contentNum.innerText = '';
        contentHeight.innerText = '';
        contentWeight.innerText = '';
        modalNext.classList.add('hide');
        modalPrev.classList.add('hide');
        searching.classList.remove('hide');
        content.classList.add('hide');
        if (event.target === modalPrev) {
          num--;
        } else if (event.target === modalNext) {
          num++;
        }
      }
    }
    if (num) {
      modal.classList.remove('hide');
      searching.classList.remove('hide');
      const pokedata = fetchPkmn(num);
      pokedata
        .then((res) => {
          if (!res.ok) {
            searchingSprite.classList.add('hide');
            searchingError.classList.remove('hide');
            modalNext.classList.add('hide');
            modalPrev.classList.add('hide');
            throw Error(res.statusText);
          }
          res.json().then((data) => {
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
            if (num < 721) {
              modalNext.classList.remove('hide');
            }
            if (num > 1) {
              modalPrev.classList.remove('hide');
            }
            searching.classList.add('hide');
            content.classList.remove('hide');
            return data;
          });
        })
        .catch(err => console.error(err));
    }
    if (event.target === modal) {
      modal.classList.add('hide');
      content.classList.add('hide');
      searchingError.classList.add('hide');
      contentName.innerText = '';
      contentNum.innerText = '';
      contentType.innerText = '';
      contentHeight.innerText = '';
      contentWeight.innerText = '';
      modalNext.classList.add('hide');
      modalPrev.classList.add('hide');
    }
  });
};

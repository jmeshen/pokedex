const POKEAPI = 'https://pokeapi.co/api/v2/pokemon';
const MAX_PKMN = 802;

function fetchPkmn(num) {
  const req = new Request(`${POKEAPI}/${num}/`);
  return fetch(req);
}

window.onload = () => {
  const modal = document.querySelector('#modal');
  const content = document.querySelector('.modal-content');
  const searching = document.querySelector('.modal-searching');
  const searchingSprite = document.querySelector('.modal-searching__body__sprite',);
  const searchingError = document.querySelector('.modal-searching__body__error',);
  const modalNext = document.querySelector('.modal-next');
  const modalPrev = document.querySelector('.modal-prev');
  const modalClose = document.querySelector('.modal-close');
  const contentName = document.querySelector('.modal-content__header__name');
  const contentNum = document.querySelector('.modal-content__header__number');
  const contentSprite = document.querySelector('.modal-content__body__sprite__img',);
  const contentType = document.querySelector('.modal-content__body__type');
  const contentHeight = document.querySelector('.modal-content__body__stats__height',);
  const contentWeight = document.querySelector('.modal-content__body__stats__weight',);
  let num;

  function updatePkmn() {
    modal.classList.remove('hide');
    searching.classList.remove('hide');
    const pokedata = fetchPkmn(num);
    pokedata
      .then((res) => {
        if (!res.ok) {
          searchingSprite.classList.add('hide');
          searchingError.classList.remove('hide');
          modalNext.classList.add('hidden');
          modalPrev.classList.add('hidden');
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
          if (num < MAX_PKMN) {
            modalNext.classList.remove('hidden');
          }
          if (num > 1) {
            modalPrev.classList.remove('hidden');
          }
          searching.classList.add('hide');
          content.classList.remove('hide');
          return data;
        });
      })
      .catch(err => console.error(err));
  }

  function clearContentShowSearch() {
    contentName.innerText = '';
    contentNum.innerText = '';
    contentHeight.innerText = '';
    contentWeight.innerText = '';
    modalNext.classList.add('hidden');
    modalPrev.classList.add('hidden');
    searching.classList.remove('hide');
    content.classList.add('hide');
  }

  function closeModal() {
    modal.classList.add('hide');
    content.classList.add('hide');
    searchingError.classList.add('hide');
    contentName.innerText = '';
    contentNum.innerText = '';
    contentType.innerText = '';
    contentHeight.innerText = '';
    contentWeight.innerText = '';
    modalNext.classList.add('hidden');
    modalPrev.classList.add('hidden');
  }

  document.querySelector('body').addEventListener('click', (event) => {
    num = event.target.dataset.num;
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
        modalNext.classList.add('hidden');
        modalPrev.classList.add('hidden');
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
      updatePkmn();
    }
    if (event.target === modal || event.target === modalClose) {
      closeModal();
    }
  });
  document.querySelector('body').addEventListener('keyup', (event) => {
    if (event.keyCode === 27) {
      closeModal();
    }
    if (event.keyCode === 37) {
      if (contentNum.innerText) {
        num = +contentNum.innerText.slice(1);
        if (num > 1) {
          clearContentShowSearch();
          num--;
          updatePkmn();
        }
      }
    }
    if (event.keyCode === 39) {
      if (contentNum.innerText) {
        num = +contentNum.innerText.slice(1);
        if (num < MAX_PKMN) {
          clearContentShowSearch();
          num++;
          updatePkmn();
        }
      }
    }
  });
};

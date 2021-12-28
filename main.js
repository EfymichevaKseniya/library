let booksItems = [];

function renderBooks(book) {
  localStorage.setItem('booksItems', JSON.stringify(booksItems));

  const list = document.querySelector('.books__items');
  const item = document.querySelector(`[data-key='${book.id}']`);

  if (book.deleted) {
    item.remove();
    if (booksItems.length === 0) list.innerHTML = '';
    return
  }
  const isRead = book.checked ? 'done': '';
  const node = document.createElement('li');
  node.setAttribute('class', `book__item ${isRead}`);
  node.setAttribute('data-key', book.id);
  node.innerHTML = `
    <span class='book__item-title'>${book.title}</span>
    <div class='book__item-btns'>
      <button class="book__btn edit__book">ред.</button>
      <button class="book__btn read__book">читать</button>
      <button class= 'book__btn done__book'>прочитано</button>
      <button class="book__btn delete__book">x</button>
    </div>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addBook(title, text) {
  const book = {
    text,
    title,
    checked: false,
    id: Math.floor(Math.random() * 10000),
  };

  booksItems.push(book);
  renderBooks(book);
}

const form = document.querySelector('#content2');
  let formData = new FormData();
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let url = 'https://apiinterns.osora.ru/';
    const files = document.querySelector('input[type=file]');
    const input = form.querySelector('.form__content-input');
    formData.append('login', 'test');
    formData.append('file', files.files[0]);
    fetch(url, {
      method: 'POST',
      body: formData,
      })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (input.value === '') {
          addBook(data.title, data.text);
        } else {
          addBook(input.value, data.text);
        }
        input.value = '';
      });
  });

  const formManual = document.querySelector('#content1');
    formManual.addEventListener('click', (e) => {
    e.preventDefault();

    const input = document.querySelector('.form__content-input');
    const textarea = document.querySelector('.form__content-textarea');
    const btnAdd = document.querySelector('.btn__save');

    btnAdd.addEventListener('click', () => {
      const title = input.value.trim();
      const text = textarea.value.trim();
      if (text !== '') {
        addBook(title, text);
        input.value = '';
        textarea.value = '';
      }
    });
  });

  function toggleDone(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    booksItems[index].checked = !booksItems[index].checked;
    renderBooks(booksItems[index]);
  }

  function readBook(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    const readArea = document.querySelector('.read-area');
    readArea.innerHTML = '';

    const node = document.createElement('div');
    node.setAttribute('class', 'read__area-wrapper');
    node.innerHTML = `
    <h2 class='read__area-title'>${booksItems[index].title}</h2>
    <p class='read__area-text'>${booksItems[index].text}</p>
    `;
    readArea.append(node);
  }

  function editBook(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    const readArea = document.querySelector('.read-area');
    readArea.innerHTML = '';

    const node = document.createElement('form');
    node.setAttribute('class', 'form__content');
    node.innerHTML = `
    <input class="form__content-input" type="text" placeholder=${booksItems[index].title} name="title__file">
    <textarea class="form__content-textarea" type="text" value=${booksItems[index].text} name="content__file"></textarea>
    <button class="input__file-button btn__save" type="submit">Сохранить</button>
    `;
    readArea.append(node);
  }

  function deleteBook(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    const book = {
      deleted: true,
      ...booksItems[index]
    };
    booksItems = booksItems.filter((item) => item.id !== Number(key));
    renderBooks(book);
  }

  const list = document.querySelector('.books__items');
    list.addEventListener('click', (e) => {
      if (e.target.classList.contains('done__book')) {
        const itemKey = e.target.parentElement.parentElement.dataset.key;
        toggleDone(itemKey);
      }
      
      if (e.target.classList.contains('delete__book')) {
        const itemKey = e.target.parentElement.parentElement.dataset.key;
        deleteBook(itemKey);
      }

      if (e.target.classList.contains('read__book')) {
        const itemKey = e.target.parentElement.parentElement.dataset.key;
        readBook(itemKey);
      }

      if (e.target.classList.contains('edit__book')) {
        const itemKey = e.target.parentElement.parentElement.dataset.key;
        editBook(itemKey);
      }
    });

document.addEventListener('DOMContentLoaded', () => {
  const books = localStorage.getItem('books');

  if (books) {
    booksItems = JSON.parse(books);
    booksItems.forEach((book) => {
      renderBooks(book);
    });
  }
});

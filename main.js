let books = [];

function renderBooks(book) {
  localStorage.setItem('books', JSON.stringify(books));

  const list = document.querySelector('.books__items');
  const item = document.querySelector(`[data-key='${book.id}']`);

  if (book.deleted) {
    item.remove();
    if (books.length === 0) list.innerHTML = '';
    return
  }
  const isRead = book.checked ? 'done': '';
  const node = document.createElement('li');
  node.setAttribute('class', `book__item ${isRead}`);
  node.setAttribute('data-key', book.id);
  node.innerHTML = `
    <div class='book__item-btns'>
    <span class='book__item-title'>${book.title}</span>
      <button class="book__btn done__book">
        ${book.checked ? 'unread' : 'read'}
      </button>
      <button class="book__btn delete__book">delete</button>
    </div>
  `;

  if (item) {
    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addBook(title, text) {
  console.log(books)
  const book = {
    text,
    title,
    checked: false,
    id: Math.floor(Math.random() * 10000),
  };

  books.push(book);
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
        console.log(data);
        addBook(input.value, data.text);
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

document.addEventListener('DOMContentLoaded', () => {
  const books = localStorage.getItem('books');

  if (books) {
    booksItem = JSON.parse(books);
    booksItem.forEach((book) => {
    renderBooks(book);
    });
  }
});

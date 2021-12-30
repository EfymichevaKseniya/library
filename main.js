let booksItems = [];

function renderBook(book) {
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
  renderBook(book);
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

    const title = input.value.trim();
    const text = textarea.value.trim();
    if (text !== '') {
      addBook(title, text);
      input.value = '';
      textarea.value = '';
    }
  });

  function toggleDone(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    booksItems[index].checked = !booksItems[index].checked;
    renderBook(booksItems[index]);
  }

  function readBook(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    const readArea = document.querySelector('.read__area');
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
    const readArea = document.querySelector('.read__area');
    readArea.innerHTML = '';

    const node = document.createElement('form');
    node.setAttribute('class', 'read__area-form');
    node.innerHTML = `
    <input class="read__area-input" type="text" value=${booksItems[index].title} name="title__file">
    <textarea class="read__area-textarea" type="text" name="content__file">${booksItems[index].text}</textarea>
    <button class="read__area-btn" type="button">Сохранить</button>
    `;
    readArea.append(node);
    const input = document.querySelector('.read__area-input');
    const textarea = document.querySelector('.read__area-textarea');
    const editBtn = document.querySelector('.read__area-btn');
    
    editBtn.addEventListener('click', () => {
      if (input.value !== '' && textarea.value !== '') {
        booksItems[index].title = input.value;
        booksItems[index].text = textarea.value;
        readArea.innerHTML = '';
      } else {
        const err = document.createElement('p');
        err.setAttribute('class', 'empty');
        err.textContent = 'Поля не могут быть пустыми';
        node.before(err);
      }
      renderBook(booksItems[index]);
    });
  }

  function deleteBook(key) {
    const index = booksItems.findIndex((item) => item.id === Number(key));
    const book = {
      deleted: true,
      ...booksItems[index]
    };
    booksItems = booksItems.filter((item) => item.id !== Number(key));
    renderBook(book);
  }

  function shiftBook(key) {
    const dropBook = document.querySelector(`.book__item[data-key="${key}"]`);
    const dropzone = document.querySelector('.books__items-favorite');

    dropBook.onmousedown = function(e) {

    let coords = getCoords(dropBook);
    let shiftX = e.pageX - coords.left;
    let shiftY = e.pageY - coords.top;

    dropBook.classList.add('move');
    dropzone.appendChild(dropBook);
    moveAt(e);
    dropBook.onmousedown = null;

    function moveAt(e) {
      dropBook.style.left = e.pageX - shiftX + 'px';
      dropBook.style.top = e.pageY - shiftY + 'px';
    }

    document.onmousemove = function(e) {
      moveAt(e);
    };

    dropBook.onmouseup = function() {
      document.onmousemove = null;
      dropBook.onmouseup = null;
      dropBook.classList.remove('move');
      dropBook.removeAttribute('style');
    };

    }

    dropBook.ondragstart = function() {
      return false;
    };

    function getCoords(elem) {
      let box = elem.getBoundingClientRect();
      return {
        top: box.top + scrollY,
        left: box.left + scrollX,
      };
    }
  }

  // function dragstart_handler(key) {
  //   // Добавить id целевого элемента в объект передачи данных
  //   key.dataTransfer.setData("application/my-app", ev.target.id);
  //   key.dataTransfer.effectAllowed = "copy";
  // }
  // function dragover_handler(key) {
  //   key.preventDefault();
  //   key.dataTransfer.dropEffect = "copy"
  // }
  // function drop_handler(key) {
  //   key.preventDefault();
  //   // Получить id целевого элемента и добавить перемещаемый элемент в его DOM
  //   const data = key.dataTransfer.getData("application/my-app");
  //   key.target.appendChild(document.getElementById(data));
  // }

  function bookInteractive(list) {
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

      if (e.target.classList.contains('book__item')) {
        const itemKey = e.target.dataset.key;
        // dragstart_handler(itemKey);
        // dragover_handler(itemKey);
        // drop_handler(itemKey);
        shiftBook(itemKey);
      }
    });
  }

  // const list = document.querySelector('.books__items');
    

document.addEventListener('DOMContentLoaded', () => {
  const books = localStorage.getItem('books');
  bookInteractive(document.querySelector('.books__items'));
  bookInteractive(document.querySelector('.books__items-favorite'));

  if (books) {
    booksItems = JSON.parse(books);
    booksItems.forEach((book) => {
      renderBook(book);
    });
  }
});

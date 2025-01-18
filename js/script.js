const STORAGE_KEY = 'BOOKSHELF_APP';
let books = [];

function isStorageAvailable(){
    if (typeof (Storage) === 'undefined') {
        alert('Browser Anda tidak mendukung local storage');
        return false;
    } else {
        return true;
    }
}

function saveData(){
    if (isStorageAvailable()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
    }
}

function loadDataFromStorage() {
    try {
        const serializedData = localStorage.getItem(STORAGE_KEY);
        books = serializedData ? JSON.parse(serializedData) : [];
    } catch (e) {
        console.error('Gagal memuat data dari localStorage', e);
        books = [];
    }
}

function generateId(){
    return +new Date();
}

function addBook(id, title, author, year, isComplete){
    const book = { id, title, author, year, isComplete };
    books.push(book);
    saveData();
}

function findBook(id){
    return books.find(book => book.id === id) || null;
}

function findIndexBook(id){
    return books.findIndex(book => book.id === id);
}

function editBook(id){
    const book = findBook(id);

    if (book) {
        const updatedTitle = prompt("Edit Judul Buku", book.title) || book.title;
        const updatedAuthor = prompt("Edit Penulis Buku", book.author) || book.author;
        const updatedYear = prompt("Edit Tahun Buku", book.year) || book.year;
    
        book.title = updatedTitle.trim();
        book.author = updatedAuthor.trim();
        book.year = parseInt(updatedYear.trim());
    
        saveData();
        renderBooks();
    }
}

function removeBook(id){
    const bookIndex = findIndexBook(id);

    if (bookIndex !== -1) {
        books.splice(bookIndex, 1);
        saveData();
        renderBooks();
    }
}

const toggleBookCompletion = (id) => {
    const book = findBook(id);

    if (book) {
      book.isComplete = !book.isComplete;
      saveData();
      renderBooks();
    }
};

function renderBooks(searchTerm = '') {
    const incompleteBookList = document.getElementById('incompleteBookList');
    const completeBookList = document.getElementById('completeBookList');

    incompleteBookList.innerHTML = '';
    completeBookList.innerHTML = '';

    books.filter(book => book.title.toLowerCase().includes(searchTerm))
        .forEach(book => {
            const bookElement = createBookElement(book);

            if (book.isComplete) {
                completeBookList.appendChild(bookElement);
            } else {
                incompleteBookList.appendChild(bookElement);
            }
        });
}

function createBookElement(book) {
    const container = document.createElement('div');

    container.innerHTML = `
        <h3>${book.title}</h3>
        <p>Penulis: ${book.author}</p>
        <p>Tahun: ${book.year}</p>
        <div>
            <button class="isCompleteButton">${book.isComplete ? 'Belum Selesai Dibaca' : 'Selesai Dibaca'}</button>
            <button class="deleteButton">Hapus Buku</button>
            <button class="editButton">Edit Buku</button>
        </div>
    `;

    container.querySelector('.isCompleteButton').addEventListener('click', () => toggleBookCompletion(book.id));
    container.querySelector('.deleteButton').addEventListener('click', () => removeBook(book.id));
    container.querySelector('.editButton').addEventListener('click', () => editBook(book.id));

    return container;
}

document.getElementById('bookFormIsComplete').addEventListener('change', () => {
    const buttonBookFormSubmit = document.getElementById('bookFormSubmit');

    if (document.getElementById('bookFormIsComplete').checked) {
        buttonBookFormSubmit.innerHTML = 'Masukkan Buku ke rak <span>Selesai dibaca</span>';
    } else {
        buttonBookFormSubmit.innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
    }
});

document.getElementById('searchSubmit').addEventListener('click', (event) => {
    event.preventDefault();

    const searchTerm = document.getElementById('searchBookTitle').value.toLowerCase();
    renderBooks(searchTerm);
    
});

document.getElementById('bookFormSubmit').addEventListener('click', (event) => {
    event.preventDefault();

    const id = generateId();
    const title = document.getElementById('bookFormTitle').value.trim();
    const author = document.getElementById('bookFormAuthor').value.trim();
    const year = parseInt(document.getElementById('bookFormYear').value.trim());
    const isComplete = document.getElementById("bookFormIsComplete").checked;
    
    if (!title || !author || isNaN(year)) {
        alert('Mohon isi semua data dengan benar.');
        document.getElementById('bookForm').reset();
        return;
    }
    
    addBook(id, title, author, year, isComplete);
    renderBooks();
    
    document.getElementById('bookForm').reset();
});

window.addEventListener('DOMContentLoaded', () => {
    if (isStorageAvailable()) {
        loadDataFromStorage();
        renderBooks();
    }
});

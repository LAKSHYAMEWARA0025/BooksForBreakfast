// // Google Books API Key (replace with your own)
// const API_KEY = 'AIzaSyDy1nRNHDWhAFIVvla0WJ89JC8gXTUD2O8';
// DOM Elements
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const recommendationsDiv = document.getElementById('recommendations');
const toReadList = document.getElementById('to-read-list');
const inProgressList = document.getElementById('in-progress-list');
const completedList = document.getElementById('completed-list');

// Google Books API Key (replace with your own)
const API_KEY = 'AIzaSyDy1nRNHDWhAFIVvla0WJ89JC8gXTUD2O8';

// Fetch book recommendations from Google Books API
async function fetchBooks(query) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`);
  const data = await response.json();
  return data.items || [];
}

// Fetch book details by ID
async function getBookDetails(bookId) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`);
  const data = await response.json();
  return data;
}

// Display book recommendations
function displayRecommendations(books) {
  recommendationsDiv.innerHTML = '';
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <h3>${book.volumeInfo.title}</h3>
      <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
      <button onclick="addToLibrary('${book.id}')">Add to Library</button>
    `;
    recommendationsDiv.appendChild(bookCard);
  });
}

// Add book to library
async function addToLibrary(bookId) {
  const book = await getBookDetails(bookId);
  if (book) {
    saveBookToLocalStorage(book);
    updateLibraryUI();
  }
}

// Save book to LocalStorage
function saveBookToLocalStorage(book) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  const exists = library.some(b => b.id === book.id);
  if (!exists) {
    library.push({ ...book, status: 'to-read' });
    localStorage.setItem('library', JSON.stringify(library));
  } else {
    alert('This book is already in your library!');
  }
}

// Update library UI
function updateLibraryUI() {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  toReadList.innerHTML = '';
  inProgressList.innerHTML = '';
  completedList.innerHTML = '';

  library.forEach(book => {
    const li = document.createElement('li');
    li.textContent = book.volumeInfo.title;

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start Reading';
    startBtn.className='start';
    startBtn.addEventListener('click', () => updateBookStatus(book.id, 'in-progress'));

    const completeBtn = document.createElement('button');
    completeBtn.textContent = 'Mark as Completed';
    completeBtn.className='complete';
    completeBtn.addEventListener('click', () => updateBookStatus(book.id, 'completed'));

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.className='remove';
    removeBtn.addEventListener('click', () => removeBookFromLibrary(book.id));

    li.appendChild(removeBtn);
    li.appendChild(startBtn);
    li.appendChild(completeBtn);

    if (book.status === 'to-read') {
      toReadList.appendChild(li);
    } else if (book.status === 'in-progress') {
      inProgressList.appendChild(li);
    } else if (book.status === 'completed') {
      completedList.appendChild(li);
    }
  });
}
//Remove Book From Library
// Remove book from library
function removeBookFromLibrary(bookId) {
    let library = JSON.parse(localStorage.getItem('library')) || [];
    library = library.filter(book => book.id !== bookId); // Remove the book
    localStorage.setItem('library', JSON.stringify(library)); // Update LocalStorage
    updateLibraryUI(); // Refresh the UI
  }

// Update book status
function updateBookStatus(bookId, status) {
  const library = JSON.parse(localStorage.getItem('library')) || [];
  const bookIndex = library.findIndex(b => b.id === bookId);
  if (bookIndex !== -1) {
    library[bookIndex].status = status;
    localStorage.setItem('library', JSON.stringify(library));
    updateLibraryUI();
  }
}
// DOM Elements
const genreButtonsContainer = document.querySelector('.genre-buttons-container');

// Event Listener for Genre Buttons
genreButtonsContainer.addEventListener('click', async (event) => {
  if (event.target.classList.contains('genre-btn')) {
    const genre = event.target.getAttribute('data-genre'); // Get the genre from the button's data attribute
    const books = await fetchBooksByGenre(genre); // Fetch books of the selected genre
    displayRecommendations(books); // Display the books
  }
});

// Fetch books by genre
async function fetchBooksByGenre(genre) {
  const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=subject:${genre}&orderBy=newest&maxResults=10&key=${API_KEY}`);
  const data = await response.json();
  return data.items || [];
}
function displayRecommendations(books) {
    recommendationsDiv.innerHTML = '';
    books.forEach(book => {
      const bookCard = document.createElement('div');
      bookCard.className = 'book-card';
      bookCard.innerHTML = `
        <h3>${book.volumeInfo.title}</h3>
        <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
        <button onclick="addToLibrary('${book.id}')">Add to Library</button>
      `;
      recommendationsDiv.appendChild(bookCard);
    });
  }
  // DOM Elements for Modal
const modal = document.getElementById('book-modal');
const modalTitle = document.getElementById('modal-title');
const modalAuthor = document.getElementById('modal-author');
const modalDescription = document.getElementById('modal-description');
const modalImage = document.getElementById('modal-image');
const closeBtn = document.querySelector('.close-btn');

// Function to open the modal with book details
function openModal(book) {
  modalTitle.textContent = book.volumeInfo.title;
  modalAuthor.textContent = `By: ${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}`;
  modalDescription.textContent = book.volumeInfo.description || 'No description available.';
  modalImage.src = book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/200x300?text=No+Cover';
  modal.style.display = 'block'; // Show the modal
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none'; // Hide the modal
}

// Event Listeners for Modal
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal(); // Close modal if user clicks outside the modal
  }
});

// Update the displayRecommendations function to include clickable book cards
function displayRecommendations(books) {
  recommendationsDiv.innerHTML = '';
  books.forEach(book => {
    const bookCard = document.createElement('div');
    bookCard.className = 'book-card';
    bookCard.innerHTML = `
      <h3>${book.volumeInfo.title}</h3>
      <p>${book.volumeInfo.authors?.join(', ') || 'Unknown Author'}</p>
      <button onclick="addToLibrary('${book.id}')">Add to Library</button>
    `;
    bookCard.addEventListener('click', () => openModal(book)); // Open modal on book card click
    recommendationsDiv.appendChild(bookCard);
  });
}
// Event Listeners
searchBtn.addEventListener('click', async () => {
  const query = searchInput.value;
  if (query) {
    const books = await fetchBooks(query);
    displayRecommendations(books);
  }
});

// Initialize library on page load
updateLibraryUI();
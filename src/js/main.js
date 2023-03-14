import { getJSON } from './utilities/getJSON.js'
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'

let books,
  chosenCategoryFilter = 'All',
  chosenSortOption,
  categories = [],
  cart = []

async function start() {
  books = await getJSON('./data/books.json')
  getCategories()
  addFilters()
  addSortingOptions()
  sortByTitleAscending(books)
  sortByTitleDescending(books)
  sortByAuthorAscending(books)
  sortByAuthorDescending(books)
  displayBooks(books)
}

function sortByTitleAscending(books) {
  books.sort(({ title: aTitle }, { title: bTitle }) =>
    aTitle > bTitle ? 1 : -1)
}

function sortByTitleDescending(books) {
  books.sort(({ title: aTitle }, { title: bTitle }) =>
    aTitle < bTitle ? 1 : -1)
}

function sortByAuthorAscending(books) {
  books.sort(({ author: aAuthor }, { author: bAuthor }) =>
    aAuthor > bAuthor ? 1 : -1)
}

function sortByAuthorDescending(books) {
  books.sort(({ author: aAuthor }, { author: bAuthor }) =>
    aAuthor < bAuthor ? 1 : -1)
}

function sortBypriceAscending(books) {
  books.sort(({ price: aPrice }, { price: bPrice }) =>
    aPrice > bPrice ? 1 : -1)
}

function sortBypriceDescending(books) {
  books.sort(({ price: aPrice }, { price: bPrice }) =>
    aPrice < bPrice ? 1 : -1)
}

function getCategories() {
  let withDuplicates = books.map(book => book.category)
  categories = [...new Set(withDuplicates)]
  categories.sort()
}

function addSortingOptions() {
  document.querySelector('.sortingOptions').innerHTML = /*html*/`
    <label><span>Sort by:</span>
      <select class="sortOption">
      <option>Title ↑</option>
      <option>Title ↓</option>
        <option>Author ↑</option>
        <option>Author ↓</option>
        <option>Price ↑</option>
        <option>Price ↓</option>
      </select>
    </label>
  `
  document.querySelector('.sortOption').addEventListener('change', event => {
    chosenSortOption = event.target.value
    displayBooks()
  })
}

function addFilters() {
  document.querySelector('.filters').innerHTML = /*html*/`
    <label><span>Filter by category:</span>
      <select class="categoryFilter">
        <option>All</option>
        ${categories.map(category => `<option>${category}</option>`).join('')}
      </select>
    </label>
  `
  document.querySelector('.categoryFilter').addEventListener('change', event => {
    chosenCategoryFilter = event.target.value
    displayBooks()
  })
}

function displayBooks() {
  let filteredBooks = books.filter(
    ({ category }) => chosenCategoryFilter === 'All'
      || chosenCategoryFilter === category
  )
  if (chosenSortOption === 'Title ↑') { sortByTitleAscending(filteredBooks) }
  if (chosenSortOption === 'Title ↓') { sortByTitleDescending(filteredBooks) }
  if (chosenSortOption === 'Author ↑') { sortByAuthorAscending(filteredBooks) }
  if (chosenSortOption === 'Author ↓') { sortByAuthorDescending(filteredBooks) }
  if (chosenSortOption === 'Price ↑') { sortBypriceAscending(filteredBooks) }
  if (chosenSortOption === 'Price ↓') { sortBypriceDescending(filteredBooks) }
  let htmlArray = filteredBooks.map(({
    title, author, category, price, image, id
  }) => /*html*/`
    <div class="book col-6 col-sm-4 col-lg-3 col-xxl-2" book-id="${id}">
    <div class="heading">
    <h5>${title}</h5>
    <img src="${image}" class="card-img-top">
    </div>
    <div class="information">
      <p><span><b>Author: </b></span>${author}</p>
      <p><span><b>Category: </b></span>${category}</p>
      <p><span><b>Price: </b></span>${price} SEK</p>
      <button type="button" class="btnBuy btn btn-primary">Buy Now</button>
      <button type="button" class="btnInfo btn btn-primary">More Info</button>
      </div>
      </div>
    
  `)
  document.querySelector('.bookList').innerHTML = htmlArray.join('')

  document.querySelectorAll('.btnInfo').forEach((button) => {
    button.addEventListener('click', (event) => {
      let idElement = event.target.closest('[book-id]')
      if (idElement) {
        let id = Number(idElement.getAttribute('book-id'))
        displayInformation(id)
      } else {
        console.log('Error')
      }
    })
  })

  document.querySelectorAll('.btnBuy').forEach((button) => {
    button.addEventListener('click', (event) => {
      let idElement = event.target.closest('[book-id]')
      if (idElement) {
        let id = Number(idElement.getAttribute('book-id'))
        addToCart(id)
      } else {
        console.log('Error')
      }
    })
  })
}

function displayInformation(bookID) {
  let correctBook = books.filter(({ id }) => bookID === id).shift()

  if (correctBook) {
    let showBookInfo = /*html*/`
      <div class="singleBook col-xxl-12" book-id="${correctBook.id}">
      <h5>${correctBook.title}</h5>
        <img src="${correctBook.image}">
          <p></p>
          <h5>Author:</h5>
          <p>${correctBook.author}</p>
          <h5>Category:</h5>
          <p>${correctBook.category}</p>
          <h5>Description:</h5>
          <p>${correctBook.description}</p>
          <p style="margin-top: -10px; font-weight: bold;">${correctBook.price} SEK</p>
          <button type="button" class="btnBack btn btn-primary">Go Back</button>
          <button type="button" class="btnBuy btn btn-primary">Buy Now</button>
      </div>
  `
    document.querySelector('.bookList').innerHTML = showBookInfo
  } else {
    document.querySelector('.bookList').innerHTML = "No book found with the given ID"
  }

  document.querySelectorAll('.btnBack').forEach((button) => {
    button.addEventListener('click', displayBooks)
  })

  document.querySelectorAll('.btnBuy').forEach((button) => {
    button.addEventListener('click', (event) => {
      let idElement = event.target.closest('[book-id]')
      if (idElement) {
        let id = Number(idElement.getAttribute('book-id'))
        addToCart(id)
      } else {
        console.log('Error')
      }
    })
  })
}

function addToCart(id) {
  let bookToAdd = books.find((book) => book.id === id)
  if (bookToAdd) {
    let existingBook = cart.find((book) => book.id === id)
    if (existingBook) {
      existingBook.quantity += 1
    } else {
      bookToAdd.quantity = 1
      cart.push(bookToAdd)
    }
    updateCart(bookToAdd.title)
  }
}

function updateCart() {
  let cartItems = document.querySelector('.cartItems')
  let cartTotal = document.querySelector('.cartTotal')
  let cartList = document.querySelector('.cartList')

  cartItems.innerHTML = cart.reduce((total, book) => total + book.quantity, 0)
  cartTotal.innerHTML = cart.reduce((total, book) => total + book.price * book.quantity, 0)

  cartList.innerHTML = ''
  cart.forEach((book) => {
    let listItem = document.createElement('li')
    listItem.innerText = `${book.title} x ${book.quantity} - ${book.price} SEK`
    cartList.appendChild(listItem)
  })
}

start()

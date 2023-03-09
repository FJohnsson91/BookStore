import { getJSON } from './utilities/getJSON.js'
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'

let books,
  chosenCategoryFilter = 'All',
  chosenSortOption,
  categories = []

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
    title, author, category, price, image
  }) => /*html*/`
    <div class="book col-6 col-sm-4 col-lg-3 col-xxl-2">
    <img src="${image}" class="card-img-top">
      <h5>${title}</h5>
      <p><span><b>Author: </b></span>${author}</p>
      <p><span><b>Category: </b></span>${category}</p>
      <p><span><b>Price: </b></span>${price} kr</p>
      <button type="button" class="btn btn-primary">Buy Now</button>
    </div>
  `)
  document.querySelector('.bookList').innerHTML = htmlArray.join('')
}

start()

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
  sortByAuthor(books)
  displayBooks(books)
}

function getCategories() {
  let withDuplicates = books.map(book => book.category)
  categories = [...new Set(withDuplicates)]
  categories.sort()
}

function sortByAuthor(books) {
  books.sort(({ author: aLastName }, { author: bLastName }) =>
    aLastName > bLastName ? 1 : -1);
}

function addSortingOptions() {
  document.querySelector('.sortingOptions').innerHTML = /*html*/`
    <label><span>Sort by:</span>
      <select class="sortOption">
        <option>Author</option>
        <option>Price</option>
      </select>
    </label>
  `
  document.querySelector('.sortOption').addEventListener('change', event => {
    chosenSortOption = event.target.value
    displayBooks()
  })
}

function sortByprice(books) {
  books.sort(({ price: aAge }, { price: bAge }) =>
    aAge > bAge ? 1 : -1);
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
  if (chosenSortOption === 'Author') { sortByAuthor(filteredBooks) }
  if (chosenSortOption === 'Price') { sortByprice(filteredBooks) }
  let htmlArray = filteredBooks.map(({
    title, author, category, price
  }) => /*html*/`
    <div class="book">
      <h5>${title}</h5>
      <p><span>Author: </span>${author}</p>
      <p><span>Category: </span>${category}</p>
      <p><span>Price: </span>${price}</p>
    </div>
  `)
  document.querySelector('.bookList').innerHTML = htmlArray.join('')
}

start()

import { getJSON } from './utilities/getJSON.js'
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'

let books, categories = []

async function start() {
  books = await getJSON('./data/books.json')
  getCategories()
  addFilters()
  displayBooks()
}

function getCategories() {
  let withDuplicates = books.map(book => book.category)
  categories = [...new Set(withDuplicates)]
}

function addFilters() {
  document.querySelector('.filters').innerHTML = /*html*/`
    <label><span>Filter by category:</span>
      <select class="categoryFilter">
        <option>All</option>
        ${categories.map(category => `<option>${category}</option>`).join('')}
      </select>
    </label>
  `;
}

function displayBooks() {
  let htmlArray = books.map(({
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

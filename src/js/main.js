import { getJSON } from './utilities/getJSON.js'
import '../scss/style.scss'
import * as bootstrap from 'bootstrap'

let books

async function start() {
  books = await getJSON('./data/books.json')
  displayBooks()
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

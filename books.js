const cheerio = require('cheerio');
const axios = require('axios');
const j2cp = require('json2csv').Parser;
const fs = require('fs'); // j2cp requires fs which is included in node.js

const url="https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";
const baseUrl ="https://books.toscrape.com/catalogue/category/books/mystery_3/";
const books_data = [];


async function getBooks(url){
    try{
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        const books = $("article");
        books.each(function(){
            title = $(this).find("h3 a").text(); //gets the a tag in the h3 header for the bok title
            price = $(this).find(".price_color").text(); //gets the price
            rating = $(this).find(".star-rating").attr("class").split(" ")[1]; //gets the rating
            stock = $(this).find(".instock").text().trim(); //gets the stock

            books_data.push({title, price, rating, stock});
        
        });

        if ($(".next a").length > 0){
            next_page = baseUrl + $(".next a").attr("href");
            getBooks(next_page);
        } else {
            const parser = new j2cp();
            const csv = parser.parse(books_data);
            fs.writeFileSync("./books.csv",csv);
        }
        console.log(books_data);
    }catch(error){
        console.error(error);
    }
}

getBooks(url);

// Path: index.js
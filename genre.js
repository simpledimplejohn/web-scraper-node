const cheerio = require('cheerio');
const axios = require('axios');

const url="https://books.toscrape.com/catalogue/category/books_1/index.html";

async function getGenre(url){
    try{
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const genre = [];
        $('.nav-list li a').each((i,element)=>{
            genre.push({
                title: $(element).text(),
                url: $(element).attr('href')
            })
        })
        return genre;
    }catch(error){
        console.error(error);
    }
}

module.exports = getGenre;

// Path: index.js
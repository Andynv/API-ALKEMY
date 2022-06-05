const { Character, Movies, Categories } = require("../db.js");
const preloMovies = require("../data/movies.json");
const preloCategories = require("../data/categories.json");
const preloCharacter = require("../data/character");

function preloadMovie(){
    preloMovies.forEach(async (e) => {
        try {
            const findMovie = await Movies.findOne({
                where: { title: e.title }
            });
            if (!findMovie) {
                await Movies.create({
                    id: e.id,
                    image: e.image,
                    title: e.title,
                    year: e.year,
                    score: e.score,
                    category: e.category
                });
            }
        } catch (error) {
            console.error(error);
        };
    });
};

function preloadCategories(){
    preloCategories.forEach(async (e) => {
        try {
            const findCategorie = await Categories.findOne({
                where: { name: e.name }
            });
            if (!findCategorie) {
                await Categories.create({
                    name: e.name,
                    image: e.image,
                    films: e.films
                });
            }
        } catch (error) {
            console.error(error);
        };
    });
};

function preloadCharacter(){
    preloCharacter.forEach(async (e) => {
        try {
            const findCharacter = await Character.findOne({
                where: { name: e.name }
            });
            if (!findCharacter) {
                await Character.create({
                    name: e.name,
                    image: e.image,
                    age: e.age,
                    weight: e.weight,
                    history: e.history,
                    films: e.films
                });
            }
        } catch (error) {
            console.error(error);
        };
    });
};


function preloadedJson(){
    console.log("Preloading data...");
    preloadMovie();
    preloadCategories();
    preloadCharacter();
};

module.exports = { preloadedJson };
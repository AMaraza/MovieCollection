const listNameInput = document.querySelector("#list-title")
const addButton = document.querySelectorAll(".add-button")
const movieCount = document.querySelector("#movie-count")
let totalMovies = 0


function AddMovie(buttonElement){
    const addMovie = buttonElement.parentNode;
    const newElement = document.createElement('div');
    const newParagraph = document.createElement('input');
    newParagraph.value = "Movie Name";
    newParagraph.classList.add("movie-title");
    newElement.appendChild(newParagraph);
    newElement.classList.add("movie");
    addMovie.before(newElement);
    totalMovies++;
    movieCount.textContent = `Total Movies: ${totalMovies}`; 
}

function ResetMovies(){
    const movies = document.querySelectorAll('.movie');
    movies.forEach(element => {
        element.remove();
    });
    totalMovies = 0;
    movieCount.textContent = `Total Movies: ${totalMovies}`;
}

const listNameInput = document.querySelector("#list-title")
const addButton = document.querySelectorAll(".add-button")
const movieCount = document.querySelector("#movie-count")
let totalMovies = 0
let draggables = document.querySelectorAll('.movie')
const lists = document.querySelectorAll('.movie-list')

function AddMovie(buttonElement){
    const addMovie = buttonElement.parentNode;
    const newElement = document.createElement('div');
    const newParagraph = document.createElement('input');
    newParagraph.value = "Movie Name";
    newParagraph.classList.add("movie-title");
    newElement.appendChild(newParagraph);
    newElement.classList.add("movie");
    newElement.draggable = true;
    addMovie.before(newElement);
    totalMovies++;
    movieCount.textContent = `Total Movies: ${totalMovies}`; 
    draggables = document.querySelectorAll('.movie');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        })

        draggable.addEventListener('dragend', () => {
           draggable.classList.remove('dragging'); 
        })
    })
}

lists.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault();

        const draggable = document.querySelector('.dragging');
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const movie = elementBelow?.closest('.movie:not(.dragging)');

        if (!movie) {
            container.appendChild(draggable);
            return;
        }

        const box = movie.getBoundingClientRect();
        const insertAfter = e.clientY > box.top + box.height / 2 || e.clientX > box.left + box.width / 2;

        container.insertBefore(
            draggable,
            insertAfter ? movie.nextSibling : movie
        )
    })
})

function ResetMovies(){
    const movies = document.querySelectorAll('.movie');
    movies.forEach(element => {
        element.remove();
    });
    totalMovies = 0;
    movieCount.textContent = `Total Movies: ${totalMovies}`;
}

function getDragAfterElement(container, x, y) {
    const draggableElements = [...container.querySelectorAll('.draggable:not(.dragging)')];

    let closest = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    draggableElements.forEach(child => {
        const box = child.getBoundingClientRect();
        const centerX = box.left + box.width / 2;
        const centerY = box.top + box.height / 2;

        const distance = Math.hypot(x - centerX, y - centerY);

        if (distance < closestDistance) {
            closestDistance = distance;
            closest = child;
        }
    });

    return closest;
}

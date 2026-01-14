const listNameInput = document.querySelector("#list-title")
const addButton = document.querySelectorAll(".add-button")
const movieCount = document.querySelector("#movie-count")
let totalMovies = 0
let draggables = document.querySelectorAll('.movie')
const lists = document.querySelectorAll('.movie-list')
const trashList = document.querySelector('#trash')
console.log(trashList)

function AddMovie(buttonElement = undefined, name = "Movie Name", parent = undefined){
    const newElement = document.createElement('div');
    const newParagraph = document.createElement('input');
    newParagraph.value = name;
    newParagraph.classList.add("movie-title");
    newElement.appendChild(newParagraph);
    newElement.classList.add("movie");
    newElement.draggable = true;
    if (buttonElement != undefined) {
        let addMovie = buttonElement.parentNode;
        addMovie.after(newElement);
        totalMovies++;
    }
    else {
        let addMovie = document.querySelector(`#${parent}`);
        if (addMovie != null) {
            addMovie.appendChild(newElement);
            totalMovies++;
        }
    }
    movieCount.textContent = `Total Movies: ${totalMovies}`; 
    draggables = document.querySelectorAll('.movie');
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
            trashList.style.display = "flex";
        })

        draggable.addEventListener('dragend', () => {
           draggable.classList.remove('dragging'); 
            trashList.style.display = "none";
            if (trashList.children.length > 1) {
                const childrenArray = Array.from(trashList.children);

                childrenArray.forEach(child => {
                    if (child.classList.contains("movie")) {
                        totalMovies--;
                        movieCount.textContent = `Total Movies: ${totalMovies}`;
                        UnloadMovie(child.querySelector('input').value);
                        trashList.removeChild(child);
                    }
                })
            }
        })
    })
}

lists.forEach(container => {
    container.addEventListener('dragover', e => {
        e.preventDefault();

        const draggable = document.querySelector('.dragging');
        const elementBelow = document.elementFromPoint(e.clientX, e.clientY);
        const movie = elementBelow?.closest('.movie:not(.dragging)');

        if (!movie && container.id != "trash") {
            container.appendChild(draggable);
            draggable.style.display = "flex";
            return;
        }
        else if(!movie && container.id == "trash") {
            container.appendChild(draggable);
            draggable.style.display = "none";
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
    localStorage.clear();
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


function PickMovie(buttonElement) {
    const currentList = buttonElement.parentNode.parentNode;

    const allChildren = currentList.children;
    const childArray= Array.from(allChildren).filter(child => {
        return child.classList.contains('movie');
    })
    if (childArray.length > 0) {

        let randomChoice = getRandomInt(0, childArray.length)

        childArray.forEach(child => {
            child.style.backgroundColor = "white";
        })
        childArray[randomChoice].style.backgroundColor = "lightgreen";
    }
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored-minCeiled) + minCeiled);
}


function SaveMovies() {
    lists.forEach(list => {
        const childArray = Array.from(list.children).filter(child => {
            return child.classList.contains('movie');
        })

        childArray.forEach(child => {
            const input = child.querySelector('input');
            const movieName = input.value;
            const movieObject = {movieName: movieName, parentList: list.id};
            localStorage.setItem(movieName, JSON.stringify(movieObject));
        })
    })

    const documentTitle = document.querySelector('#list-title');
    localStorage.setItem("title", JSON.stringify(documentTitle.value));
    
}

function LoadMovies() {
    Object.entries(localStorage).forEach(([key]) => {
        if (key != "title") {
            const movie = JSON.parse(localStorage.getItem(key));
            AddMovie(undefined, movie.movieName, movie.parentList);
        }
        else {
            const websiteTitle = document.querySelector('#list-title').value;
            const websiteTitleStorage = JSON.parse(localStorage.getItem("title"));
            websiteTitle.value = websiteTitleStorage.value;
        }
    })
}

function UnloadMovie(movieName) {
    localStorage.removeItem(movieName);
}

window.addEventListener('DOMContentLoaded', e => {
    LoadMovies();
})

window.addEventListener('beforeunload', function(e) {
    e.preventDefault;
    SaveMovies();
})

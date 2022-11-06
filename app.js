// get elements from the DOM
const moviesList = document.querySelector("#moviesList")
const movieTemplate = document.querySelector("#movieTemplate").content
const movieForm = document.querySelector("#movieForm")
const movieInput = movieForm.querySelector("#movieSearch")
const userFromYear = movieForm.querySelector("#userFromYear")
const userToYear = movieForm.querySelector("#userToYear")
const movieDialog = document.querySelector("#movieDialog")
const movieSelect = document.querySelector("#movieSelect")
const dialogCloseBtn = movieDialog.querySelector("#dialogClose")
const dialogFrame = movieDialog.querySelector("#dialogFrame")
const userCharacterSort = movieForm.querySelector("#userCharacterSort")
const savedMoviesBtn = movieForm.querySelector("#savedMoviesBtn");


// fragment
const movieFragment = new DocumentFragment()

// watchlist array
const savedMovies = JSON.parse(localStorage.getItem("savedMovies")) || []

// events
movieInput.addEventListener("input", (evt) => {
    updateDebounceText(evt.target.value)
})

dialogCloseBtn.addEventListener("click", () => {
    dialogFrame.src = ""
    movieDialog.close()

})

savedMoviesBtn.addEventListener("click",()=>{
    const savedMovies = getSavedMovies()
    renderMovies(savedMovies)
})

moviesList.addEventListener("click", (evt) => {
    const target = evt.target;
    if (target.matches("#movieBtn")) {
        const id = target.dataset.id;
        const foundObject = movies.find(movie => movie.youtube_id == id)
        return renderDialog(foundObject)
    }
    if(target.matches("#saveBtn")){
        const foundMovie = movies[Number(target.dataset.id)]
        saveMovie(foundMovie)
    }
})

movieForm.addEventListener("submit", (evt) => {
    evt.preventDefault()
    updateDebounceText(movieInput.value)

})

// function expressions
const updateDebounceText = debounce((text) => {
    filterMovies(movies, text, movieSelect.value, { from: userFromYear.valueAsNumber, to: userToYear.valueAsNumber }, userCharacterSort.value)
})

// function calls
renderMovies(movies.slice(0, 100))
getOptions(movies)
initialize_years()

// functions
function renderDialog(movie) {
    movieDialog.querySelector("#dialogFrame").src = movie.iframe
    movieDialog.querySelector("#dialogTitle").textContent = movie.full_title
    movieDialog.querySelector("#dialogYear").textContent = movie.year
    movieDialog.querySelector("#dialogRating").textContent = movie.imdb_rating
    movieDialog.querySelector("#dialogRuntime").textContent = getDuration(movie.runtime)
    movieDialog.querySelector("#dialogSummary").textContent = movie.summary
    movieDialog.querySelector("#dialogLink").href = movie.imdb_link
    movieDialog.showModal()
}

function renderMovies(movies) {
    moviesList.innerHTML = ""
    movies.forEach((movie,index) => {
        moviesList.innerHTML = ""
        // if the index is 100 which means we've loaded 100 movies we can just stop the loop 'cause we dont need to loop through every single movie
        const movieClone = movieTemplate.cloneNode(true)
        movieClone.querySelector("#movieTitle").textContent = movie.full_title
        movieClone.querySelector("#movieImg").src = movie.img.mediumResolution
        movieClone.querySelector("#movieYear").textContent = movie.year
        movieClone.querySelector("#movieCategory").textContent = movie.categories.join(", ")
        movieClone.querySelector("#movieRuntime").textContent = getDuration(movie.runtime)
        movieClone.querySelector("#movieRating").textContent = movie.imdb_rating
        movieClone.querySelector("#movieBtn").dataset.id = movie.youtube_id
        movieClone.querySelector("#saveBtn").dataset.id = index
        // append the cloned template to the fragment
        movieFragment.appendChild(movieClone)
    });
    // append the fragment to the list
    moviesList.appendChild(movieFragment)

}

function getOptions(movies) {
    const categories = []
    for (let i = movies.length - 1; i >= 0; i--) {
        for (let j = 0; j < movies[i].categories.length; j++) {
            if (!categories.includes(movies[i].categories[j])) {
                categories.push(movies[i].categories[j])
            }
        }
    }
    renderOptions(categories)

}

function renderOptions(options) {
    options.forEach(option => {
        const newOption = document.createElement("option");
        newOption.value = option
        newOption.textContent = option
        movieSelect.appendChild(newOption)
    })
}

function getDuration(duration) {
    const hours = Math.floor(duration / 60)
    const minutes = duration % 60
    return `${hours} hours, ${minutes} minutes`
}

function debounce(cb, delay = 1000) {
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            cb(...args)
        }, delay)
    }
}

function initialize_years() {
    userFromYear.value = getSmallestYear(movies)
    userToYear.value = getBiggestYear(movies)


    userFromYear.min = getSmallestYear(movies)
    userFromYear.max = Number(userToYear.value) - 1
    userToYear.min = Number(userFromYear.value) + 1
    userToYear.max = getBiggestYear(movies)
}

function filterMovies(movies, queryString, category, period, sortType) {
    const filteredMovies  = movies.filter(movie => {
        const isFiltered = movie.title.match(new RegExp(queryString,"gi")) && (category === "all" || movie.categories.includes(category)) && movie.year >= period?.from && movie.year <= period?.to
        return isFiltered
    })
    const sortedMovies = sortMovies(filteredMovies,sortType);
    renderMovies(sortedMovies)
}

function getBiggestYear(movies) {
    let biggestYear = null
    movies.forEach(movie => {
        if (movie.year >= biggestYear) biggestYear = movie.year
    })
    return biggestYear
}

function getSmallestYear(movies) {
    let smallestYear = movies[0].year
    movies.forEach(movie => {
        if (movie.year < smallestYear) smallestYear = movie.year
    })
    console.log(smallestYear);
    return smallestYear
}

function sortMovies(movies, type) {
    if(type == "") return movies;
    const sortedMovies = movies.sort((movie1, movie2) => {
        if(type === "a-z") return movie1.title.toLowerCase()[0].charCodeAt(0) - movie2.title.toLowerCase()[0].charCodeAt(0)
        if(type === "z-a") return movie2.title.toLowerCase()[0].charCodeAt(0) - movie1.title.toLowerCase()[0].charCodeAt(0)
        if(type === "oldest-latest") return movie1.year - movie2.year
        if(type === "latest-oldest") return movie2.year - movie1.year
        if(type === "low-high") return movie1.imdb_rating - movie2.imdb_rating
        return movie2.imdb_rating - movie1.imdb_rating
    })
    return sortedMovies
}

function getSavedMovies(){
    return JSON.parse(localStorage.getItem("savedMovies")) || []
}

function saveMovie(movie){
    const isSaved = checkIfMovieIsSaved(movie)
    if(isSaved > -1){
        return deleteSavedMovie(isSaved)
    }
    savedMovies.push(movie);
    localStorage.setItem("savedMovies",JSON.stringify(savedMovies))
}

function checkIfMovieIsSaved(movie){
    const isMovieSaved = savedMovies.findIndex(savedMovie => {
        console.log(savedMovie, movie);
        return savedMovie.youtube_id === movie.youtube_id
    })
    console.log(isMovieSaved);
    return isMovieSaved
}

function deleteSavedMovie(index){
    savedMovies.splice(index,1);
    localStorage.setItem("savedMovies",JSON.stringify(savedMovies))
    // renderMovies(savedMovies);
}
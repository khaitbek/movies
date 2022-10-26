// get elements from the DOM
const moviesList = document.querySelector("#moviesList")
const movieTemplate = document.querySelector("#movieTemplate").content
const movieForm = document.querySelector("#movieForm")
const movieInput = document.querySelector("#movieSearch")

// fragment
const movieFragment = new DocumentFragment()

// events
movieInput.addEventListener("input",(evt)=>{
    updateDebounceText(evt.target.value)
})

// function expressions
const updateDebounceText = debounce((text) => {
    filterMovies(movies,text)
})

// function calls
renderMovies(movies.slice(0, 100))

// functions
function renderMovies(movies){
    movies.forEach((movie) => {
        // if the index is 100 which means we've loaded 100 movies we can just stop the loop 'cause we dont need to loop through every single movie
        const movieClone = movieTemplate.cloneNode(true)
        movieClone.querySelector("#movieTitle").textContent = movie.fulltitle
        // movieClone.querySelector("#movieImg").src = movie.ImageURL
        movieClone.querySelector("#movieYear").textContent = movie.movie_year
        movieClone.querySelector("#movieLang").textContent = movie.language
        movieClone.querySelector("#movieCategory").textContent = movie.Categories.split("|").join(" | ")
        movieClone.querySelector("#movieDescription").textContent = movie.summary
        movieClone.querySelector("#movieRating").textContent = movie.imdb_rating
        // append the cloned template to the fragment
        movieFragment.appendChild(movieClone)
    });
    // append the fragment to the list
    moviesList.appendChild(movieFragment)
}
function debounce(cb, delay = 1000){
    let timeout
    return (...args) => {
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            cb(...args)
        },delay)
    }
}
function filterMovies(movies, queryString){
    // const filteredMovies = movies.filter(movie => movie.fulltitle.toLowerCase().contains(queryString.toLowerCase()))
    // renderMovies(filteredMovies)
    movies.forEach(movie => {
        console.log(movie.fulltitle);
    })
}
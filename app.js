// get elements from the DOM
const moviesList = document.querySelector("#moviesList")
const movieTemplate = document.querySelector("#movieTemplate").content
const movieForm = document.querySelector("#movieForm")
const movieInput = document.querySelector("#movieSearch")
const movieDialog = document.querySelector("#movieDialog")
const dialogCloseBtn = movieDialog.querySelector("#dialogClose")
const dialogFrame = movieDialog.querySelector("#dialogFrame")

// fragment
const movieFragment = new DocumentFragment()

// events
movieInput.addEventListener("input",(evt)=>{
    updateDebounceText(evt.target.value)
})

dialogCloseBtn.addEventListener("click",()=>{
    dialogFrame.src = ""
    movieDialog.close()

})

moviesList.addEventListener("click",(evt)=>{
    const target = evt.target;
    if(target.matches("#movieBtn")){
        const id = target.dataset.id;
        const foundObject = movies.find(movie => movie.ytid == id)
        renderDialog(foundObject)
    }
})

// function expressions
const updateDebounceText = debounce((text) => {
    filterMovies(movies,text)
})

// function calls
renderMovies(movies.slice(0, 100))

// functions
function renderDialog(movie){
    movieDialog.querySelector("#dialogTitle").textContent = movie.fulltitle
    movieDialog.querySelector("#dialogYear").textContent = movie.movie_year
    movieDialog.querySelector("#dialogRating").textContent = movie.imdb_rating
    movieDialog.querySelector("#dialogRuntime").textContent = getDuration(movie.runtime)
    movieDialog.querySelector("#dialogSummary").textContent = movie.summary
    movieDialog.querySelector("#dialogLink").href = `https://imdb.com/title/${movie.imdb_id}`
    movieDialog.showModal()
}

function renderMovies(movies){
    movies.forEach((movie) => {
        moviesList.innerHTML = ""
        // if the index is 100 which means we've loaded 100 movies we can just stop the loop 'cause we dont need to loop through every single movie
        const movieClone = movieTemplate.cloneNode(true)
        movieClone.querySelector("#movieTitle").textContent = movie.fulltitle
        movieClone.querySelector("#movieImg").src = `http://i3.ytimg.com/vi/${movie.ytid}/mqdefault.jpg`
        // movieClone.querySelector("#movieImg").src = movie.ImageURL
        movieClone.querySelector("#movieYear").textContent = movie.movie_year
        movieClone.querySelector("#movieCategory").textContent = movie.Categories.split("|").join(" | ")
        movieClone.querySelector("#movieRuntime").textContent = getDuration(movie.runtime)
        movieClone.querySelector("#movieRating").textContent = movie.imdb_rating
        movieClone.querySelector("#movieBtn").dataset.id = movie.ytid
        // append the cloned template to the fragment
        movieFragment.appendChild(movieClone)
    });
    // append the fragment to the list
    moviesList.appendChild(movieFragment)

}

function getDuration(duration){
    return `${Math.floor(duration / 60)} hours, ${duration % 60} minutes`
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
    const filteredMovies = movies.filter(movie => movie.fulltitle.toLowerCase().includes(queryString.toLowerCase()))
    renderMovies(filteredMovies)
}
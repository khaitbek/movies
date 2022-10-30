// get elements from the DOM
const moviesList = document.querySelector("#moviesList")
const movieTemplate = document.querySelector("#movieTemplate").content
const movieForm = document.querySelector("#movieForm")
const movieInput = document.querySelector("#movieSearch")
const movieDialog = document.querySelector("#movieDialog")
const movieSelect = document.querySelector("#movieSelect")
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

movieForm.addEventListener("submit",(evt)=>{
    evt.preventDefault()
    // updateDebounceText(movieInput.value)
    filterMoviesByCategory(movies,movieSelect.value,movieInput.value)
})

// function expressions
const updateDebounceText = debounce((text) => {
    filterMovies(movies,text,movieSelect.value)
})

// function calls
renderMovies(movies.slice(0,100))
getOptions(movies)

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
    console.log(movies);
    moviesList.innerHTML = ""
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

function getOptions(movies){
    const categories = []
    for(let i = movies.length - 1; i >= 0; i--){
        for(let j = 0; j < movies[i].Categories.split("|").length; j++){
            if(!categories.includes(movies[i].Categories.split("|")[j])){
                categories.push(movies[i].Categories.split("|")[j])
            }
        }
    }
    renderOptions(categories)
    
}

function renderOptions(options){
    options.forEach(option => {
        const newOption = document.createElement("option");
        newOption.value = option
        newOption.textContent = option
        movieSelect.appendChild(newOption)
    })
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

function filterMovies(movies, queryString, category = ""){
    if(category){
        return filterMoviesByCategory(movies,category,queryString)
    }
    const filteredMovies = movies.filter(movie => movie.Title.toString().match(new RegExp(queryString,'gi')))
    renderMovies(filteredMovies)
}

function filterMoviesByCategory(allMovies,category,searchValue = ""){
    
    if(searchValue){
        const searchPattern = new RegExp(searchValue,"gi");
        const filteredMovies = movies.filter(movie => movie.Title.toString().match(searchPattern))
        return renderMovies(filteredMovies)
    };
    if(category === "all") return renderMovies(allMovies);
    renderMovies(movies.filter(movie => movie.Categories.includes(category)))
}
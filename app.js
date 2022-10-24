const movieFragment = new DocumentFragment()
const moviesList = document.querySelector("#moviesList")
movies.forEach(movie => {
    const movieTemplate = document.querySelector("#movieTemplate").content.cloneNode(true);
    console.log(movieTemplate);
    movieTemplate.querySelector("#movieTitle").textContent = movie.title
    movieTemplate.querySelector("#movieYear").textContent = movie.year
    movieTemplate.querySelector("#movieCasts").textContent = movie.cast.join(", ")
    movieTemplate.querySelector("#movieTitle").textContent = movie.title
    movieTemplate.querySelector("#movieGenres").textContent = movie.genres.join(" ")

    movieFragment.append(movieTemplate)
})

moviesList.appendChild(movieFragment)
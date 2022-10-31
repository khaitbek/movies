const changedMovies = movies.map(movie => {
    return {
        title:movie.Title.toString(),
        full_title:movie.fulltitle,
        year:movie.movie_year,
        categories:movie.Categories.split("|"),
        summary:movie.summary,
        img:{
            maxResolution:`https://i3.ytimg.com/vi/${movie.ytid}/maxresdefault.jpg`,
            mediumResolution:`https://i3.ytimg.com/vi/${movie.ytid}/mqdefault.jpg`
        },
        imdb_id:movie.imdb_id,
        imdb_rating:movie.imdb_rating,
        runtime:movie.runtime,
        language:movie.language,
        youtube_id:movie.ytid,
        iframe:`https://www.youtube-nocookie.com/embed/${movie.ytid}`,
        imdb_link:`https://imdb.com/title/${movie.imdb_id}`,
    }
});

console.log(changedMovies);
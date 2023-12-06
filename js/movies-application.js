"user strict";
document.addEventListener('DOMContentLoaded', () => {
  const loadingDiv = document.getElementById('loading');

  fetch('http://localhost:3000/movies')
    .then(response => response.json())
    .then(movies => {
      // Replace loading message with HTML generated from movies
      loadingDiv.style.display = 'none';
      // Implement code to display movies on the page
    })
    .catch(error => console.error(error));
});
document.addEventListener('DOMContentLoaded', () => {
    // ... (existing code)

    const addMovieForm = document.getElementById('addMovieForm');

    addMovieForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const rating = document.getElementById('rating').value;

        fetch('http://localhost:3000/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, rating }),
        })
            .then(response => response.json())
            .then(newMovie => {
                // Handle the newly added movie
                console.log('New movie added:', newMovie);
            })
            .catch(error => console.error(error));
    });
});
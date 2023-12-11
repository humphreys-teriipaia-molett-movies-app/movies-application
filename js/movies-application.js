"use strict";

let movieArray = [];

(() => {

    $(document).ready(function(){

        let url = "http://localhost:3000/movies";
        const moviePosters = () => {

            let skeletonCards = "";
            for (let i = 0; i < 6; i++) { // Assuming you want 6 skeleton cards
                skeletonCards += `
                  <div class="w-[320px] h-[630px] max-w-sm rounded overflow-hidden shadow-lg m-4 bg-gray-300 animate-pulse">
                    <div class="w-full h-96 bg-gray-600"></div> <!-- Skeleton Image -->
                    <div class="p-4 space-y-2">
                        <div class="h-6 bg-gray-400 rounded"></div> <!-- Skeleton Title -->
                        <div class="h-6 bg-gray-400 rounded"></div> <!-- Skeleton Genre -->
                        <div class="h-6 bg-gray-400 rounded w-1/2"></div> <!-- Skeleton Star Rating -->
                    </div>
                    <div class="flex justify-between p-4">
                        <div class="h-10 bg-gray-400 rounded w-24"></div> <!-- Skeleton Edit Button -->
                        <div class="h-10 bg-gray-400 rounded w-24"></div> <!-- Skeleton Delete Button -->
                    </div>
                </div>`;
                    }

            let loader = `
                <div class="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                    <div class="spinner"></div>
                </div>
                `;
            // Append skeleton cards and loader to the container
            $("#container").html(skeletonCards + loader);

            fetch("http://localhost:3000/movies")
                .then(resp => resp.json())
                .then(movies => {
                    movieArray = movies;
                    let htmlStr = "";
                    let html = "";
                    if (movieArray.length === 0) {
                        // Show a message when no movies are available
                        htmlStr = `<p class="text-center text-white mt-10">No Movies to Show</p>`;
                        $("#container").html(htmlStr);
                    } else {
                        // Build the dropdown and movie cards if movies are available
                        for (let movie of movies) {
                            // dropdown menus
                            html += `<option value=${movie.id}>${movie.title}</option>`;

                            // creates movie posters
                            htmlStr += `<div id="movie-card-${movie.id}" class="max-w-sm rounded overflow-hidden shadow-lg m-4">
                    <div class="w-full h-96 overflow-hidden"> 
                        <img class="w-full h-full object-cover" src=${movie.poster} alt="${movie.title}">
                    </div>
                    <div class="px-6 py-4">
                        <div class="movie-title font-bold text-xl mb-2">${movie.title}</div>
                        <p class="movie-genre text-base">${movie.genre}</p>
                    </div>
                    <div class="movie-rating px-6 pt-4 pb-2">
                        ${createStars(movie.rating)}
                    </div>
                    <div class="px-6 py-4 flex justify-between">
                        <button class="edit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Edit</button>
                        <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Delete</button>
                    </div>
                </div>`;
                        }
                        htmlStr = `<div class=" movie-container grid grid-cols-1 md:grid-cols-3 gap-4">${htmlStr}</div>`;
                        $("#container").html(htmlStr);
                        $("#selectMenu").html("<option value='-1' selected>Select a movie</option>" + html);
                        $("#selectMenu2").html("<option value='-1' selected>Select a movie</option>" + html);
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    $("#container").html(`<p class="text-center text-white mt-10">Failed to load movies.</p>`);
                });
        }
        moviePosters();

        function createStars(rating) {
            let html = "";
            let fullStars = Math.floor(rating); // Get the full star count
            let hasHalfStar = rating % 1 !== 0; // Check if there is a decimal part
            // Create yellow stars for the full rating
            for (let i = 0; i < fullStars; i++) {
                html += "<i class=\"fas fa-star text-yellow-300\"></i>";
            }
            // Add a half star if there's a decimal part
            if (hasHalfStar) {
                html += "<i class=\"fas fa-star-half-alt text-yellow-300\"></i>";
                fullStars++; // Increment fullStars since we added a half star
            }
            // Create white stars for the remaining count up to 5
            for (let j = fullStars; j < 5; j++) {
                html += "<i class=\"fas fa-star text-black\"></i>";
            }
            return html;
        }

        // Open Add Movie Modal
        $(document).on('click', '.new-movie', function() {
            $("#addMovieModal").removeClass("hidden");
        });

        $('#addMovieForm').submit(function(e) {
            e.preventDefault();

            const addMovie = {
                id: movieArray.length + 1,
                title: $("#add-title").val(),
                genre: $("#add-genre").val(),
                rating: $("#add-rating").val(),
                poster: '../img/notcoming.jpeg'

            };

            let postOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(addMovie)
            };

            fetch(url, postOptions)
                .then(resp => resp.json())
                .then(newMovie => {
                    $('#addMovieModal').addClass('hidden');
                    // Append the new movie card to the container
                    const newMovieCard = createMovieCard(newMovie);
                    $(".movie-container").append(newMovieCard);
                })
                .catch(error => console.log(error));
        });

        function createMovieCard(movie) {
            // This assumes you have a function called createStars that generates HTML for stars based on the movie's rating
            const starsHtml = createStars(movie.rating);

            // Construct the card HTML
            const cardHtml = `
        <div id="movie-card-${movie.id}" class="max-w-sm rounded overflow-hidden shadow-lg m-4">
            <div class="w-full h-96 overflow-hidden"> 
                <img class="w-full h-full object-cover" src=${movie.poster} alt="${movie.title}">
            </div>
            <div class="px-6 py-4">
                <div class="movie-title font-bold text-xl mb-2">${movie.title}</div>
                <p class="movie-genre text-base">${movie.genre}</p>
            </div>
            <div class="movie-rating px-6 pt-4 pb-2">
                ${starsHtml}
            </div>
            <div class="px-6 py-4 flex justify-between">
                <button class="edit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Edit</button>
                <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Delete</button>
            </div>
        </div>
    `;

            return cardHtml;
        }

        // Open Edit Modal
        $(document).on('click', '.edit-button', function() {
            const movieId = $(this).data('id');
            const movieToEdit = movieArray.find(movie => movie.id == movieId);
            if (movieToEdit) {
                $("#editMovieId").val(movieId); // Set the movie ID in hidden input
                $("#editMovieTitle").val(movieToEdit.title);
                $("#editMovieGenre").val(movieToEdit.genre);
                $("#editMovieRating").val(movieToEdit.rating);
            }
            $('#editModal').removeClass('hidden');
        });

        // Edit Movie
        $('#editMovieForm').submit(function(e) {
            e.preventDefault();
            const movieId = $("#editMovieId").val(); // Retrieve the movie ID from hidden input
            const updatedMovieData = {

                title: $("#editMovieTitle").val(),
                genre: $("#editMovieGenre").val(),
                rating: $("#editMovieRating").val(),
            };

            fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMovieData)
            })
                .then(response => response.json())
                .then(updatedMovie => {
                    $('#editModal').addClass('hidden');
                    // Ensure the response has the updated movie data
                    console.log('Updated movie:', updatedMovie);

                    // Find the movie card in the DOM and update its contents
                    const $movieCard = $(`#movie-card-${updatedMovie.id}`);
                    $movieCard.find('.movie-title').text(updatedMovie.title);
                    $movieCard.find('.movie-genre').text(updatedMovie.genre);

                    // For the stars, you might need to re-render them completely
                    const newStarsHtml = createStars(updatedMovie.rating);
                    $movieCard.find('.movie-rating').html(newStarsHtml); // Make sure you have 'movie-rating' class on the rating element
                })
                .catch(error => console.error('Error:', error));
        });

// Open Delete Modal
        $(document).on('click', '.delete-button', function() {
            const movieId = $(this).data('id');
            $("#deleteMovieId").val(movieId); // Set the movie ID in hidden input
            $('#deleteModal').removeClass('hidden');
        });

        $(document).on('click', '#confirmDeleteButton', function() {
            const movieId = $("#deleteMovieId").val();

            fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        $('#deleteModal').addClass('hidden');
                        // Remove the movie card from the DOM
                        $(`#movie-card-${movieId}`).remove();
                    } else {
                        console.error('Error:', response.statusText);
                    }
                })
                .catch(error => console.error('Error:', error));
        });

        // Close Add Movie Modal
        $('#closeAddModal').click(function() {
            $('#addMovieModal').addClass('hidden');
        });

// Close Edit Modal
        $('#closeEditModal').click(function() {
            $('#editModal').addClass('hidden');
        });

// Close Delete Modal
        $('#closeDeleteModal').click(function() {
            $('#deleteModal').addClass('hidden');
        });

        $('#cancelDeleteButton').click(function() {
            $('#deleteModal').addClass('hidden');
        });

        $(document).ready(function(){
            // Toggle the sort menu dropdown
            $("#sortMenuButton").click(function() {
                $("#sortMenuDropdown").toggle();
            });

            // Handle sort option click
            $("#sortMenuDropdown a").click(function(e) {
                e.preventDefault();
                const sortBy = $(this).data('sort');
                sortMovies(sortBy);
            });
        });

        $(document).ready(function(){

            // Handle sort option click
            $("#sortMenuDropdown a").click(function(e) {
                e.preventDefault();
                const sortBy = $(this).data('sort');
                sortMovies(sortBy);
                $("#sortMenuDropdown").toggle(); // Hide the dropdown after selection
            });

        });

        function sortMovies(sortBy) {
            if (sortBy === 'genre') {
                movieArray.sort((a, b) => a.genre.localeCompare(b.genre));
            } else if (sortBy === 'rating') {
                movieArray.sort((a, b) => b.rating - a.rating);
            } else if (sortBy === 'title') {
                movieArray.sort((a, b) => a.title.localeCompare(b.title)); // Use localeCompare for strings
            }

            // Re-render the sorted movie cards
            let sortedHtmlStr = movieArray.map(movie => createMovieCard(movie)).join('');
            sortedHtmlStr = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${sortedHtmlStr}</div>`;
            $("#container").html(sortedHtmlStr);
        };

        $(document).ready(function() {

            // Search functionality on input change
            $("#searchInput").on('input', function () {
                const searchTerm = $(this).val().toLowerCase();
                filterMovies(searchTerm);
                if (searchTerm) {
                    $('#clearSearchButton').removeClass('hidden'); // Show clear button when there's a search term

                } else {
                    $('#clearSearchButton').addClass('hidden'); // Hide clear button when the search is cleared

                }
            });

            // Optionally, you can have a clear button to reset the search
            $("#clearSearchButton").click(function () {
                $("#searchInput").val(''); // Clear the input field
                $(this).addClass('hidden'); // Hide the clear button

                filterMovies(''); // Reset the filter to show all movies
            });
        });

        function unfilterMovies() {
            // Re-render the movie cards
            let htmlStr = movieArray.map(movie => createMovieCard(movie)).join('');
            htmlStr = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${htmlStr}</div>`;
            $("#container").html(htmlStr);
        };

        function filterMovies(searchTerm) {
            // Filter the movieArray by the search term and update the DOM
            let filteredMovies = movieArray.filter(movie =>
                movie.title.toLowerCase().includes(searchTerm) || movie.genre.toLowerCase().includes(searchTerm)
            );
            // Re-render the filtered movie cards
            let filteredHtmlStr = filteredMovies.map(movie => createMovieCard(movie)).join('');
            if (filteredHtmlStr === '') {
                filteredHtmlStr = '<p class="text-center text-2xl p-5">No movies found</p>';
            }else {
                filteredHtmlStr = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${filteredHtmlStr}</div>`;
            }
            $("#container").html(filteredHtmlStr);
        }
    });
})();


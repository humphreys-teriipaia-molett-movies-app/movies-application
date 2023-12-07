"use strict";

let movieArray = [];

(() => {


    $(document).ready(function(){
        movieArray = [];
        let url = "http://localhost:3000/movies";
        const moviePosters = () => {
            let loader = `<div class="loading"><img src="../img/loading.gif"></div>`;
            $("#container").html(loader);
            fetch("http://localhost:3000/movies")
                .then(resp => resp.json())
                .then(movies => {
                    movieArray = movies;
                    let htmlStr = "";
                    let html = "";
                    for (let movie of movies) {
                        // dropdown menus
                        html += `<option value=${movie.id}>${movie.title}</option>`;

                        // creates movie posters
                        htmlStr += `<div class="max-w-sm rounded overflow-hidden shadow-lg m-4">
                    <div class="w-full h-84 overflow-hidden"> 
                    <img class="w-full h-full object-cover" src=${movie.poster} alt="${movie.title}">
                       </div>

                    <div class="px-6 py-4">
                        <div class="font-bold text-xl mb-2">${movie.title}</div>
                        <p class="text-gray-700 text-base">${movie.genre}</p>
                    </div>
                    <div class="px-6 pt-4 pb-2">
                        ${createStars(movie.rating)}
                    </div>
                    <div class="px-6 py-4 flex justify-between">
                        <button class="edit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Edit</button>
                        <button class="delete-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" data-id=${movie.id}>Delete</button>
                    </div>
                </div>`;
                    }

// Wrap the posters in a grid layout
                    htmlStr = `<div class="grid grid-cols-1 md:grid-cols-3 gap-4">${htmlStr}</div>`;
                    //pushes created card or dropdown menu to the screen
                    console.log(movies)
                    $("#container").html(htmlStr);
                    $("#selectMenu").html("<option value='-1' selected>Select a movie</option>" + html);
                    $("#selectMenu2").html("<option value='-1' selected>Select a movie</option>" + html);
                });
        }
        moviePosters();

//edit menu using jQuery selectors
        $("#showEdit").click(function() {
            $("#editMovie").toggleClass("hidden1");
            $("#selectMenu").toggleClass("hidden1");
        });
//hide edit menu
        $("#changeMovie").click(function(){
            $("#editMovie").toggleClass("hidden1");
            $("#selectMenu").toggleClass("hidden1");
        })
//delete menu using jQuery selectors
        $(".remove-hidden").click(function() {
            $("#selectMenu2").toggleClass("hidden1");
            $("#delete-movie").toggleClass("hidden1");
        });
//hide delete menu
        $("#delete-movie").click(function(){
            $("#selectMenu2").toggleClass("hidden1");
            $("#delete-movie").toggleClass("hidden1");
        })

//post menu using jQuery selectors
        $("#post-id").click(function () {
            $("#postMovie").toggleClass("hidden1");
        });
        //hide post menu
        $("#newMovie").click(function() {
            $("#postMovie").toggleClass("hidden1");
        })

        //when the option selected is changed, update the input fields
        $("#selectMenu").change(function(){
            let target = $(this).val()
            console.log(target);

            //grab info from the json file and populate the input fields
            for (let movie of movieArray) {
                if (movie.id == target) {
                    $("#newTitle").val(movie.title);
                    $("#newGenre").val(movie.genre);
                    $("#newRating").val(movie.rating);
                }
            }
        })

        function createStars(rating) {
            let html = "";
            let fullStars = Math.floor(rating); // Get the full star count
            let hasHalfStar = rating % 1 !== 0; // Check if there is a decimal part
            // Create yellow stars for the full rating
            for (let i = 0; i < fullStars; i++) {
                html += "<i class=\"fas fa-star\" style='color: yellow'></i>";
            }
            // Add a half star if there's a decimal part
            if (hasHalfStar) {
                html += "<i class=\"fas fa-star-half-alt\" style='color: yellow'></i>";
                fullStars++; // Increment fullStars since we added a half star
            }
            // Create white stars for the remaining count up to 5
            for (let j = fullStars; j < 5; j++) {
                html += "<i class=\"fas fa-star\" style='color: white'></i>";
            }
            return html;
        }


        // Open Add Movie Modal
        $(document).on('click', '.new-movie', function(e) {
            e.preventDefault(); // Prevent the default action of the anchor tag
            $("#addMovieModal").removeClass("hidden");
        });

        $('#addMovieForm').submit(function(e) {
            e.preventDefault();

            const addMovie = {
                title: $("#add-title").val(),
                genre: $("#add-genre").val(),
                rating: $("0").val(),
                poster: '../img/shrek.jpeg'

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
                .then(() => {
                    $('#addMovieModal').addClass('hidden');
                    moviePosters(); // Refresh the movies display
                })
                .catch(error => console.log(error));
        });

        // Open Edit Modal
        $(document).on('click', '.edit-button', function() {
            const movieId = $(this).data('id');
            const movieToEdit = movieArray.find(movie => movie.id == movieId);
            if (movieToEdit) {
                $("#editMovieId").val(movieId); // Set the movie ID in hidden input
                $("#editMovieTitle").val(movieToEdit.title);
                $("#editMovieGenre").val(movieToEdit.genre);
                // Add other fields as necessary
            }
            $('#editModal').removeClass('hidden');
        });

        $('#editMovieForm').submit(function(e) {
            e.preventDefault();
            const movieId = $("#editMovieId").val(); // Retrieve the movie ID from hidden input
            const updatedMovieData = {
                title: $("#editMovieTitle").val(),
                genre: $("#editMovieGenre").val(),
                // Add other fields as necessary
            };

            fetch(`http://localhost:3000/movies/${movieId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMovieData)
            })
                .then(response => response.json())
                .then(() => {
                    $('#editModal').addClass('hidden');
                    moviePosters(); // Refresh the movies display
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
                        moviePosters(); // Refresh the movies display
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

    });
})();


let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});
// index.js

document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addBtn = document.querySelector('#new-toy-btn');
  const toyForm = document.querySelector('.container');
  let addToy = false;

  // Fetch Andy's Toys on page load
  fetchToys();

  // Toggle the form visibility
  addBtn.addEventListener('click', () => {
    addToy = !addToy;
    if (addToy) {
      toyForm.style.display = 'block';
      // Handle form submission
      toyForm.addEventListener('submit', event => {
        event.preventDefault();
        addNewToy(event.target);
      });
    } else {
      toyForm.style.display = 'none';
    }
  });

  // Fetch all toys from the server
  function fetchToys() {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(data => {
        data.forEach(toy => renderToyCard(toy));
      })
      .catch(error => console.error('Error fetching toys:', error));
  }

  // Render a single toy card
  function renderToyCard(toy) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" data-id="${toy.id}">Like ❤️</button>
    `;
    
    // Add event listener to like button
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      updateLikes(toy);
    });

    toyCollection.appendChild(card);
  }

  // Add a new toy to the server
  function addNewToy(form) {
    const toyData = {
      name: form.name.value,
      image: form.image.value,
      likes: 0 // New toys start with 0 likes
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(toyData)
    })
    .then(response => response.json())
    .then(newToy => {
      renderToyCard(newToy); // Add new toy to DOM
      form.reset(); // Clear the form
      toyForm.style.display = 'none'; // Hide the form after submission
    })
    .catch(error => console.error('Error adding new toy:', error));
  }

  // Update likes for a toy
  function updateLikes(toy) {
    const updatedLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: updatedLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      // Update the likes displayed in the DOM
      const toyCard = toyCollection.querySelector(`[data-id="${updatedToy.id}"]`);
      const likesDisplay = toyCard.querySelector('p');
      likesDisplay.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(error => console.error('Error updating likes:', error));
  }
});

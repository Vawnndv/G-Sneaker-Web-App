// Load shoe data from JSON
// Define the URL of the JSON data file
const dataUrl = './data/shoes.json';

// Variable to store the shoe data
let shoeData = [];

//Function to fetch the shoe data from the JSON file
async function fetchShoeData() {
    try {
        const response = await fetch(dataUrl);
        const data = await response.json();
        shoeData = data.shoes;
        populateShoesSection();
    } catch (error) {
        console.error('Error fetching shoe data:', error);
    }
}
// Call the fetchShoeData function to retrieve the shoe data
fetchShoeData();

// Function to generate HTML for a shoe item
function generateShoeItemHTML(shoe) {
    // Check if the shoe is in the cartItems array
    const isInCart = cartItems.some(item => item.id === shoe.id);

    // Generate the HTML accordingly
    return `
    <div class="shoe-item" data-shoe-id="${shoe.id}">
      <div class="image-container" style="background-color: ${shoe.color};">
        <img src="${shoe.image}" alt="${shoe.name}">
      </div>
      <h3>${shoe.name}</h3>
      <p>${shoe.description}</p>
      
      <div class="price-add-to-cart">
        <span class="price">$${shoe.price.toFixed(2)}</span>
        ${isInCart ? '<img src="../assets/icons/check.png">' : '<button class="add-to-cart">Add to Cart</button>'}
      </div>
    </div>
  `;
}


// Function to populate the shoes section
function populateShoesSection() {
    const shoesSection = document.querySelector('.shoes-section');
    const shoesList = document.querySelector('.shoes-list');

    // Generate HTML for each shoe item
    const shoeItemsHTML = shoeData.map(shoe => generateShoeItemHTML(shoe)).join('');

    // Append shoe items to the shoes list
    shoesList.innerHTML = shoeItemsHTML;

    // Attach event listeners to Add to Cart buttons
    const addToCartButtons = shoesList.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Array to store cart items
const cartItems = [];

// Function to handle Add to Cart button click
function addToCart(event) {
    const shoeItem = event.target.closest('.shoe-item');
    const shoeId = parseInt(shoeItem.dataset.shoeId);

    // Find the selected shoe from the shoe data
    const selectedShoe = shoeData.find(shoe => shoe.id === shoeId);

    // Add the selected shoe to the cart
    selectedShoe.quantity = 1;
    cartItems.push(selectedShoe);

    // Update the cart HTML
    populateCartSection();
    populateShoesSection();
}

// Function to generate HTML for a cart item
function generateCartItemHTML(shoe) {
    return `
    <div class="cart-item" data-shoe-id="${shoe.id}">
      <div class="circle-image-container" style="background-color: ${shoe.color};">
        <img src="${shoe.image}" alt="${shoe.name}">
      </div>
      <div class="cart-details">
        <h3>${shoe.name}</h3>
         <span class="price">$${shoe.price.toFixed(2)}</span>
         <div class="edit-cart">
            <div class="quantity">
              <button class="decrease-quantity"><img src="../assets/icons/minus.png" alt="-"></button>
              <span class="quantity-value">${shoe.quantity}</span>
              <button class="increase-quantity"><img src="../assets/icons/plus.png" alt="+"></button>
            </div>
            <button class="remove-item"><img src="../assets/icons/trash.png" alt="Remove"></button>
         </div>
      </div>
    </div>
  `;
}

// Function to populate the cart section
function populateCartSection() {
    const cartSection = document.querySelector('.cart-section');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.total-price');
    const emptyCartMsg = document.querySelector('.empty-cart');

    // Clear the cart items container
    cartItemsContainer.innerHTML = '';

    // Generate HTML for each cart item
    const cartItemsHTML = cartItems.map(item => generateCartItemHTML(item)).join('');

    // Append cart items to the cart items container
    cartItemsContainer.innerHTML = cartItemsHTML;

    // Attach event listeners to quantity buttons and remove buttons
    const decreaseQuantityButtons = cartItemsContainer.querySelectorAll('.decrease-quantity');
    const increaseQuantityButtons = cartItemsContainer.querySelectorAll('.increase-quantity');
    const removeButtons = cartItemsContainer.querySelectorAll('.remove-item');

    decreaseQuantityButtons.forEach(button => {
        button.addEventListener('click', decreaseQuantity);
    });

    increaseQuantityButtons.forEach(button => {
        button.addEventListener('click', increaseQuantity);
    });

    removeButtons.forEach(button => {
        button.addEventListener('click', removeItem);
    });

    // Update the cart total
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;

    // Show/hide empty cart message
    if (cartItems.length === 0) {
        emptyCartMsg.style.display = 'block';
    } else {
        emptyCartMsg.style.display = 'none';
    }
}

// Function to decrease quantity of a cart item
function decreaseQuantity(event) {
    const cartItem = event.target.closest('.cart-item');
    const shoeId = parseInt(cartItem.dataset.shoeId);

    // Find the cart item in the cart items array
    const itemIndex = cartItems.findIndex(item => item.id === shoeId);
    if (itemIndex !== -1) {
        const item = cartItems[itemIndex];
        item.quantity--;

        // Remove the item if the quantity becomes zero
        if (item.quantity === 0) {
            cartItems.splice(itemIndex, 1);
        }
    }

    // Update the cart HTML
    populateCartSection();
    populateShoesSection();
}

// Function to increase quantity of a cart item
function increaseQuantity(event) {
    const cartItem = event.target.closest('.cart-item');
    const shoeId = parseInt(cartItem.dataset.shoeId);

    // Find the cart item in the cart items array
    const item = cartItems.find(item => item.id === shoeId);
    if (item) {
        item.quantity++;
    }

    // Update the cart HTML
    populateCartSection();
}

// Function to remove an item from the cart
function removeItem(event) {
    const cartItem = event.target.closest('.cart-item');
    const shoeId = parseInt(cartItem.dataset.shoeId);

    // Find the index of the cart item in the cart items array
    const itemIndex = cartItems.findIndex(item => item.id === shoeId);
    if (itemIndex !== -1) {
        cartItems.splice(itemIndex, 1);
    }

    // Update the cart HTML
    populateCartSection();
    populateShoesSection();
}

// Initialize the web page
function initialize() {
    populateShoesSection();
    populateCartSection();
}

// Call the initialize function when the web page loads
window.addEventListener('load', initialize);
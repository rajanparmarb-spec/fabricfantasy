let cartCount = 0;

function addToCart(button) {
  const product = button.closest(".product");

  const name = product.querySelector("h3").innerText;
  const price = parseInt(
    product.querySelector(".price").innerText.replace(/[₹,]/g, "")
  );
  const image = product.querySelector("img").src;
  const size = product.querySelector(".size.active").innerText;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, price, image, size });
  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();
  updateFloatingCartCount();

  button.innerText = "✓ ADDED";
  setTimeout(() => (button.innerText = "ADD TO CART"), 1500);
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').innerText = cart.length;
}

function scrollToShop() {
    document.getElementById("shop").scrollIntoView({ behavior: "smooth" });
}

function toggleMenu() {
    const menu = document.getElementById("nav-menu");
    menu.style.display = menu.style.display === "flex" ? "none" : "flex";
}

// Contact form handling (no backend)
const form = document.getElementById("contactForm");
const successMessage = document.getElementById("successMessage");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        successMessage.textContent = "Thank you! Your message has been sent.";
        form.reset();
    });
}

function updateFloatingCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.querySelector('.floating-cart-count');

    if (!badge) return;

    badge.textContent = cart.length;

    if (cart.length === 0) {
        badge.style.display = 'none';
    } else {
        badge.style.display = 'flex';
    }
}

// Call this once on page load
updateCartCount();
updateFloatingCartCount();

// GLOBAL function to handle size clicks - called from inline onclick
window.selectSize = function(button) {
  const sizesContainer = button.parentElement;
  sizesContainer.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
  button.classList.add("active");
}

// GLOBAL function to handle color clicks
window.selectColor = function(colorCircle, event) {
  event.stopPropagation();
  const colorsContainer = colorCircle.parentElement;
  colorsContainer.querySelectorAll(".color-circle").forEach(c => c.classList.remove("active"));
  colorCircle.classList.add("active");
}

// NEW: Function to get all images from product data
function getProductImages(product) {
  const images = [product.image];
  let count = 1;
  
  // Check for image1, image2, image3, etc.
  while (product[`image${count}`]) {
    images.push(product[`image${count}`]);
    count++;
  }
  
  return images;
}

function loadProducts() {
  const sheetURL = "https://opensheet.elk.sh/1XXXU5lQDFYOvpWEAXZQEL3jlIGmCgQ8erj7cdAzvgIc/Sheet1";
  
  fetch(sheetURL)
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("productGrid");
      console.log(data);
  
      data.forEach(item => {
        const product = document.createElement("div");
        product.className = "product";

        // Parse sizes from API (e.g., "XS,S,M,L,XL" or "S,M,L")
        const availableSizes = item.size ? item.size.split(',').map(s => s.trim()) : [];
        
        // Generate size buttons dynamically
        const sizeButtons = availableSizes.map((size, index) => {
          // Set middle size as active by default
          const isActive = index === Math.floor(availableSizes.length / 2) ? 'active' : '';
          return `<button class="size ${isActive}" onclick="selectSize(this)">${size}</button>`;
        }).join('');

        // Parse colors from API (e.g., "Red,Blue,Green" or "#ff0000,#0000ff,#00ff00")
        const availableColors = item.color ? item.color.split(',').map(c => c.trim()) : [];
        
        // Generate color circles dynamically
        const colorCircles = availableColors.map((color, index) => {
          const isActive = index === 0 ? 'active' : '';
          const colorStyle = color.startsWith('#') ? `background: ${color}` : `background: ${color.toLowerCase()}`;
          return `<span class="color-circle ${isActive}" style="${colorStyle}" onclick="selectColor(this, event)" title="${color}"></span>`;
        }).join('');

        // Get all images from the product data
        const allImages = getProductImages(item);
        const productDataString = JSON.stringify({
          images: allImages,
          name: item.name,
          price: item.price,
          description: item.description || 'Premium quality product',
          sizes: item.size || '',
          colors: item.color || ''
        }).replace(/'/g, "\\'").replace(/"/g, '&quot;');

        product.innerHTML = `
          <div class="fashion-product"
               onclick='openProductWithImages(${productDataString})'>

            <img src="${item.image}" alt="${item.name}">

            <div class="fashion-info">
              <h3>${item.name}</h3>
              <p class="price">₹${Number(item.price).toLocaleString()}</p>
              
              ${colorCircles ? `
              <div class="color-option" onclick="event.stopPropagation()">
                <div class="color-circles">
                  ${colorCircles}
                </div>
              </div>
              ` : ''}
              
              <div class="option">
                <div class="sizes" onclick="event.stopPropagation()">
                  ${sizeButtons}
                </div>
              </div>

              <button class="add-cart-btn"
                onclick="event.stopPropagation(); addToCart(this)">
                ADD TO CART
              </button>
            </div>
          </div>
        `;

        grid.appendChild(product);
      });
    })
    .catch(err => console.error("Error loading products", err));
}

// NEW: Function to open product with multiple images
function openProductWithImages(productData) {
  localStorage.setItem("selectedProduct", JSON.stringify(productData));
  window.location.href = "product.html";
}
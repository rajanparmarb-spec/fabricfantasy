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

        product.innerHTML = `
          <div class="fashion-product"
               onclick="openProduct(
                 '${item.image}',
                 '${item.name.replace(/'/g, "\\'")}',
                 '${item.price}',
                 '${item.description || 'Premium quality product'}',
                 '${item.size || ''}'
               )">

            <img src="${item.image}" alt="${item.name}">

            <div class="fashion-info">
              <h3>${item.name}</h3>
              <p class="price">₹${Number(item.price).toLocaleString()}</p>
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

function openProduct(image, name, price, description, sizes) {
  const productData = {
    image,
    name,
    price,
    description,
    sizes
  };

  localStorage.setItem("selectedProduct", JSON.stringify(productData));
  window.location.href = "product.html";
}

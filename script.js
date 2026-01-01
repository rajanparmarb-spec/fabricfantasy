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

// ========== script.js (REPLACE loadProducts and addToCart functions) ==========

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
  

product.innerHTML = `
  <div class="fashion-product"
       onclick="openProduct(
         '${item.image}',
         '${item.name.replace(/'/g, "\\'")}',
         '${item.price}'
       )">

    <img src="${item.image}" alt="${item.name}">

    <div class="fashion-info">
      <h3>${item.name}</h3>
      <p class="price">₹${Number(item.price).toLocaleString()}</p>
    <div class="option">

      <div class="sizes" onclick="event.stopPropagation()">
        <button class="size">XS</button>
        <button class="size">S</button>
        <button class="size active">M</button>
        <button class="size">L</button>
        <button class="size">XL</button>
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
document.addEventListener("click", function (e) {
      console.log("helloworld");

  if (e.target.classList.contains("size")) {
    const group = e.target.parentElement;
    console.log("helloworld");
    group.querySelectorAll(".size").forEach(s => s.classList.remove("active"));
    e.target.classList.add("active");
  }
});


  
      // Add size button click handlers
      document.querySelectorAll('.size-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const parent = this.closest('.size-options');
          parent.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
          this.classList.add('active');
        });
      });
    })
    .catch(err => console.error("Error loading products", err));
  }
  
function openProduct(image, name, price) {
  const productData = {
    image,
    name,
    price
  };

  localStorage.setItem("selectedProduct", JSON.stringify(productData));
  window.location.href = "product.html";
}

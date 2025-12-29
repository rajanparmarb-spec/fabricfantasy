let cartCount = 0;

function addToCart(button) {
    const productCard = button.parentElement;
    const name = productCard.querySelector('h3').innerText;
    const priceText = productCard.querySelector('p').innerText;
    const price = parseInt(priceText.replace(/[₹,]/g, ''));;
    const image = productCard.querySelector('img').src;

    console.log(priceText);
        console.log(price);

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({name, price, image});
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateFloatingCartCount();

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
        <img src="${item.image}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>₹${Number(item.price).toLocaleString()}</p>
        <button onclick="addToCart(this)">Add to Cart</button>
      `;
    console.log(item);

      grid.appendChild(product);
    });
  })
  .catch(err => console.error("Error loading products", err));
}


// ====================== main.js ================
import { handleOrder } from '../../assets/js/main.js';
// ==================== home.js ====================
let products_map = {};
let current_product = null;

document.addEventListener('DOMContentLoaded', async function() {
    const data = await hit_api_get_product_home();
    console.log(data.new_arrival);
    // product
    await set_dom_product_home(data);  

    //navbar profile
    const check = await check_login();
    if(check){
        await set_dom_profile();
    }
})

// hit api get product home
async function hit_api_get_product_home(){
    try {
        const response = await fetch('http://localhost:4100/api/product/home');
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.log(error); 
        return [];
    }
}

//===================== DOM product home =====================
async function set_dom_product_home(data){
    // item
    const new_arrival = data.new_arrival;
    const top_selling = data.top_selling;

    // container
    const container_new_arrival = document.getElementById('grid_new_arrival_container');
    const container_top_selling = document.getElementById('grid_top_selling_container');

    // inner HTML 
    let new_arrival_html = '';
    let top_selling_html = '';

    // Clear and populate map
    products_map = {};

    new_arrival.forEach(item => {
        products_map[item.id] = item;
        new_arrival_html += `
        <div class="product-card" data-product="${item.id}">
                <div class="product-image">
                    <span class="product-icon"><img src="${item.gallery_images}" alt="Product Image"></span>
                    <span class="product-badge">NEW</span>
                </div>
                <div class="product-info">
                    <div class="product-name">${item.title}</div>
                    <div class="product-category">${item.category}</div>
                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-text">${item.rating_avg}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${item.currency}.${item.discount_price}</span>
                        <span class="original-price">${item.currency}.${item.price}</span>
                        <span class="discount">-${item.discount}%</span>
                    </div>
                </div>
            </div>
        `;
        
    });

    top_selling.forEach(item => { 
        products_map[item.id] = item;
        top_selling_html += `
            <div class="product-card" data-product="${item.id}">
                <div class="product-image">
                    <span class="product-icon"><img src="${item.gallery_images}" alt="Product Image"></span>
                </div>
                <div class="product-info">
                    <div class="product-name">${item.title}</div>
                    <div class="product-category">${item.category}</div>
                    <div class="product-rating">
                        <span class="stars">★★★★★</span>
                        <span class="rating-text">${item.rating_avg}</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${item.currency}.${item.discount_price}</span>
                        <span class="original-price">${item.currency}.${item.price}</span>
                        <span class="discount">-${item.discount}%</span>
                    </div>
                </div>
            </div>
        `;
    })

    container_new_arrival.innerHTML = new_arrival_html;
    container_top_selling.innerHTML = top_selling_html;
    
    // Attach listeners after DOM is updated
    attachProductListeners();
}

//===================== navbar profile =====================
async function check_login(){
    const token = localStorage.getItem('token'); // cek token
    if(token){ // if exist
        try{
            const response = await fetch("http://localhost:4100/api/auth/verify_token", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const result = await response.json();
            return result;
        }catch(error){
            console.log(error);
            return false;
        }
    }else{
        return false;
    }
}

async function set_dom_profile(){
    const user = JSON.parse(localStorage.getItem('user'));
    const profile = document.getElementById('profile');
    profile.innerHTML = `
        <img class="profile-img" src="../../assets/img/profile/${user.image_url}" alt="Profile">
    `;
}

//===================== product card modal =====================
function attachProductListeners() {
    const modal = document.getElementById('productModal');
    const closeBtn = document.getElementById('modalClose');

    if (closeBtn) {
        closeBtn.onclick = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
    }

    // Close on click outside
    window.onclick = (event) => {
        if (event.target == modal) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
    // product card clicked ()
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => {
             const id = card.dataset.product;
             const product = products_map[id];
             if(product) openModal(product);
        });
    });
}

function openModal(item) {
    current_product = item;
    const modal = document.getElementById("productModal");
    
    // Update Image (handle string URL)
    const modalImageContainer = document.querySelector(".modal-image");
    if (modalImageContainer) {
        modalImageContainer.innerHTML = `<img src="${item.gallery_images}" alt="${item.title}" style="width:100%; height:100%; object-fit:cover;">`;
    }

    // Update Text Fields
    const setContent = (id, value) => {
        const el = document.getElementById(id);
        if(el) el.textContent = value;
    };

    setContent("modalCategory", item.category || 'Product');
    setContent("modalTitle", item.title);
    
    // Rating
    const ratingText = document.querySelector(".modal-rating .rating-text");
    if(ratingText) {
        const count = item.rating_count !== undefined ? item.rating_count : 0;
        ratingText.textContent = `${item.rating_avg}/5 (${count} reviews)`;
    }
    
    setContent("modalDescription", item.description);
    
    // Price Logic
    setContent("modalPrice", `${item.currency}.${item.discount_price}`);
    
    const originalPriceEl = document.getElementById("modalOriginalPrice");
    if(originalPriceEl) {
        if(item.discount > 0) {
            originalPriceEl.textContent = `${item.currency}.${item.price}`;
            originalPriceEl.style.display = 'inline';
        } else {
             originalPriceEl.style.display = 'none';
        }
    }

    // Discount Badge
    const discountEl = document.querySelector(".modal-price .discount");
    if(discountEl) {
        if(item.discount > 0) {
            discountEl.textContent = `-${item.discount}%`;
            discountEl.style.display = 'inline-block';
        } else {
            discountEl.style.display = 'none';
        }
    }
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

//===================== order now button =====================
const order_now_btn = document.getElementById('order_now_btn');
order_now_btn.addEventListener('click', () => {
    window.location.href = `http://localhost:3100/page/checkout/${current_product.slug}`;
});
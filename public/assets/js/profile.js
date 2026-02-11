// // Simple tab switching
// const tabs = document.querySelectorAll('.tab');
// const contents = document.querySelectorAll('.tab-content');

// tabs.forEach(tab => {
//     tab.addEventListener('click', () => {
//     // Remove active from all
//     tabs.forEach(t => t.classList.remove('active'));
//     contents.forEach(c => c.style.display = 'none');

//     // Activate clicked
//     tab.classList.add('active');
//     document.getElementById(tab.dataset.tab).style.display = 'block';
//     });
// });

// // Fake save button feedback
// document.querySelector('.btn-save')?.addEventListener('click', (e) => {
//     e.preventDefault();
//     alert('Profile updated successfully!');
// });

// ==============onload==================
import {
    check_login
} from "/common/view/main.js";
document.addEventListener("DOMContentLoaded", function() {
    check_login();
    const avatarContainer = document.querySelector(".avatar-container");
    const user = JSON.parse(localStorage.getItem("user"));
    // image user
    let img = document.createElement("img");
    img.src = "../assets/img/profile/" + user.image_url;
    img.alt = "avatar";
    img.classList.add("avatar");
    avatarContainer.appendChild(img);
    // name user
    const name = document.querySelector(".profile-name");
    name.textContent = user.username;
    // bio user
    if (user.bio) {
        const bio = document.querySelector(".profile-bio");
        bio.textContent = user.bio;
    }
});
const modal = document.getElementById("myModal");
const modalImage = document.getElementById("modalImage");
const modalCaption = document.getElementById("modalCaption");
const modalBackdrop = document.getElementById("modalBackdrop");

const images = document.getElementsByClassName("hover-image");

// Add event delegation for close button here
modalCaption.addEventListener('click', (event) => {
    if (event.target.classList.contains('close')) {        
        modal.style.display = "none";
        modalBackdrop.style.display = "none";
    }
});

// Image click handlers
for (let i = 0; i < images.length; i++) {
    images[i].addEventListener('click', function() {
        modalImage.src = this.src;
        modalCaption.innerHTML = `
            <span class="close">&times;</span>
        `;
        
        modal.style.display = "block";
        modalBackdrop.style.display = "block";
    });
}

// Click outside modal to close
window.addEventListener('click', (event) => {
    if (event.target === modal || event.target === modalBackdrop) {
        modal.style.display = "none";
        modalBackdrop.style.display = "none";
    }
});

// Initial setup
modal.style.display = "none";
modalBackdrop.style.display = "none";
modalCaption.innerHTML = `
    <span class="close">&times;</span>
`;
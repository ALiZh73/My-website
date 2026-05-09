/* 
   EVENTS DATABASE 
   Stores all event information used across the website
*/
const eventsData = {
    Internationalfair: {
        title: "Damascus International Fair",
        date: "August 15, 2026",
        location: "Exhibitions City",
        description: "The International Fair showcases diverse cultures through interactive booths, activities, and presentations, giving students a chance to explore global traditions and broaden their cultural awareness.",
        image: "img/fair3.jpg",
        map: "img/fair map.png",
        gallery: ["img/fair1.jpg", "img/fair2.jpg", "img/fair3.jpg"]
    },

    AI: {
        title: "A Debate about The Impact of AI",
        date: "September 05, 2026",
        location: "Practical Society for Informatics",
        description: "A student debate exploring the social, educational, and ethical impact of artificial intelligence, highlighting both its opportunities and challenges through structured, constructive discussion.",
        image: "img/Practical Society.jpeg",
        map: "img/1.jpeg",
        gallery: ["img/AI1.jpg", "img/AI2.jpg", "img/AI3.jpg"]
    },

    DamascusMarathon: {
        title: "Damascus Marathon",
        date: "October 10, 2026",
        location: "Damascus City Center",
        description: "The Damascus Marathon is a community sports event that brings students together in an energetic atmosphere to promote fitness, teamwork, and active participation. The race follows a designated route in Damascus and offers a safe, organized, and motivating experience for all participants.",
        image: "img/marathon3.jpg",
        map: "img/marathon map.png",
        gallery: ["img/marathon.jpg", "img/marathon2.jpg", "img/marathon1.jpg"]
    },

    OperaHouseNight: {
        title: "Opera House Night",
        date: "June 10, 2026",
        location: "Damascus Opera House",
        description: "The Syrian Virtual University is organizing a special event titled “Opera House Night,” an elegant artistic evening designed to introduce students to the world of opera and classical music. The event features selected international musical pieces along with an overview of the history of opera and its expressive styles. It offers participants a refined cultural experience, helping them appreciate high art and explore the aesthetic and cultural dimensions that distinguish opera performances around the world.",
        image: "img/opera_3.jpg",
        map: "img/opera map.png",
        gallery: ["img/opera.jpg", "img/oper_2.jpg", "img/opera_4.jpg"]
    },

    music: {
        title: "Electronic Music Production Workshop",
        date: "July 20, 2026",
        location: "Practical Society for Informatics",
        description: "The Syrian Virtual University is organizing a workshop titled “Electronic Music Production,” aimed at introducing participants to the fundamentals of digital audio, rhythm design, and modern production tools. The workshop offers students a practical opportunity to explore both the technical and creative aspects of electronic music, helping them develop their skills in crafting and arranging sound elements in a professional way.",
        image: "img/music3.jpg",
        map: "img/1.jpeg",
        gallery: ["img/music2.jpg", "img/music3.jpg", "img/m.jpg"]
    }
};


/* 
   LOAD EVENT DETAILS INTO event.html
   Reads event ID from URL and fills the page with the correct data
*/
function loadEventDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventId = urlParams.get("id");

    // Stop if event does not exist
    if (!eventId || !eventsData[eventId]) return;

    const event = eventsData[eventId];

    // Helper to safely set text content
    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.innerText = text;
    };

    // Helper to safely set image source
    const setSrc = (id, src) => {
        const el = document.getElementById(id);
        if (el) el.src = src;
    };

    // Fill event details into the page
    setText("event-title", event.title);
    setText("event-date", event.date);
    setText("event-location", event.location);
    setText("event-description", event.description);
    setSrc("event-image", event.image);
    setSrc("static-map", event.map);

    // Build gallery dynamically
    const galleryContainer = document.getElementById("event-gallery");
    if (galleryContainer) {
        galleryContainer.innerHTML = event.gallery
            .map(img => `
                <div class="col-4">
                    <img src="${img}" class="img-fluid rounded shadow-sm gallery-img"
                         style="height:80px; width:100%; object-fit:cover; border:1px solid #ddd;">
                </div>
            `)
            .join("");
    }

    renderRelatedEvents(eventId);
    initSimpleLightbox();
}


/* 
   SHOW RELATED EVENTS 
   Displays suggestions for other events on the right side
*/
function renderRelatedEvents(currentId) {
    const container = document.getElementById("related-events-container");
    if (!container) return;

    container.innerHTML = "";

    // Loop through all events except the current one
    for (let id in eventsData) {
        if (id !== currentId) {
            const item = eventsData[id];

            container.innerHTML += `
                <div class="d-flex align-items-center mb-3 border-bottom pb-2">
                    <img src="${item.image}" width="60" height="60" class="rounded me-3" style="object-fit: cover;">
                    <div>
                        <h6 class="mb-0 fw-bold" style="font-size: 0.9rem;">${item.title}</h6>
                        <a href="event.html?id=${id}" class="text-decoration-none small text-primary">View Details</a>
                    </div>
                </div>
            `;
        }
    }
}


/* 
   CONTACT FORM VALIDATION
   Validates user input before submitting the contact form
*/
function handleContactForm() {
    const form = document.getElementById("contactFormManual");
    if (!form) return;

    form.onsubmit = function (e) {
        e.preventDefault();

        const name = document.getElementById("conUserName").value;
        const email = document.getElementById("conUserEmail").value;
        const msg = document.getElementById("conUserMessage").value;

        const success = document.getElementById("alertSuccess");
        const error = document.getElementById("alertError");

        // Hide alerts first
        success.classList.add("d-none");
        error.classList.add("d-none");

        // Basic validation rules
        if (!name.trim() || !email.trim() || !msg.trim()) {
            error.innerText = "All fields are required!";
            error.classList.remove("d-none");
        } else if (!email.includes("@") || !email.includes(".")) {
            error.innerText = "Please enter a valid email format.";
            error.classList.remove("d-none");
        } else {
            success.classList.remove("d-none");
            form.reset();
        }
    };
}


/* 
   FILTER EVENTS IN events.html
   Filters events by name and category
*/
function applyFilter() {
    const nameInput = document.getElementById("nameSearch").value.toLowerCase().trim();
    const catInput = document.getElementById("catSelect").value;
    const cards = document.querySelectorAll(".event-item");

    cards.forEach(card => {
        const title = card.querySelector("h4")?.innerText.toLowerCase() || "";
        const category = card.getAttribute("data-cat");

        const matchName = title.includes(nameInput);
        const matchCat = (catInput === "all" || category === catInput);

        card.style.display = (matchName && matchCat) ? "block" : "none";
    });
}


/* 
   APPLY CATEGORY FILTER FROM URL
   Allows filtering events using ?filter=music etc.
*/
function applyCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get("filter");

    if (!filter) return;

    const cards = document.querySelectorAll(".event-item");

    cards.forEach(card => {
        const category = card.getAttribute("data-cat");
        card.style.display = (category === filter) ? "block" : "none";
    });

    const catSelect = document.getElementById("catSelect");
    if (catSelect) catSelect.value = filter;
}


/* 
   SIMPLE LIGHTBOX FOR GALLERY IMAGES
   Opens clicked gallery image in a fullscreen overlay
*/
function initSimpleLightbox() {
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");

    const images = document.querySelectorAll(".gallery-img");

    images.forEach(img => {
        img.style.cursor = "zoom-in";
        img.addEventListener("click", () => {
            lightbox.style.display = "flex";
            lightboxImg.src = img.src;
        });
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener("click", () => {
        lightbox.style.display = "none";
    });
}


/* 
   INITIALIZE ALL FUNCTIONS ON PAGE LOAD
*/
window.onload = function () {
    loadEventDetails();
    handleContactForm();
    applyCategoryFromURL();
    applyFilter();
};

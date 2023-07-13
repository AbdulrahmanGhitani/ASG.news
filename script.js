// for toggleBtn
const toggleBtn = document.querySelector('.toggle_btn');
const toggleBtnIcon = document.querySelector('.toggle_btn i');
const dropDownMenu = document.querySelector('.dropdown-menu');

function updateIcon() {
    const isOpen = dropDownMenu.classList.contains('open');
    toggleBtnIcon.classList = isOpen
        ? "fa-solid fa-xmark"
        : "fa-solid fa-bars";
}

toggleBtn.onclick = function(){
    dropDownMenu.classList.toggle('open');
    updateIcon();
    const windowWidth = window.innerWidth;
}

function removeOpenClassOnResize() {
    const windowWidth = window.innerWidth;
  
    if (windowWidth >= 756) {
        dropDownMenu.classList.remove('open');
        toggleBtnIcon.classList = "fa-solid fa-bars";
    }
  }
  removeOpenClassOnResize();
window.addEventListener('resize', removeOpenClassOnResize);

// for API

const API_KEY = "4a3ae213e9a8464b8af9bc8a3b881ae4";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Egypt"));

function reload() {
    window.location.reload();
}

async function fetchNews(query) {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
    const data = await res.json();
    bindData(data.articles);
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    articles.forEach((article, index) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardClone.firstElementChild.id = `news-card-${index}`; // Add unique ID to each cloned card
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsTitle.innerHTML = article.title;
    newsDesc.innerHTML = article.description;
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
    });
    newsSource.innerHTML = `${article.source.name} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
    //for dropdown menu
    dropDownMenu.classList.remove('open');
    updateIcon(); 

}


const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});


const sortSelect = document.getElementById("sort-select");
sortSelect.addEventListener("change", sortNewsBySelectedOption);

function sortNewsBySelectedOption() {
    const selectedOption = sortSelect.value;

    if (selectedOption === "newest") {
        sortNewsByDate(true); 
    } else if (selectedOption === "oldest") {
        sortNewsByDate(false); 
    }
    else if (selectedOption === "normal") {
        reload();
    }
}

function sortNewsByDate(sortByNewest) {
    const cardsContainer = document.getElementById("cards-container");
    const articles = Array.from(cardsContainer.children);

    articles.sort((a, b) => {
        const dateA = new Date(a.querySelector("#news-source").textContent.split("·")[1].trim());
        const dateB = new Date(b.querySelector("#news-source").textContent.split("·")[1].trim());

        if (sortByNewest) {
            return dateB - dateA; // Sort in descending order (newest date first)
        } else {
            return dateA - dateB; // Sort in ascending order (oldest date first)
        }
    });

    articles.forEach((article) => cardsContainer.appendChild(article));
}
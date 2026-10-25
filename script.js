const photoDatabase = [
  {
    title: "johnny silverhand's burger",
    imageUrl: "./images/1.jpg",
    description: "Nendoroid Johnny Silverhand in the Rolife Big Burger Shop.",
    rotation: -2.2,
  },
  {
    title: "drinks with the devil",
    imageUrl: "./images/2.jpg",
    description: "Nendoroid Lucifer in the Rolife Cheers Bar.",
    rotation: 1.8,
  },
  {
    title: "barbie's makeover",
    imageUrl: "./images/3.jpg",
    description: "Nendoroid Barbie in the Rolife Pink Beauty Secret Store.",
    rotation: -1.6,
  },
  {
    title: "miku's gamer run",
    imageUrl: "./images/4.jpg",
    description: "Nendoroid Miku Nakano in the Rolife Energy Supply Store.",
    rotation: 2.1,
  },
  {
    title: "umaru and her hamsters",
    imageUrl: "./images/5.jpg",
    description: "Nendoroid Umaru in the Rolife Furry Home Pet Store.",
    rotation: -1.9,
  },
  {
    title: "rapunzel's dream",
    imageUrl: "./images/6.jpg",
    description: "Nendoroid Rapunzel in the Rolife Fascinating Book Store",
    rotation: 1.4,
  },
];

let activeIndex = 0;
let isFlipped = false;
let magnifierEnabled = true;

function renderGallery() {
  const gallery = document.getElementById("galleryContainer");
  gallery.innerHTML = "";

  photoDatabase.forEach((photo, index) => {
    const card = document.createElement("div");
    card.className =
      "polaroid-card p-4 sm:p-5 rounded-none cursor-pointer flex flex-col justify-between";
    card.style.transform = `rotate(${photo.rotation}deg)`;
    card.onclick = () => openModal(index);

    card.innerHTML = `
          <div class="relative w-full main-photo-frame bg-slate-100 overflow-hidden mb-3.5 rounded-none border border-slate-200">
            <img src="${photo.imageUrl}" alt="${photo.title}" class="w-full h-full object-cover transition-transform duration-500 hover:scale-105">
          </div>
          <div class="pt-1 pb-1 text-center">
            <h3 class="text-slate-900 font-normal text-sm sm:text-base tracking-tight truncate heading-font">${photo.title}</h3>
          </div>
        `;

    gallery.appendChild(card);
  });
}

function openModal(index) {
  activeIndex = index;
  isFlipped = false;

  const modal = document.getElementById("photoModal");
  const flipCard = document.getElementById("modalFlipCard");

  flipCard.classList.remove("is-flipped");
  updateModalData(photoDatabase[index]);

  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.remove("opacity-0");
  }, 10);

  document.body.style.overflow = "hidden";
}

function updateModalData(photo) {
  document.getElementById("modalImgFront").src = photo.imageUrl;
  document.getElementById("modalTitleFront").innerText = photo.title;
  document.getElementById("modalTitleBack").innerText = photo.title;
  document.getElementById("modalDescBack").innerText = photo.description;
  document.getElementById("modalCounter").innerText =
    `${String(activeIndex + 1).padStart(2, "0")} / ${String(photoDatabase.length).padStart(2, "0")}`;

  const lens = document.getElementById("magnifierLens");
  lens.style.backgroundImage = `url('${photo.imageUrl}')`;
}

function toggleMagnifierMode(event) {
  if (event) event.stopPropagation();
  magnifierEnabled = !magnifierEnabled;

  const statusText = document.getElementById("magnifierStatusText");
  const icon = document.getElementById("magnifierIcon");
  const lens = document.getElementById("magnifierLens");

  if (magnifierEnabled) {
    statusText.innerText = "Zoom Active";
    icon.className = "fa-solid fa-magnifying-glass text-teal-600 text-[10px]";
  } else {
    statusText.innerText = "Zoom Off";
    icon.className =
      "fa-solid fa-magnifying-glass-minus text-slate-400 text-[10px]";
    lens.style.display = "none";
  }
}

function toggleFlip(event) {
  if (event) event.stopPropagation();
  isFlipped = !isFlipped;
  const flipCard = document.getElementById("modalFlipCard");
  const lens = document.getElementById("magnifierLens");

  lens.style.display = "none"; // Hide lens on flip

  if (isFlipped) {
    flipCard.classList.add("is-flipped");
  } else {
    flipCard.classList.remove("is-flipped");
  }
}

function closeModal() {
  const modal = document.getElementById("photoModal");
  const tiltWrapper = document.getElementById("modalTiltWrapper");
  const flipCard = document.getElementById("modalFlipCard");
  const lens = document.getElementById("magnifierLens");

  lens.style.display = "none";
  modal.classList.add("opacity-0");
  setTimeout(() => {
    modal.style.display = "none";
    tiltWrapper.style.transform = "rotateX(0deg) rotateY(0deg)";
    flipCard.classList.remove("is-flipped");
    isFlipped = false;
  }, 300);

  document.body.style.overflow = "auto";
}

function navigateModal(direction) {
  activeIndex =
    (activeIndex + direction + photoDatabase.length) % photoDatabase.length;
  const tiltWrapper = document.getElementById("modalTiltWrapper");
  const flipCard = document.getElementById("modalFlipCard");
  const lens = document.getElementById("magnifierLens");

  lens.style.display = "none";
  tiltWrapper.style.opacity = "0.3";
  setTimeout(() => {
    isFlipped = false;
    flipCard.classList.remove("is-flipped");
    updateModalData(photoDatabase[activeIndex]);
    tiltWrapper.style.opacity = "1";
  }, 150);
}

const magFrame = document.getElementById("magnifierFrame");
const magLens = document.getElementById("magnifierLens");

magFrame.addEventListener("mousemove", (e) => {
  if (!magnifierEnabled || isFlipped) {
    magLens.style.display = "none";
    return;
  }

  const rect = magFrame.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    magLens.style.display = "none";
    return;
  }

  magLens.style.display = "block";
  magLens.style.left = `${x}px`;
  magLens.style.top = `${y}px`;

  const zoomLevel = 2.5;
  const bgX = (x / rect.width) * 100;
  const bgY = (y / rect.height) * 100;

  magLens.style.backgroundSize = `${rect.width * zoomLevel}px ${rect.height * zoomLevel}px`;
  magLens.style.backgroundPosition = `${bgX}% ${bgY}%`;
});

magFrame.addEventListener("mouseleave", () => {
  magLens.style.display = "none";
});

const modalArea = document.getElementById("photoModal");
const tiltWrapper = document.getElementById("modalTiltWrapper");

modalArea.addEventListener("mousemove", (e) => {
  if (
    modalArea.style.display === "none" ||
    modalArea.classList.contains("opacity-0")
  )
    return;

  const rect = modalArea.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width / 2;
  const y = e.clientY - rect.top - rect.height / 2;

  const rotateX = (-y / rect.height) * 12;
  const rotateY = (x / rect.width) * 12;

  tiltWrapper.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
});

modalArea.addEventListener("mouseleave", () => {
  tiltWrapper.style.transform = "rotateX(0deg) rotateY(0deg)";
});

let touchStartX = 0;
let touchEndX = 0;

modalArea.addEventListener(
  "touchstart",
  (e) => {
    touchStartX = e.changedTouches[0].screenX;
  },
  { passive: true },
);

modalArea.addEventListener(
  "touchend",
  (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  },
  { passive: true },
);

function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;
  if (Math.abs(swipeDistance) > 50) {
    if (swipeDistance > 0) {
      navigateModal(-1);
    } else {
      navigateModal(1);
    }
  }
}

window.addEventListener("keydown", (e) => {
  const modal = document.getElementById("photoModal");
  if (modal.style.display === "none") return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowLeft") navigateModal(-1);
  if (e.key === "ArrowRight") navigateModal(1);
  if (e.key === " " || e.code === "Space") {
    e.preventDefault();
    toggleFlip();
  }
});

window.onload = function () {
  renderGallery();
};

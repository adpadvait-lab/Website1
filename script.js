var canvas = document.getElementById("starfield");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var context = canvas.getContext("2d");
var stars = 500;
var colorrange = [0, 60, 240];
var starArray = [];

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Initialize stars with random opacity values
for (var i = 0; i < stars; i++) {
    var x = Math.random() * canvas.offsetWidth;
    var y = Math.random() * canvas.offsetHeight;
    var radius = Math.random() * 1.2;
    var hue = colorrange[getRandom(0, colorrange.length - 1)];
    var sat = getRandom(50, 100);
    var opacity = Math.random();
    starArray.push({ x, y, radius, hue, sat, opacity });
}

var frameNumber = 0;
var opacity = 0;
var secondOpacity = 0;
var thirdOpacity = 0;
var textAnimationStarted = false; // Only start after Start button is clicked

var baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

function drawStars() {
    for (var i = 0; i < stars; i++) {
        var star = starArray[i];

        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, 360);
        context.fillStyle = "hsla(" + star.hue + ", " + star.sat + "%, 88%, " + star.opacity + ")";
        context.fill();
    }
}

function updateStars() {
    for (var i = 0; i < stars; i++) {
        if (Math.random() > 0.99) {
            starArray[i].opacity = Math.random();
        }
    }
}

const button = document.getElementById("valentinesButton");
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");
const finalMusic = document.getElementById("finalMusic");

let isMusicPlaying = false;

console.log("Script loaded!");
console.log("valentinesButton found:", button);

// START BUTTON - hides landing, begins canvas text animation, plays music
const startButton = document.getElementById("startButton");
if (startButton) {
    console.log("Start button found!");
    startButton.addEventListener("click", async () => {
        console.log("Start button clicked!");

        // 1) Start music on user gesture
        if (backgroundMusic && !isMusicPlaying) {
            try {
                await backgroundMusic.play();
                isMusicPlaying = true;
                if (musicToggle) {
                    musicToggle.textContent = "🔊";
                    musicToggle.classList.add("playing");
                }
                console.log("Music started");
            } catch (err) {
                console.log("Music autoplay failed:", err);
            }
        }

        // 2) Hide landing section to reveal canvas text animation
        const landingSection = document.getElementById('landing-section');
        if (landingSection) {
            landingSection.classList.remove('active');
        }

        // 3) Begin the canvas text animation
        frameNumber = 0;
        opacity = 0;
        secondOpacity = 0;
        thirdOpacity = 0;
        textAnimationStarted = true;
        console.log("Canvas text animation started!");
    });
} else {
    console.log("No start button found");
}

// Music toggle functionality
if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener("click", () => {
        const currentMusic = document.querySelector('audio:not([style*="display: none"])') || backgroundMusic;
        
        if (isMusicPlaying) {
            currentMusic.pause();
            musicToggle.textContent = "🔇";
            musicToggle.classList.remove("playing");
            isMusicPlaying = false;
        } else {
            currentMusic.play().then(() => {
                musicToggle.textContent = "🔊";
                musicToggle.classList.add("playing");
                isMusicPlaying = true;
            });
        }
    });
}

// Utility helpers
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Simple section navigation
function goToSection(sectionId) {
    console.log("Going to section:", sectionId);
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        console.log("Section activated:", sectionId);
    }
}

// Animate letter paragraphs (sequential, reliable)
async function showParagraphs() {
    const paragraphs = document.querySelectorAll('.letter-para');
    const button = document.getElementById('toGalleryBtn');

    console.log("Showing paragraphs:", paragraphs.length);

    // Ensure button hidden while revealing
    if (button) button.classList.add('hidden');

    for (let i = 0; i < paragraphs.length; i++) {
        const para = paragraphs[i];
        para.classList.add('visible');
        console.log("Paragraph", i, "visible");
        // wait 2.5s before next
        await delay(2500);
    }

    // small pause, then show navigation button
    await delay(600);
    if (button) {
        button.classList.remove('hidden');
        console.log("Gallery button shown");
    }
}

// Main button click ("Open Your Letter")
if (button) {
    console.log("Button listener attached");
    button.addEventListener("click", async () => {
        console.log("Open Letter button clicked!");

        // Hide the button immediately
        button.style.display = "none";

        // Stop canvas text animation
        textAnimationStarted = false;

        // Go straight to the love letter
        goToSection('letter-section');
        await delay(500);
        await showParagraphs();
    });
} else {
    console.log("ERROR: valentinesButton not found!");
}

// Gallery button
const toGalleryBtn = document.getElementById("toGalleryBtn");
if (toGalleryBtn) {
    console.log("Gallery button listener attached");
    toGalleryBtn.addEventListener("click", () => {
        console.log("Gallery button clicked!");
        goToSection('gallery-section');
        startSlideshow();
    });
}

// Final button
const toFinalBtn = document.getElementById("toFinalBtn");
if (toFinalBtn) {
    console.log("Final button listener attached");
    toFinalBtn.addEventListener("click", () => {
        console.log("Final button clicked!");
        goToSection('final-section');
        // Stop slideshow if running
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
        
        // Switch music
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
        if (finalMusic) {
            finalMusic.currentTime = 10;
            finalMusic.play().then(() => {
                isMusicPlaying = true;
                if (musicToggle) {
                    musicToggle.textContent = "🔊";
                    musicToggle.classList.add("playing");
                }
                console.log("Final music playing");
            }).catch(err => console.log("Final music failed:", err));
        }
    });
}

// Photo slideshow functionality with auto-advance
let currentSlide = 0;
let slideInterval = null;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (i === index) {
            slide.classList.add('active');
        }
    });
    
    dots.forEach((dot, i) => {
        dot.classList.remove('active');
        if (i === index) {
            dot.classList.add('active');
        }
    });
    
    currentSlide = index;
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
}

function startSlideshow() {
    // Clear any existing interval
    if (slideInterval) {
        clearInterval(slideInterval);
    }
    // Auto-advance slides every 3 seconds
    slideInterval = setInterval(nextSlide, 3000);
}

// Dot click handlers
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        // Restart auto-advance after manual click
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }
    });
});

function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * (fontSize + lineHeight));
    });
}

function drawText() {
    var fontSize = Math.min(30, window.innerWidth / 24); // Adjust font size based on screen width
    var lineHeight = 8;

    context.font = fontSize + "px Comic Sans MS";
    context.textAlign = "center";
    
    // glow effect
    context.shadowColor = "rgba(255, 150, 200, 1)";
    context.shadowBlur = 12;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    if(frameNumber < 250){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("Every morning feels brighter knowing you exist in my life", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    //fades out the text by decreasing the opacity
    if(frameNumber >= 250 && frameNumber < 500){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("Every morning feels brighter knowing you exist in my life", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    //needs this if statement to reset the opacity before next statement on canvas
    if(frameNumber == 500){
        opacity = 0;
    }
    if(frameNumber > 500 && frameNumber < 750){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Out of everything this world", "could have given me"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Out of everything this world could have given me", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    if(frameNumber >= 750 && frameNumber < 1000){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        
        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["Out of everything this world", "could have given me"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("Out of everything this world could have given me", canvas.width/2, canvas.height/2);
        }

        opacity = opacity - 0.01;
    }

    if(frameNumber == 1000){
        opacity = 0;
    }
    if(frameNumber > 1000 && frameNumber < 1250){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("It somehow led me to you", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1250 && frameNumber < 1500){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("It somehow led me to you", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 1500){
        opacity = 0;
    }
    if(frameNumber > 1500 && frameNumber < 1750){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("That still feels unbelievable to me", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 1750 && frameNumber < 2000){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("That still feels unbelievable to me", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2000){
        opacity = 0;
    }
    if(frameNumber > 2000 && frameNumber < 2250){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("Getting to know you has been my favorite miracle", canvas.width/2, canvas.height/2);
        opacity = opacity + 0.01;
    }
    if(frameNumber >= 2250 && frameNumber < 2500){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;
        context.fillText("Getting to know you has been my favorite miracle", canvas.width/2, canvas.height/2);
        opacity = opacity - 0.01;
    }

    if(frameNumber == 2500){
        opacity = 0;
    }
    if(frameNumber > 2500 && frameNumber < 99999){
        context.fillStyle = `rgba(255, 150, 200, ${opacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["What I feel for you keeps growing", "with every moment"], canvas.width / 2, canvas.height / 2, fontSize, lineHeight);
        } else {
            context.fillText("What I feel for you keeps growing with every moment", canvas.width/2, canvas.height/2);
        }

        opacity = opacity + 0.01;
    }
    
    if(frameNumber >= 2750 && frameNumber < 99999){
        context.fillStyle = `rgba(255, 150, 200, ${secondOpacity})`;

        if (window.innerWidth < 600) {
            drawTextWithLineBreaks(["I want to spend my days loving you,", "slowly and endlessly"], canvas.width / 2, (canvas.height/2 + 60), fontSize, lineHeight);
        } else {
            context.fillText("I want to spend my days loving you, slowly and endlessly", canvas.width/2, (canvas.height/2 + 50));
        }

        secondOpacity = secondOpacity + 0.01;
    }

    if(frameNumber >= 3000 && frameNumber < 99999){
        context.fillStyle = `rgba(255, 150, 200, ${thirdOpacity})`;
        context.fillText("Happy Valentine's Day, my love ❤", canvas.width/2, (canvas.height/2 + 120));
        thirdOpacity = thirdOpacity + 0.01;

        if (button) {
            button.style.display = "flex";
        }
    }   

     // Reset the shadow effect after drawing the text
     context.shadowColor = "transparent";
     context.shadowBlur = 0;
     context.shadowOffsetX = 0;
     context.shadowOffsetY = 0;
}

function draw() {
    context.putImageData(baseFrame, 0, 0);

    drawStars();
    updateStars();

    // Only draw text after Start button is clicked
    if (textAnimationStarted) {
        drawText();
        if (frameNumber < 99999) {
            frameNumber++;
        }
    }

    window.requestAnimationFrame(draw);
}

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
});

window.requestAnimationFrame(draw);
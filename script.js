function openScreen() {
    const newScreen = document.getElementById("screen2");
    const oldScreen = document.getElementById("screen1");
    const insignia = document.getElementById("insigniaContent");

    oldScreen.classList.add("inactive");

    setTimeout(() => {
        newScreen.classList.add("active");
        // Reveal insignia content after logo appears
        setTimeout(() => {
            if (insignia) insignia.style.opacity = 1;
        }, 700);
    }, 500);
}

function closeScreen() {
    const oldScreen = document.getElementById("screen1");
    const newScreen = document.getElementById("screen2");
    const insignia = document.getElementById("insigniaContent");

    newScreen.classList.remove("active");
    if (insignia) insignia.style.opacity = 0;

    setTimeout(() => {
        oldScreen.classList.add("active");
    }, 500);
}
function openScreen() {
    const newScreen = document.getElementById("screen2");
    const oldScreen = document.getElementById("screen1");

    oldScreen.classList.add("inactive");

    setTimeout(() => {
        newScreen.classList.add("active");
    }, 500);
}

function closeScreen() {
    const oldScreen = document.getElementById("screen1");
    const newScreen = document.getElementById("screen2");

    newScreen.classList.remove("active");

    setTimeout(() => {
        oldScreen.classList.add("active");
    })
}
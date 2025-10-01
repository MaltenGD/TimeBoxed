function switchScreen(screenNr) {
    const newScreen = document.getElementById("screen2");

    setTimeout(() => {
        newScreen.classList.add("active");
    }, 1000);
}
document.addEventListener("DOMContentLoaded", function () {
    const howToContainer = document.getElementById("howToContainer");
    const toggleButton = document.getElementById("toggleHowTo");

    toggleButton.addEventListener("click", function () {
        if (howToContainer.style.display === "none" || howToContainer.style.display === "") {
            howToContainer.style.display = "block";
            toggleButton.textContent = "Ocultar Passo a Passo";
        } else {
            howToContainer.style.display = "none";
            toggleButton.textContent = "Como adicionar ao Outlook?";
        }
    });
});

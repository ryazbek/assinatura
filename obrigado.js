document.addEventListener("DOMContentLoaded", function () {
    // Obtém o e-mail do usuário passado pela URL
    const urlParams = new URLSearchParams(window.location.search);
    const userEmail = urlParams.get("email") || "seu.email@ryazbek.com.br";

    // Insere o e-mail na mensagem
    document.getElementById("userEmail").textContent = userEmail;
    document.getElementById("userEmailCopy").textContent = userEmail;

    // Configura o botão para exibir/esconder o passo a passo
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

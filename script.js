document.getElementById("clearForm").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("signatureForm").reset();
});

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("cSoci5LgPAuAK5gcg");

    const form = document.getElementById("signatureForm");
    const previewContainer = document.getElementById("signature");

    function updatePreview() {
        const nome = document.getElementById("nome").value || "Seu Nome";
        const cargo = document.getElementById("cargo").value || "Seu Cargo";

        let emailInput = document.getElementById("email").value.trim();
        if (emailInput.endsWith("@ryazbek.com.br")) {
            emailInput = emailInput.replace("@ryazbek.com.br", "");
        }
        const email = emailInput + "@ryazbek.com.br";

        const telefone = document.getElementById("telefone").value || "Seu Telefone";
        const celular = document.getElementById("celular").value; 
        const endereco = document.getElementById("endereco").value || "Endereço da obra ou escritório";

        previewContainer.innerHTML = `
            <strong style="color:#333;">${nome}</strong><br>
            <span style="color:#333;">${cargo}</span><br>
            <a href="mailto:${email}" style="color:#696969;">${email}</a><br>
            <span style="color:#696969;">Tel: ${telefone}</span><br>
            ${celular ? `<span style="color:#696969;">Cel: ${celular}</span><br>` : ""}
            <span style="color:#696969;">${endereco}</span>
        `;
    }

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const cargo = document.getElementById("cargo").value;

        let emailInput = document.getElementById("email").value.trim();
        if (emailInput.endsWith("@ryazbek.com.br")) {
            emailInput = emailInput.replace("@ryazbek.com.br", "");
        }
        const email = emailInput + "@ryazbek.com.br";

        const telefone = document.getElementById("telefone").value;
        const celular = document.getElementById("celular").value;
        const endereco = document.getElementById("endereco").value;

        if (!nome || !cargo || !emailInput || !telefone || !endereco) {
            Swal.fire("Erro!", "Preencha todos os campos obrigatórios antes de enviar.", "error");
            return;
        }

        const templateParams = {
            nome_html: nome,
            cargo_html: cargo,
            user_html: email,
            tel_html: celular ? telefone + "|" + celular : telefone,
            address_html: endereco
        };

        emailjs.send("service_eegaehm", "template_cck7sxv", templateParams)
            .then(function (response) {
                Swal.fire({
                    title: "Sucesso!",
                    text: "A assinatura foi enviada com sucesso.",
                    icon: "success",
                    confirmButtonText: "OK"
                }).then(() => {
                    window.location.href = "obrigado.html";
                });
            })
            .catch(function (error) {
                console.error("Erro ao enviar e-mail:", error);
                Swal.fire("Erro!", `Ocorreu um erro ao enviar a assinatura: ${error.text || "Erro desconhecido"}`, "error");
            });
    });
});

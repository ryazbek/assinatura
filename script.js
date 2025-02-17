document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("cSoci5LgPAuAK5gcg"); // Substitua pelo seu User ID do EmailJS

    const form = document.getElementById("signatureForm");
    const previewContainer = document.getElementById("signature");
    const qrContainer = document.getElementById("qrcode");

    // Atualiza a prévia sempre que os campos mudam
    function updatePreview() {
        const nome = document.getElementById("nome").value || "Seu Nome";
        const cargo = document.getElementById("cargo").value || "Seu Cargo";
        const email = (document.getElementById("email").value || "seu.nome") + "@ryazbek.com.br";
        const telefone = document.getElementById("telefone").value || "Seu Telefone";
        const endereco = document.getElementById("endereco").value || "Endereço da obra ou escritório";

        // Atualiza a prévia da assinatura
        previewContainer.innerHTML = `
            <strong style="color:#333;">${nome}</strong><br>
            <span style="color:#333;">${cargo}</span><br>
            <a href="mailto:${email}" style="color:#696969;">${email}</a><br>
            <span style="color:#696969;">Tel: ${telefone}</span><br>
            <span style="color:#696969;">${endereco}</span>
        `;

        // Atualiza o QR Code
        gerarQRCode({ nome, cargo, email, telefone, endereco });
    }

    // Captura mudanças nos inputs para atualizar a prévia
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    // Função para gerar o QR Code
    function gerarQRCode(data) {
        qrContainer.innerHTML = ""; // Limpa antes de gerar um novo

        const qr = new QRCodeStyling({
            width: 150,
            height: 150,
            data: `https://www.ryazbek.com.br/assinatura?nome=${encodeURIComponent(data.nome)}&cargo=${encodeURIComponent(data.cargo)}&email=${encodeURIComponent(data.email)}&telefone=${encodeURIComponent(data.telefone)}&endereco=${encodeURIComponent(data.endereco)}`,
            image: "logo_y.png",
            dotsOptions: { color: "#696969", type: "square" },
            imageOptions: { crossOrigin: "anonymous", margin: 5 }
        });

        qr.append(qrContainer);
    }

    // Função de envio do e-mail
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita o recarregamento da página

        const nome = document.getElementById("nome").value;
        const cargo = document.getElementById("cargo").value;
        const email = document.getElementById("email").value + "@ryazbek.com.br";
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;

        if (!nome || !cargo || !email || !telefone || !endereco) {
            Swal.fire("Erro!", "Preencha todos os campos antes de enviar.", "error");
            return;
        }

        const templateParams = {
            nome_html: nome,
            cargo_html: cargo,
            user_html: email,
            tel_html: telefone,
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
                    window.location.href = "obrigado.html"; // Redireciona após fechar o alerta
                });
            })
            .catch(function (error) {
                Swal.fire("Erro!", "Ocorreu um erro ao enviar a assinatura. Tente novamente.", "error");
                console.error("Erro ao enviar e-mail:", error);
            });
    });
});

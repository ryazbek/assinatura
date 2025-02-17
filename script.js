document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("seu_user_id"); // Substitua pelo seu User ID do EmailJS

    document.getElementById("signatureForm").addEventListener("submit", function (event) {
        event.preventDefault();

        // Captura dos valores do formulário
        const nome = document.getElementById("nome").value;
        const cargo = document.getElementById("cargo").value;
        const email = document.getElementById("email").value + "@ryazbek.com.br";
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;

        // Gerar o QR Code com os dados
        const qrCodeUrl = gerarQRCode({ nome, cargo, email, telefone, endereco });

        // Criar o objeto de dados para o EmailJS
        const templateParams = {
            nome_html: nome,
            cargo_html: cargo,
            user_html: email,
            tel_html: telefone,
            address_html: endereco,
            qr_html: `<img src="${qrCodeUrl}" alt="QR Code">`
        };

        // Enviar o e-mail pelo EmailJS
        emailjs.send("seu_service_id", "seu_template_id", templateParams)
            .then(function (response) {
                console.log("E-mail enviado com sucesso!", response.status, response.text);
                Swal.fire("Sucesso!", "A assinatura foi enviada com sucesso.", "success")
                    .then(() => window.location.href = "obrigado.html");
            })
            .catch(function (error) {
                console.error("Erro ao enviar o e-mail:", error);
                Swal.fire("Erro!", "Ocorreu um erro ao enviar a assinatura. Tente novamente.", "error");
            });
    });

    function gerarQRCode(data) {
        const qr = new QRCodeStyling({
            width: 150,
            height: 150,
            data: `https://www.ryazbek.com.br/assinatura?nome=${encodeURIComponent(data.nome)}&cargo=${encodeURIComponent(data.cargo)}&email=${encodeURIComponent(data.email)}&telefone=${encodeURIComponent(data.telefone)}&endereco=${encodeURIComponent(data.endereco)}`,
            image: "logo_y.png",
            dotsOptions: { color: "#696969", type: "square" },
            imageOptions: { crossOrigin: "anonymous", margin: 5 }
        });

        const qrCanvas = document.createElement("canvas");
        qr.append(qrCanvas);

        return qrCanvas.toDataURL();
    }
});

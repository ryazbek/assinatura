document.addEventListener("DOMContentLoaded", function () {
    const nameInput = document.getElementById("name");
    const titleInput = document.getElementById("title");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const addressInput = document.getElementById("address");
    const signatureDiv = document.getElementById("signature");
    const generateButton = document.getElementById("generate");
    const qrCodeDiv = document.getElementById("qrcode");

    function updateSignature() {
        const name = nameInput.value || "Seu Nome";
        const title = titleInput.value || "Seu Cargo";
        const emailPrefix = emailInput.value || "seu.nome";
        const email = `${emailPrefix}@ryazbek.com.br`;
        const phone = phoneInput.value || "Seu Telefone";
        const address = addressInput.value || "Endereço da obra ou escritório";

        const signatureHTML = `
            <div style="font-family: Arial; font-size: 14px;">
                <strong>${name}</strong><br>
                ${title}<br>
                <a href="mailto:${email}" style="color: #0563C1;">${email}</a> | 
                <a href="https://www.ryazbek.com.br" style="color: #0563C1;">www.ryazbek.com.br</a><br>
                Telefone: ${phone}<br>
                ${address}<br>
            </div>
            <img src='logo_30anos.png' alt='Logo RYazbek' style='width: 150px; margin-top: 10px;'>
        `;

        signatureDiv.innerHTML = signatureHTML;

        // Criar e atualizar o QR Code
        const qrCode = new QRCodeStyling({
            width: 100,
            height: 100,
            data: `Nome: ${name}\nCargo: ${title}\nEmail: ${email}\nTelefone: ${phone}\nEndereço: ${address}`,
            dotsOptions: {
                color: "#696969",
                type: "rounded"
            },
            image: "logo_y.png",
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 5
            }
        });

        qrCodeDiv.innerHTML = "";
        qrCode.append(qrCodeDiv);
    }

    [nameInput, titleInput, emailInput, phoneInput, addressInput].forEach(input => {
        input.addEventListener("input", updateSignature);
    });

    generateButton.addEventListener("click", function () {
        const templateParams = {
            name: nameInput.value,
            title: titleInput.value,
            email: `${emailInput.value}@ryazbek.com.br`,
            phone: phoneInput.value,
            address: addressInput.value
        };

        emailjs.send("service_eegaehm", "template_cck7sxv", templateParams, "cSoci5LgPAuAK5gcg")
            .then(function (response) {
                window.location.href = "obrigado.html";
            }, function (error) {
                alert("Erro ao enviar email: " + error.text);
            });
    });
});

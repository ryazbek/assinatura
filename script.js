document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("cSoci5LgPAuAK5gcg");

    const form = document.getElementById("signatureForm");
    const previewContainer = document.getElementById("signature");
    const qrContainer = document.getElementById("qrcode");

    function updatePreview() {
        const nome = document.getElementById("nome").value || "Seu Nome";
        const cargo = document.getElementById("cargo").value || "Seu Cargo";
        const email = (document.getElementById("email").value || "seu.nome") + "@ryazbek.com.br";
        const telefone = document.getElementById("telefone").value || "Seu Telefone";
        const endereco = document.getElementById("endereco").value || "Endereço da obra ou escritório";

        previewContainer.innerHTML = `
            <strong style="color:#333;">${nome}</strong><br>
            <span style="color:#333;">${cargo}</span><br>
            <a href="mailto:${email}" style="color:#696969;">${email}</a><br>
            <span style="color:#696969;">Tel: ${telefone}</span><br>
            <span style="color:#696969;">${endereco}</span>
        `;
    }

    async function gerarQRCodeMeQR(nome, cargo, email, telefone, endereco) {
        const meQrToken = "102ea313e6bc9b5ec8673cf8aef71762f9f398b5e0cc103809f0f5ec42bfb2cc";
        const qrData = {
            token: meQrToken,
            qrType: 2,
            title: "Assinatura de E-mail",
            service: "api",
            format: "png",
            qrOptions: {
                color: "#696969",
                logo: "https://ryazbek.github.io/logo_y.png"
            },
            qrFieldsData: {
                vcard: {
                    first_name: nome,
                    last_name: "",
                    job_title: cargo,
                    email: email,
                    phone: telefone,
                    address: endereco
                }
            }
        };

        try {
            const response = await fetch("https://me-qr.com/api/v1/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(qrData)
            });

            const result = await response.json();

            if (result && result.qr_code_url) {
                return result.qr_code_url;
            } else {
                console.error("Erro ao gerar o QR Code:", result);
                return "";
            }
        } catch (error) {
            console.error("Erro na requisição ao Me-QR:", error);
            return "";
        }
    }

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value;
        const cargo = document.getElementById("cargo").value;
        const email = document.getElementById("email").value + "@ryazbek.com.br";
        const telefone = document.getElementById("telefone").value;
        const endereco = document.getElementById("endereco").value;

        if (!nome || !cargo || !email || !telefone || !endereco) {
            Swal.fire("Erro!", "Preencha todos os campos antes de enviar.", "error");
            return;
        }

        /* Swal.fire({
            title: "Aguarde...",
            text: "Gerando QR Code e enviando email.",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        const qrCodeUrl = await gerarQRCodeMeQR(nome, cargo, email, telefone, endereco);

        if (!qrCodeUrl) {
            Swal.fire("Erro!", "Falha ao gerar o QR Code.", "error");
            return;
        } 

        qrContainer.innerHTML = `<img src="${qrCodeUrl}" alt="QR Code">`; */

        const templateParams = {
            nome_html: nome,
            cargo_html: cargo,
            user_html: email,
            tel_html: telefone,
            address_html: endereco,
            // qr_html: `<img src="${qrCodeUrl}" alt="QR Code">`
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

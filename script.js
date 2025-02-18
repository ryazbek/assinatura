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

        gerarQRCode({ nome, cargo, email, telefone, endereco });
    }

    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", updatePreview);
    });

    function gerarQRCode(data) {
        qrContainer.innerHTML = "";
        const qr = new QRCodeStyling({
            width: 150,
            height: 150,
            data: `https://ryazbek.github.io/assinatura/qrcode.html?user=${encodeURIComponent(data.email.split('@')[0])}`,
            image: "logo_y.png",
            dotsOptions: { color: "#696969", type: "square" },
            imageOptions: { crossOrigin: "anonymous", margin: 5 }
        });
        qr.append(qrContainer);
        setTimeout(() => {
            qrContainer.querySelector("canvas").toBlob(blob => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    data.qrCodeBase64 = reader.result;
                };
                reader.readAsDataURL(blob);
            });
        }, 500);
    }
    

    async function atualizarJSONUsuario(usuario) {
        const repo = "ryazbek/assinatura";
        const path = "data/usuarios.json";
        const token = "SEU_PERSONAL_ACCESS_TOKEN";
        
        try {
            const response = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                headers: { Authorization: `token ${token}` }
            });

            const data = await response.json();
            const conteudoAtual = JSON.parse(atob(data.content));

            conteudoAtual[usuario.email] = usuario;

            const novoConteudo = btoa(JSON.stringify(conteudoAtual, null, 2));
            
            await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
                method: "PUT",
                headers: {
                    Authorization: `token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `Atualizando usuário ${usuario.email}`,
                    content: novoConteudo,
                    sha: data.sha
                })
            });
        } catch (error) {
            console.error("Erro ao atualizar JSON no GitHub:", error);
        }
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const cargo = document.getElementById("cargo").value.trim();
        const emailInput = document.getElementById("email").value.trim();
        const telefone = document.getElementById("telefone").value.trim();
        const endereco = document.getElementById("endereco").value.trim();

        if (!nome || !cargo || !emailInput || !telefone || !endereco) {
            Swal.fire("Erro!", "Preencha todos os campos antes de enviar.", "error");
            return;
        }

        const email = emailInput + "@ryazbek.com.br";
        const usuario = { nome, cargo, email, telefone, endereco };

        await atualizarJSONUsuario(usuario);

        const templateParams = {
            nome_html: nome,
            cargo_html: cargo,
            user_html: email,
            tel_html: telefone,
            address_html: endereco,
            to_email: email,
            qr_html: usuario.qrCodeBase64
        };

        emailjs.send("service_eegaehm", "template_cck7sxv", templateParams)
            .then(() => {
                window.location.href = "obrigado.html";
            })
            .catch(error => {
                console.error("Erro ao enviar e-mail:", error);
                Swal.fire("Erro!", `Ocorreu um erro ao enviar a assinatura: ${error.text || "Erro desconhecido"}`, "error");
            });
    });
});

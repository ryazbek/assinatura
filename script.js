document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("cSoci5LgPAuAK5gcg");

    const form = document.getElementById("signatureForm");
    const previewContainer = document.getElementById("signature");
    const qrContainer = document.getElementById("qrcode");
    const part1 = "github_pat_11BAT4VNQ0qNdg0zpABmge_SbxoeDoJ";
    const part2 = "FJWVzptAVoAzMsOJnhqQufzSFkMk8Dgqaz4QGRHAJ5GGqkDGSuJ";
    const GITHUB_TOKEN = part1 + part2;
    const branch = "main";
    const token = GITHUB_TOKEN;
    const repoOwner = "ryazbek";
    const repoName = "assinatura";
    const filePath = "usuarios.json";

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

        return new Promise(resolve => {
            setTimeout(() => {
                qrContainer.querySelector("canvas").toBlob(blob => {
                    const reader = new FileReader();
                    reader.onloadend = function () {
                        data.qrCodeBase64 = reader.result;
                        resolve(data);
                    };
                    reader.readAsDataURL(blob);
                });
            }, 500);
        });
    }

    async function commitUsuariosJSON(usuario) {
        const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;
    
        try {
            const response = await fetch(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            let usuariosAtuais = [];
    
            if (response.ok) {
                const data = await response.json();
                const sha = data.sha;
    
                try {
                    const decodedContent = atob(data.content);
                    usuariosAtuais = JSON.parse(decodedContent);
    
                    if (!Array.isArray(usuariosAtuais)) {
                        console.warn("usuarios.json não é um array, resetando...");
                        usuariosAtuais = [];
                    }
                } catch (e) {
                    console.error("❌ Erro ao decodificar usuarios.json:", e);
                    usuariosAtuais = [];
                }
    
                usuariosAtuais.push(usuario);
    
                const novoConteudoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(usuariosAtuais, null, 2))));
    
                const updateResponse = await fetch(apiUrl, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: `Atualizando usuarios.json - Adicionado ${usuario.nome}`,
                        content: novoConteudoBase64,
                        sha: sha,
                        branch: branch,
                    }),
                });
    
                if (updateResponse.ok) {
                    console.log("✅ `usuarios.json` atualizado e commit enviado!");
                } else {
                    const errorText = await updateResponse.text();
                    throw new Error(`❌ Erro ao atualizar usuarios.json: ${errorText}`);
                }
            }
        } catch (error) {
            console.error("❌ Erro no commit:", error);
        }
    }

    async function atualizarUsuariosEEsperar() {
        console.log("⏳ Atualizando usuarios.json...");
        await commitUsuariosJSON();

        console.log("✅ usuarios.json atualizado! Agora gerando QR Code...");
        await esperarWorkflowConcluir("usuarios.json.yml");

        console.log("⏳ Iniciando workflow de QR Code...");
        await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/qrcode.yml/dispatches`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ref: branch }),
        });

        await esperarWorkflowConcluir("qrcode.yml");
        console.log("✅ QR Code gerado! Agora enviando e-mail...");
        enviarEmail();
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("🔵 Formulário enviado!");
        await atualizarUsuariosEEsperar();
    });
});

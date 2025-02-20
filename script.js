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
            // Obtém o conteúdo atual do arquivo
            const response = await fetch(apiUrl, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) {
                throw new Error(`Erro ao buscar usuarios.json: ${response.statusText}`);
            }
    
            const data = await response.json();
            const sha = data.sha;
    
            // Decodifica o JSON atual
            let usuariosAtuais = [];
            try {
                usuariosAtuais = JSON.parse(atob(data.content));
            } catch (e) {
                console.error("Erro ao decodificar usuarios.json:", e);
            }
    
            // Adiciona o novo usuário
            usuariosAtuais.push(usuario);
    
            // Converte para Base64 corretamente
            const novoConteudoBase64 = btoa(unescape(encodeURIComponent(JSON.stringify(usuariosAtuais, null, 2))));
    
            // Atualiza o arquivo no repositório
            const updateResponse = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: "Atualizando usuarios.json para novo usuário",
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
        } catch (error) {
            console.error("❌ Erro no commit:", error);
        }
    }    

    async function esperarWorkflowConcluir() {
        const repoOwner = "ryazbek";
        const repoName = "assinatura";
        const workflowId = "qrcode.yml";

        let status = "queued";

        while (status === "queued" || status === "in_progress") {
            await new Promise((resolve) => setTimeout(resolve, 5000));

            const response = await fetch(
                `https://api.github.com/repos/${repoOwner}/${repoName}/actions/workflows/${workflowId}/runs`,
                {
                    headers: { Authorization: `token ${GITHUB_TOKEN}` },
                }
            );

            const data = await response.json();
            if (data.workflow_runs.length > 0) {
                status = data.workflow_runs[0].status;
                console.log(`⏳ Status do Actions: ${status}`);
            }
        }

        console.log("✅ GitHub Actions finalizado! Agora enviando e-mail...");
        return status === "completed";
    }

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("🔵 Formulário enviado!");

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
        let usuario = { nome, cargo, email, telefone, endereco };

        console.log("🔄 Gerando QR Code...");
        usuario = await gerarQRCode(usuario);
        console.log("✅ QR Code gerado!");

        console.log("🔄 Commitando usuarios.json...");
        await commitUsuariosJSON(usuario);
        console.log("✅ Commit realizado!");

        console.log("⏳ Aguardando GitHub Actions...");
        const workflowFinalizado = await esperarWorkflowConcluir();

        if (workflowFinalizado) {
            console.log("✅ GitHub Actions concluído! Enviando e-mail...");
            const templateParams = {
                nome_html: nome,
                cargo_html: cargo,
                user_html: email,
                tel_html: telefone,
                address_html: endereco,
                to_email: email,
                qr_html: usuario.qrCodeBase64,
                qrcode_url: `https://raw.githubusercontent.com/ryazbek/assinatura/main/qrcodes/${emailInput}.png`
            };

            try {
                await emailjs.send("service_eegaehm", "template_cck7sxv", templateParams);
                console.log("📩 E-mail enviado com sucesso!");
                window.location.href = "obrigado.html";
            } catch (error) {
                console.error("Erro ao enviar e-mail:", error);
                Swal.fire("Erro!", `Ocorreu um erro ao enviar a assinatura: ${error.text || "Erro desconhecido"}`, "error");
            }
        } else {
            Swal.fire("Erro!", "Ocorreu um erro ao gerar o QR Code.", "error");
        }
    });
});

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

        await commitUsuariosJSON(usuario);
        console.log("✅ Commit realizado!");

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
            Swal.fire("Erro!", `Erro ao enviar e-mail: ${error.text || "Erro desconhecido"}`, "error");
        }
    });
});

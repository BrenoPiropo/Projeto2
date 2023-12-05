document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
        .then(response => response.json())
        .then(data => {
            // console.log(data);
            if (data.success) {
                localStorage.setItem("id_usuario", data.id_usuario);
                console.log(data.id_usuario); // Adicione esta linha para verificar o id_usuario
                const url = window.location.origin + "/Projeto/ToDoList/frontend/main.html";
                window.location.href = url;
            } else {
                alert("Login falhou. Verifique suas credenciais.");
            }
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error);
        });
});


document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    fetch("http://localhost:3000/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Cadastro bem-sucedido, redirecione para a página de login ou faça o que for necessário
                alert("Cadastro bem-sucedido! Faça login para continuar.");
                const url = window.location.origin + "/Projeto/ToDoList/frontend/index.html";
                window.location.href = url;
            } else {
                // Exiba uma mensagem de erro informando o motivo do fracasso do cadastro
                alert(`Cadastro falhou. ${data.message}`);
            }
        })
        .catch(error => {
            console.error("Erro ao fazer cadastro:", error);
        });
});
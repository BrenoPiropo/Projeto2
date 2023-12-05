let id_tarefa = null;

window.onload = () => {
    // get id_tarefa
    const url = new URL(window.location.href);
    id_tarefa = url.searchParams.get('id_tarefa');
    console.log(id_tarefa);

    // get dados tarefa
    fetch(`http://localhost:3000/user/tasks/get_detailed_task/${id_tarefa}`)
    .then(response => {
        if (response.status === 200) {
            return response.json();
        } else {
            console.log('Erro ao obter dados da tarefa.');
        }
    })
        .then(tarefa => {
            //receber as datas para botar em um formato legivel ao usuario
            const dataCriada = new Date(tarefa[0].data_criada);
            const dataAtualizada = new Date(tarefa[0].data_atualizada);
            // Formatação das datas para um formato mais legível
            const formatoData = { year: 'numeric', month: 'numeric', day: 'numeric'};
            const dataCriadaFormatada = dataCriada.toLocaleDateString('pt-BR', formatoData);
            const dataAtualizadaFormatada = dataAtualizada.toLocaleDateString('pt-BR', formatoData);

            // Mostra informações adicionais sobre a tarefa
            const infoTarefa = document.createElement("div");
            infoTarefa.innerHTML = `
                <p><strong>Descrição da tarefa:</strong> ${tarefa[0].descricao}</p>   
                <p><strong>Email do Usuário:</strong> ${tarefa[0].email}</p>             
                <p><strong>Data Criada:</strong> ${dataCriadaFormatada}</p>
                <p><strong>Data Atualizada:</strong> ${dataAtualizadaFormatada}</p>
                <p><strong>Status:</strong> ${tarefa[0].status}</p>
            `;
            document.querySelector("#informacoes_tarefa").appendChild(infoTarefa);
        });

    // Adiciona um evento de clique para o botão de exclusão
document.querySelector("#btn_del").addEventListener("click", ()=>{
    fetch(`http://localhost:3000/user/tasks/delete_task/${id_tarefa}`)
        .then(response=>{
            if (response.status === 200) {
                return response.json();
            } else {
                console.log('Erro ao obter dados da tarefa.');
            }  
        })
        .then(response=>{
        //redirecionar para a pagina inicial das tarefas
        const url = window.location.origin + "/Projeto/ToDoList/frontend/main.html";
        window.location.href = url;
        })
        .catch(()=>{
            console.log('erro');
        })
});
};
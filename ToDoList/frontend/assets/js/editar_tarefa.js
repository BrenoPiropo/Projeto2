let id_tarefa = null;

window.onload = ()=>{
    
    //get id_tarefa
    const url = new URL(window.location.href);
    id_tarefa = url.searchParams.get('id_tarefa');
    console.log(id_tarefa);

    //get dados tarefa
    fetch(`http://localhost:3000/user/tasks/get_task/${id_tarefa}`)
    .then(response=>{
        if(response.status===200){
            return (response.json());
        }else{
            console.log('erro');
        }
    })
    .then(tarefa =>{
        document.querySelector("#descrição_tarefa").value = tarefa[0].descricao; //item 0 compoe os dados da tarefa, puxando descricao em especifico

    })
}

document.querySelector("#btn_att").addEventListener('click', ()=>{

    let descricao = document.querySelector("#descrição_tarefa").value;
    let error = document.querySelector("#error");
    //checar se é vazio
    if(descricao == null || descricao == ''){
        document.querySelector("#error").textContent="Preencha o campo de texto";
        error.classList.remove("d-none");
        return;
    }
    //checar para limitar ate 100 de tamanho
    if(descricao.length > 100){
        document.querySelector("#error").textContent="Limite de palavras excedido";
        error.classList.remove("d-none");
        return;
    }else{
        error.classList.add("d-none");
    }
    //atualiza tarefa no banco de dados
    fetch(`http://localhost:3000/user/tasks/update_task`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({descricao, id_tarefa})
    })
    .then(response=>{
        if(response.status===200){
            return response.json();
        }
    })
        //redirecionar para a pagina inicial das tarefas
        const url = window.location.origin + "/Projeto/ToDoList/frontend/main.html";
        window.location.href = url;
    
})
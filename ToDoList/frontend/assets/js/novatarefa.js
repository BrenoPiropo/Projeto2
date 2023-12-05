let id_usuario = null;

window.onload = ()=>{
    
    //get usuario
    const url = new URL(window.location.href);
    id_usuario = url.searchParams.get('id_usuario');
    console.log(id_usuario);
}

document.querySelector("#btn_salvar").addEventListener('click', ()=>{

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
    //add nova tarefa
    fetch(`http://localhost:3000/user/tasks/newtask/`,{
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({descricao, id_usuario})
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
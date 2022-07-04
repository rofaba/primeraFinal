function deleteItem() {

    let casilla = document.querySelector("['admin']")
        if (casilla.checked == true) {
    
            let num = document.querySelector('#id').value;
            console.log(num)
            fetch(`http://localhost:8080/productos/${num}`, {
                method: "DELETE",
                headers: {
                'Content-type': 'application/json'
            },
            })
    } else {
        console.log('Ruta exclusiva para administradores')
    }
}    
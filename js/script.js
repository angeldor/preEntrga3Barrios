let usuarios = [
    { nombre: "angel", nombreUsuario: "admin", contraseña: "admin", tareas: [] },
    { nombre: "federico", nombreUsuario: "fede_usuario", contraseña: "123456", tareas: [] },
    { nombre: "María", nombreUsuario: "mariamagica", contraseña: "Magia@2023", tareas: [] },
    { nombre: "Juan", nombreUsuario: "juanjugador", contraseña: "Juegos$R3tos", tareas: [] },
    { nombre: "Sofía", nombreUsuario: "sofialinda", contraseña: "Sofia@Linda#1", tareas: [] },
    { nombre: "Carlos", nombreUsuario: "carlosviajero", contraseña: "V1aj3r0!Mund0", tareas: [] }
]
const toggleButtonSingUp = document.getElementById("registrarse")
const toggleButtonLogin = document.getElementById("loginButton")
const loginPage = document.getElementById("loginPage")
const singUpPage = document.getElementById("singUpPage")
const taskPage = document.getElementById("taskPage")

document.addEventListener("DOMContentLoaded", function () {
    toggleButtonSingUp.addEventListener('click', function () {
        if (loginPage.classList.contains("oculto")) {
            loginPage.classList.remove("oculto")
            singUpPage.classList.add("oculto")
        } else {
            loginPage.classList.add("oculto")
            singUpPage.classList.remove("oculto")
        }
    })
})
document.addEventListener("DOMContentLoaded", function () {
    toggleButtonLogin.addEventListener('click', function () {
        if (singUpPage.classList.contains("oculto")) {
            singUpPage.classList.remove("oculto")
            loginPage.classList.add("oculto")
        } else {
            singUpPage.classList.add("oculto")
            loginPage.classList.remove("oculto")
        }
    })
})
const loginForm = document.getElementById("login")
const singUpForm = document.getElementById("singUp")
let usuarioActual = null
const botonLogout = document.getElementById("logout")

botonLogout.addEventListener("click", function () {
    location.reload() // Recargar la página
})
function validarLogin() {
    const username = document.getElementById("username").value
    const password = document.getElementById("password").value

    const usuarioValido = usuarios.find((usuario) => {
        return usuario.nombreUsuario === username && usuario.contraseña === password
    })
    if (usuarioValido) {
        Swal.fire({
            icon: 'success',
            title: 'Genial!',
            text: 'Iniciaste sesión',
            showConfirmButton: false,
            timer: 1000
        })
        if (loginPage.classList.contains("oculto")) {
            loginPage.classList.remove("oculto")
            taskPage.classList.add("oculto")
        } else {
            loginPage.classList.add("oculto")
            taskPage.classList.remove("oculto")
        }
        usuarioActual = usuarioValido
        console.log(usuarioActual)
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Usuario o contraseña incorrectos!'
        })
    }
}
function registrarUsuario() {
    const nombre = document.getElementById("nombreRegistro").value
    const nombreUsuario = document.getElementById("nombreUsuarioRegistro").value
    const contraseña = document.getElementById("contraseñaRegistro").value

    const usuarioExistente = usuarios.find((usuario) => {
        return usuario.nombreUsuario === nombreUsuario
    })

    if (usuarioExistente) {
        Swal.fire({
            icon: 'warning',
            title: 'Nombre de usuario existente'
        })
    } else if (nombre == "" || nombreUsuario == "" || contraseña == "") {
        Swal.fire({
            tittle: 'Oh no',
            icon: 'alert',
            text: 'Debes completar todos los campos!'
        })
    } else {
        const nuevoUsuario = {
            nombre: nombre,
            nombreUsuario: nombreUsuario,
            contraseña: contraseña,
            tareas: []
        }
        usuarios.push(nuevoUsuario)
        localStorage.setItem("usuarios", JSON.stringify(usuarios))
        Swal.fire({
            icon: 'success',
            tittle: 'Genial',
            text: 'Te registraste correctamente'
        })
    }
}
document.addEventListener("DOMContentLoaded", function () {
    const usuariosGuardados = localStorage.getItem("usuarios")
    if (usuariosGuardados) {
        usuarios = JSON.parse(usuariosGuardados)
    }
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault()
        validarLogin()
        mostrarTarea()
    })

    singUpForm.addEventListener("submit", function (e) {
        e.preventDefault()
        registrarUsuario()
    })
})
const inputBox = document.getElementById("inputBox")
const listContainer = document.getElementById("listContainer")
const botonAgregarTarea = document.getElementById("agregarTarea")

botonAgregarTarea.addEventListener("click", function () {
    if (inputBox.value === '') {
        Swal.fire({
            icon: 'error',
            title: 'No puedes agregar tareas vacías',
            showConfirmButton: false,
            timer: 1000
        });
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        listContainer.appendChild(li);
        let span = document.createElement("span");
        span.innerHTML = "\u00d7";
        li.appendChild(span);

        guardarDatos()
            .then(() => {
                inputBox.value = '';
                Swal.fire({
                    icon: 'success',
                    title: 'Tarea agregada',
                    showConfirmButton: false,
                    timer: 600
                });
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al guardar los datos',
                    text: error.message
                });
            });
    }
})
function guardarDatos() {
    return new Promise((resolve, reject) => {
        if (usuarioActual) {
            const index = usuarios.findIndex((usuario) => usuario === usuarioActual);
            if (index !== -1) {
                usuarios[index].tareas = Array.from(listContainer.children).map((li) => li.textContent);
                try {
                    localStorage.setItem("usuarios", JSON.stringify(usuarios)); // Guardar en localStorage
                    resolve();
                } catch (error) {
                    reject(error);
                }
            }
        } else {
            reject(new Error("Usuario no encontrado"));
        }
    });
}
function mostrarTarea() {
    listContainer.innerHTML = ''

    if (usuarioActual) {
        usuarioActual.tareas.forEach((tarea) => {
            let li = document.createElement("li")
            li.textContent = tarea

            let span = document.createElement("span")
            span.innerHTML = "\u00d7"

            li.appendChild(span)
            listContainer.appendChild(li)
        });
    } else {
        const usuariosGuardados = localStorage.getItem("usuarios")
        if (usuariosGuardados) {
            usuarios = JSON.parse(usuariosGuardados)
        }
    }
}
listContainer.addEventListener(`click`, function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("hecho")
        guardarDatos()
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove()
        guardarDatos()
    }
}, false)
mostrarTarea()
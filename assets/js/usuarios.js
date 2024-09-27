const frm = document.querySelector('#frmUser');
const correo = document.querySelector('#correo');
const nombre = document.querySelector('#nombre');
const telefono = document.querySelector('#telefono');
const clave = document.querySelector('#clave');
const id_user = document.querySelector('#id_user');
const btn_nuevo = document.querySelector('#btn-nuevo');
const btn_save = document.querySelector('#btn-save');
document.addEventListener('DOMContentLoaded', function () {
  $('#table_users').DataTable({
    ajax: {
      url: ruta + 'controllers/usuariosController.php?option=listar',
      dataSrc: ''
    },
    columns: [
      { data: 'id_usuario' },
      { data: 'nombre' },
      { data: 'correo' },
      { data: 'telefono' },
      { data: 'accion' }
    ],
    language: {
      url: 'https://cdn.datatables.net/plug-ins/1.13.1/i18n/es-ES.json'
    },
    "order": [[0, 'desc']]
  });
  frm.onsubmit = function (e) {
    e.preventDefault();
    if (correo.value == '' || nombre.value == ''
      || telefono.value == ''|| clave.value == '') {
      message('error', 'TODO LOS CAMPOS CON * SON REQUERIDOS')
    } else {
      const frmData = new FormData(frm);
      axios.post(ruta + 'controllers/usuariosController.php?option=save', frmData)
        .then(function (response) {
          const info = response.data;
          message(info.tipo, info.mensaje);
          if (info.tipo == 'success') {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }
  btn_nuevo.onclick = function () {
    frm.reset();
    id_user.value = '';
    btn_save.innerHTML = 'Guardar';
    clave.removeAttribute('readonly');
    nombre.focus();
  }

})

function deleteUser(id) {
  Snackbar.show({
    text: 'Esta seguro de eliminar',
    width: '475px',
    actionText: 'Si eliminar',
    backgroundColor: '#FF0303',
    onActionClick: function (element) {
      axios.get(ruta + 'controllers/usuariosController.php?option=delete&id=' + id)
        .then(function (response) {
          const info = response.data;
          message(info.tipo, info.mensaje);
          if (info.tipo == 'success') {
            setTimeout(() => {
              window.location.reload();
            }, 1500);
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });

}

function editUser(id) {
  axios.get(ruta + 'controllers/usuariosController.php?option=edit&id=' + id)
    .then(function (response) {
      const info = response.data;
      correo.value = info.correo;
      nombre.value = info.nombre;
      telefono.value = info.telefono;
      clave.value = '*********************';
      clave.setAttribute('readonly', 'readonly');
      id_user.value = info.id_usuario;
      btn_save.innerHTML = 'Actualizar';
      nombre.focus();
    })
    .catch(function (error) {
      console.log(error);
    });
}
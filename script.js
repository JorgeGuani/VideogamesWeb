const server_url = 'http://localhost:5219/api';


$(function(){
    getVideogames();

    // Abrir modal para crear
    $('#btn-new').on('click', function () {
        $('#videogame-title').text('Crear videojuego');
        $('#videogame-id').val('');
        $('#videogameFormModal').modal('show');
    });

    // Cerrar modal
    $('#videogameFormModal .close, #videogameFormModal .close-modal').on('click', function() {
        $('#videogameFormModal').modal('hide');
    });

    // Limpiar modal
    $('#videogameFormModal').on('hidden.bs.modal', function (e) {
        setTimeout(() => {
            $('#guardarForm').trigger("reset");
            $('div.error').remove();
            $('#videogameFormModal .error').removeClass('error');
            $('#videogameFormModal .invalid').removeClass('invalid');
        }, 250);
    });

    // Abrir modal para editar
    $(document).on('click', '.btn-edit', function() {
        const id = $(this).data('id');
        $('#videogameFormModal').modal('show');
        $('#videogame-title').text('Editar videojuego');
        $.ajax({
            url: `${server_url}/Videogames/${id}`,
            type: 'GET',
            success: function(data) {
                $('#videogame-id').val(data.id);
                Object.keys(data).forEach((item) => {
                    $('#' + item).val(data[item]);
                });
            },
            error: function(error) {
                console.error(error);
            }
        });
    });

    // Validación campos formulario
    $('#guardarForm').validate({
        rules: {
            nombre: "required",
            categoria: "required",
            anioLanzamiento: "required",
            clasificacion: "required",
            plataformas: "required"
        },
        messages: {
            "nombre": "Este campo es obligatorio",
            "categoria": "Este campo es obligatorio",
            "anioLanzamiento": "Este campo es obligatorio",
            "clasificacion": "Este campo es obligatorio",
            "plataformas": "Este campo es obligatorio"
        },
        errorElement: 'div',
        errorPlacement: function(error, element) {
            var placement = $(element).parents('.form-group');
            $(element).addClass('invalid');
            $(error).css('color', '#F44336 ');
            if (placement) {
                $(placement).append(error);
            } else {
                error.insertAfter(element);
            }
        }
    });

    // POST and PUT
    $('#guardarForm').on('submit', function(e) {
        e.preventDefault();
        
        if (!$(this).valid()) {
            Swal.fire({
                icon: 'info',
                title: 'Formulario incorrecto',
                text: 'El formulario tiene observaciones',
                icon: 'info'
            });
            return;
        }

        const isNew = !$('#videogame-id').val();
        const data = $(this).serializeArray();

        if (isNew) {
            const index = data.findIndex(x => x.name == 'id');
            if (index != -1) {
                data.splice(index, 1);
            }
        }

        $.ajax({
            url: `${server_url}/Videogames${!isNew ? ('/' + $('#videogame-id').val()) : ''}`,
            type: !isNew ? 'PUT' : 'POST',
            data: data,
            success: function() {
                $('#videogameFormModal').modal('hide');
                getVideogames();
                Swal.fire({
                    icon: 'success',
                    title: 'Registro guardado',
                    text: `El registro se ha ${isNew ? 'creado' : 'modificado'} con éxito`,
                    icon: 'success'
                });
            },
            error: function(error) {
                console.error(error);
            }
        });
    });

    // Abrir modal confirmar eliminar
    $(document).on('click', '.btn-delete', function() {
        const id = $(this).data('id');
        $('#videogame-delete-id').val(id);
        $('#videogameDeleteModal').modal('show');
    });
    // Cerrar modal eliminar
    $('#videogameDeleteModal .close, #videogameDeleteModal .close-modal').on('click', function() {
        $('#videogameDeleteModal').modal('hide');
    });

    $('#eliminarForm').on('submit', function(e) {
        e.preventDefault();
        const id = $('#videogame-delete-id').val();
        $.ajax({
            url: `${server_url}/Videogames/${id}`,
            type: 'DELETE',
            success: function() {
                $('#videogameDeleteModal').modal('hide');
                getVideogames();
                Swal.fire({
                    icon: 'success',
                    title: 'Registro eliminado',
                    text: `El registro se ha eliminado con éxito`,
                    icon: 'success'
                });
            },
            error: function(error) {
                console.error(error);
            }
        });
    });
});

/**
 * Trae los videojuegos
 */
function getVideogames() {
    $.ajax({
        url: `${server_url}/Videogames`,
        type: 'GET',
        success: function(data) {
            let videogameRows = '';
            $('#table-body').html('');
            data.forEach((item, index) => {
                videogameRows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${item.nombre}</td>
                        <td>${item.categoria}</td>
                        <td>${item.anioLanzamiento}</td>
                        <td>${item.clasificacion}</td>
                        <td>${item.plataformas}</td>
                        <td>
                            <div class="d-flex gap-3 btn-icon">
                                <span class="btn-edit" data-id="${item.id}">
                                    <i class="bi bi-pencil-fill"></i>
                                </span>
                                <span class="btn-delete" data-id="${item.id}">
                                    <i class="bi bi-trash-fill"></i>
                                </span>
                            </div>

                        </td>
                    </tr>
                `;
            });
            $('#table-body').html(videogameRows);
        },
        error: function(error) {
            console.error(error);
        }
    });
}
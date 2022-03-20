export const MESSAGES = {
	COMMON: {
		CREATE_DATA: 'Registro exitoso',
		UPDATE_DATA: 'Registro actualizado',
		DELETE_DATA: 'Registro eliminado',
		FOUND_DATA: 'Registro encontrado',
		WARNING: {
			NAME_DATA: 'El nombre ya esta registrado',
			MOBILE_DATA: 'EL número ya esta registrado',
			EMAIL_DATA: 'El correo ya esta registrado',
			DNI_DATA: 'El dni ya esta registrado',
			NO_DATA_FOUND: 'No hay registros',
		},
		ERROR: {
			CREATE: 'Error al guardar el registro',
			UPDATE: 'Error al actualizar el registro, no existe',
			ROLES: 'No estas autorizado para ejecutar esta acción',
			DELETE: 'El registro no existe',
		},
	},
	AUTH: {
		LOGIN: {
			DISABLE: 'Este usuario se encuentra deshabilitado, por favor contacte a un administrador'
		},
		REGISTER: {
		},
		RECOVERY_PASSWORD: {
			NO_EMAIL: 'El correo electrónico no se encuentra registrado',
			SEND_EMAIL: 'Se ha enviado un link a su correo electrónico, para el cambio de contraseña',
			ERROR: {
				CHANGE: 'Ha ocurrido un error al actualizar la contraseña, por favor intente nuevamente',
				MATCH: 'Las contraseñas no coinciden, por favor verifique',
			}
		}
	},
	USER: {
		PASSWORD_UPDATE: 'La contraseña ha sido actualizada',
		WARNING: {
			EMAIL_CREATE: 'El correo ya esta regitrado',
			MOBILE_CREATE: 'El número de célular ya esta regitrado',
			PHONE_CREATE: 'El número de telefóno ya esta regitrado',
			USER_CREATE: 'El usuario ya esta regitrado',
			NO_MATH_PASSWORD: 'El usuario y password no coinciden',
			NO_EXIST: 'No existe el usuario'
		},
	},
	SWAGGER: {
		EMAIL_UNIQUE: 'El correo electrónico de su cuenta debe ser único'
	},
}
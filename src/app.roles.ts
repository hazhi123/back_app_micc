import { RolesBuilder } from 'nest-access-control';

export enum AppRoles {
	ADMIN = 'ADMIN',
	USER = 'USER',
}

export enum AppResources {
	USER = 'USER',
}

export const roles: RolesBuilder = new RolesBuilder();

roles
	// USER ROLES
	.grant(AppRoles.USER) 		// Nombre del rol user
	.updateOwn([ 				// Actualiza su mismo registro
		AppResources.USER
	])
	.deleteOwn([				// Elimina su mismo registro
		AppResources.USER
	])

	// ADMIN ROLES
	.grant(AppRoles.ADMIN) 		// Nombre del rol admin
	.extend(AppRoles.USER) 		// Hereda los permiso del rol user
	.createAny([				// Registra cualquier registro
		AppResources.USER,
	])
	.readAny([
		AppResources.USER,
	])
	.updateAny([				// Actualiza cualquier registro
		AppResources.USER,
	])
	.deleteAny([				// Elimina cualquier registro
		AppResources.USER,
	])
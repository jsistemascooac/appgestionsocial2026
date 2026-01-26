import { command, form, getRequestEvent, prerender, query } from '$app/server';

import { error, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { success } from 'zod';
import { getUser, getUsuario } from '../login/user.remote';

export const getWorkflowRequerimientos = query(async () => {
	let loading = false;

	const { locals, params } = getRequestEvent();

	let cookiesasociado = await getUsuario();

	const asociado = JSON.parse(cookiesasociado ? cookiesasociado : 'null');

	let idWFMovimiento = params.id;

	//  console.log("Asociado en getWorkflowRequerimientos:", idWFMovimiento);
	if (asociado) {
		if (asociado.nhabilidad === 0) {
			redirect(307, '/asociado/dashboard');
		}
	} else {
		redirect(307, '/asociado/login');
	}

	try {
		loading = true;
		const requerimientos = await locals.pb.send('/solicitudes/requerimientos/', {
			query: {
				wf_mov: idWFMovimiento
			}
		});

		//  console.log(`getWorkflowRequerimientos:`, requerimientos)
		return { requerimientos: requerimientos, idWFM: params.id };
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	} finally {
		loading = false;
	}
});

export const getWFMovimiento = query(async () => {
	const { locals, params } = getRequestEvent();

	

				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	let idWFMovimiento = params.id;
	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_movimientos = await locals.pb
			.collection('wf_movimientos')
			.getFirstListItem(`id='${idWFMovimiento}'`, {
				//  expand: 'wf_movimiento,wf_movimiento.wf_workflow,',
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_movimientos;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});


export const getDepartamentos = query(async () => {
	const { locals } = getRequestEvent();


	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const departamentos = await locals.pb
			.collection('departamentos')
			.getFullList({
				sort: 'nombre'
			});

	//	console.log("getWFMovimiento ProcesoxxxZZ:", departamentos)
		return departamentos;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const getMunicipios = query(v.string(), async (id) => {
	const { locals } = getRequestEvent();


	//console.log("Municipios ProcesMMM:", id)
	try {
		const municipios = await locals.pb
			.collection('municipios')
			.getList(1, 50, {
				filter: `departamento='${id}'`,
				sort: 'nombre'
			});

		//console.log("getWFMovimiento ProcesoxxxZZ:", municipios)
		return municipios;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});



export const getBeneficiarioTipos = query(async () => {
	const { locals, params } = getRequestEvent();

	//let idWFMovimiento = params.id;
	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const beneficiarioTipo = await locals.pb.collection('as_beneficiarios_tipo').getFullList({
			sort: '-created'
		});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return beneficiarioTipo;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const getWFMConfiguracion = query(async () => {
	const { locals, params } = getRequestEvent();
		const user = await getUser();


				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	let idWFMovimiento = params.id;
	// console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_movimientos_configuracion = await locals.pb
			.collection('wf_movimientos_configuracion')
			.getFirstListItem(`wf_movimiento='${idWFMovimiento}'`, {
				expand: 'wf_movimiento,wf_movimiento.wf_estado,wf_movimiento.wf_workflow,as_beneficiarios_tipo',
			});

		// console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_movimientos_configuracion;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const getWFMCAnexosTipos = query(async () => {
	const { locals, params } = getRequestEvent();
	let idWFMovimiento = params.id;

	

				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {

		const wfMovimiento = await getWFMovimiento()

		const anexosTipos = await locals.pb
			.collection('wf_workflows_configuracion_anexos_tipos')
			.getFullList({
				expand: `wf_workflows_anexos_tipo,`, //attachments(course), chapters(course)'
				filter: `noActivo=false && wf_workflow = '${wfMovimiento.wf_workflow}'`
			});
		return anexosTipos;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

/* const SearchSchema = v.object({
	idWFMovimiento: v.string(),
	idWFMTipoAnexo: v.string()
}); */

export const getWFMovimientosAnexos = query(v.string(), async (idWFMTipoAnexo) => {
	const { locals, params } = getRequestEvent();

	let idWFMovimiento = params.id;
	//  console.log("getWFMovimientosAnexos getAttachments:", idWFMovimiento)
	try {
		const wfMovimientosAnexo = await locals.pb
			.collection('wf_movimientos_anexos')
			.getFirstListItem(
				`wf_movimiento='${idWFMovimiento}' && wf_movimientos_anexos_tipo='${idWFMTipoAnexo}'`,
				{}
			);
		//  console.log("getAttachments:", wfMovimientosAnexo)
		return wfMovimientosAnexo;
	} catch (e) {
		if (e.status === 404) {
			console.warn('Registro no encontrado');
			// No lanzar un error, devolver null o un valor por defecto
			return false;
		} else {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
});

const SchemaGatos = v.object({
	valor: v.pipe(
		v.string(), // Receive as string
		v.transform((input) => Number(input)), // Coerce to number
		v.number('Debe registrar un valor numerico.'), // Validate it is a number
		v.minValue(1, 'EL valor debe ser mayor 0')
	),
	idWFMConfiguracion: v.string()
});

export const updateGatos = form(SchemaGatos, async ({ valor, idWFMConfiguracion }) => {
	const { locals } = getRequestEvent();

	//	let id = params.id;
	//  console.log('Update valor:',params.id,valor)

				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	try {
		await locals.pb
			.collection('wf_movimientos_configuracion')
			.update(`${idWFMConfiguracion}`, { valor });
		//	if (id !== undefined) {
		await getWorkflowRequerimientos().refresh();
		//	}

		return { success: true };
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

const SchemaEsBeneficiario = v.object({
	beneficiario: v.boolean(),
	idWFMConfiguracion: v.string()
});

export const updateEsBeneficiario = command(SchemaEsBeneficiario, async ({ idWFMConfiguracion, beneficiario }) => {
	const { locals } = getRequestEvent();


				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	try {
		await locals.pb
			.collection('wf_movimientos_configuracion')
			.update(`${idWFMConfiguracion}`, { beneficiario: !beneficiario });
		//	if (id !== undefined) {
		await getWorkflowRequerimientos().refresh();
		await getWFMConfiguracion().refresh();
		//	}

		return { success: true };
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});



const SchemaTipoBeneficiario = v.object({
	as_beneficiarios_tipo: v.string(),
	idWFMConfiguracion: v.string()
});

export const updateTipoBeneficiario = command(SchemaTipoBeneficiario, async ({ as_beneficiarios_tipo, idWFMConfiguracion }) => {
	const { locals } = getRequestEvent();

				if( !locals.user){
				redirect(307, '/asociado/login');
				}

	//console.log("updateTipoBeneficiario, LLego hasta aqui...",as_beneficiarios_tipo)

	try {
		await locals.pb
			.collection('wf_movimientos_configuracion')
			.update(`${idWFMConfiguracion}`, { as_beneficiarios_tipo });
		await getWorkflowRequerimientos().refresh();
		//	await getWFMConfiguracion().refresh()
		//	if (id !== undefined) {
		//Promise.all([getWFMConfiguracion().refresh(),getWorkflowRequerimientos().refresh()]);

		/* await getWFMovimientosAnexos(as_beneficiarios_tipo).refresh(); */
		//	}

		return { success: true };
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});



const SchemaDatosBeneficiario = v.object({
	identificacion: v.pipe(
		v.string(), // Receive as string
		v.transform((input) => Number(input)), // Coerce to number
		v.number('Debe registrar un valor numerico.'), // Validate it is a number
		v.minValue(6, 'ALmenos debe tener 6 digitos')
	),
	nombres: v.pipe(
		v.string(),
		v.regex(/^[a-zA-Z\\s]+$/, 'Por favor solo letras.'),
		v.nonEmpty('Por favor registrelos nombres')
	),
	apellidos: v.pipe(
		v.string(),
		v.regex(/^[a-zA-Z\\s]+$/, 'Por favor solo letras.'),
		v.nonEmpty('Por favor registre los apeliidos')
	),
	idWFMConfiguracion: v.string()
});

export const updateDatosBeneficiario = form(SchemaDatosBeneficiario, async (data) => {
	const { locals } = getRequestEvent();


				if( !locals.user){
				redirect(307, '/asociado/login');
				}


	let { idWFMConfiguracion, identificacion, nombres, apellidos } = data
	console.log("updateDatosBeneficiario, LLego hasta aqui...", { identificacion, nombres, apellidos }, idWFMConfiguracion)

	try {
		await locals.pb
			.collection('wf_movimientos_configuracion')
			.update(`${idWFMConfiguracion}`, { identificacion, nombres, apellidos });
		//	if (id !== undefined) {
		await getWorkflowRequerimientos().refresh();
		//	await getWFMConfiguracion().refresh()
		//await Promise.all([getWFMConfiguracion().refresh(), getWFMCAnexosTipos().refresh()])
		//	}

		return { success: true };
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});


//banco,numeroCuenta,tipoCuenta,idWFMConfiguracion,idWFMovimiento

const SchemaBanco = v.object({
	banco: v.pipe(v.string(), v.nonEmpty('Por favor registre un banco')),
	numeroCuenta: v.pipe(v.string(), v.nonEmpty('Por favor registre un numero de cuenta')),
	tipo_cuenta: v.pipe(
		v.string(),
		v.regex(/^[a-zA-Z\\s]+$/, 'Por favor solo letras.'),
		v.nonEmpty('Por favor registre un tipo de cuenta')
	),
	idWFMConfiguracion: v.string()
});

export const updateBanco = form(
	SchemaBanco,
	async ({ banco, numeroCuenta, tipo_cuenta, idWFMConfiguracion }) => {
		const { locals } = getRequestEvent();

				if( !locals.user){
				redirect(307, '/asociado/login');
				}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			await locals.pb
				.collection('wf_movimientos_configuracion')
				.update(`${idWFMConfiguracion}`, { banco, numeroCuenta, tipo_cuenta });

			//	if (id !== undefined) {
			await getWorkflowRequerimientos().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);

let fechaActual = new Date();
// 2. Obtener el año actual y restarle uno
let añoMenosUno = fechaActual.getFullYear() - 1;
// 3. Establecer el nuevo año en el objeto Date
fechaActual.setFullYear(añoMenosUno);

const SchemaFallecimiento = v.object({
	/*	fallecimiento: v.pipe(v.string(),
		v.isoDate()),*/
	fallecimiento: v.pipe(
		v.string(), // Input is a string from FormData
		v.check((value) => value.length > 0, 'Date cannot be empty'), // Basic validation
		v.transform((value) => new Date(value)), // Convert to Date object
		v.date('Invalid date format') // Validate it is a valid Date object
	),
	departamento: v.pipe(v.string(), v.nonEmpty('Por favor seleccione un departamento')),
	municipio: v.pipe(v.string(), v.nonEmpty('Por favor seleccione un municipio')),
	idWFMConfiguracion: v.string()
});

export const updateFallecimeinto = form(
	SchemaFallecimiento,
	async ({ fallecimiento, departamento, municipio, idWFMConfiguracion }) => {
		const { locals } = getRequestEvent();
		

				if( !locals.user){
				redirect(307, '/asociado/login');
				}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			await locals.pb
				.collection('wf_movimientos_configuracion')
				.update(`${idWFMConfiguracion}`, { fallecimiento, departamento, municipio });

			//	if (id !== undefined) {
			await getWorkflowRequerimientos().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);


export const addAnexo = form(
	v.object({
		wf_movimientos_anexos_tipo: v.pipe(v.string(), v.nonEmpty()),

		soporte: v.pipe(
			v.file(),
			v.mimeType(['application/pdf'], 'The file must be a PDF.'),
			v.maxSize(1024 * 1024 * 2, 'The file must be less than 2MB.')
		)
	}),
	async ({ wf_movimientos_anexos_tipo, soporte }) => {
		//console.log('addAnexo RF:', wf_movimientos_anexos_tipo, soporte);

		const { locals, params } = getRequestEvent();

		let id = params.id;
		//console.log('Update valor:', params.id);

				if( !locals.user){
				redirect(307, '/asociado/login');
				}


		try {
			await locals.pb
				.collection('wf_movimientos_anexos')
				.create({ wf_movimiento: id, wf_movimientos_anexos_tipo, soporte, user: locals.user?.id });

			if (id !== undefined) {
				await getWorkflowRequerimientos().refresh();
				await getWFMovimientosAnexos(wf_movimientos_anexos_tipo).refresh();
			}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);

const DeleteSchema = v.object({
	idAnexo: v.string(),
	idWFMTipoAnexo: v.string()
});

export const deleteAnexo = command(DeleteSchema, async ({ idAnexo, idWFMTipoAnexo }) => {
	const { locals, params } = getRequestEvent();
	//	let id = params.id;
	console.log('Eliminar Anexo,deleteAnexo:', idWFMTipoAnexo);

				if( !locals.user){
				redirect(307, '/asociado/login');
				}



	try {
		await locals.pb.collection('wf_movimientos_anexos').delete(`${idAnexo}`);

		//	if (id !== undefined) {
		await getWorkflowRequerimientos().refresh();
		await getWFMovimientosAnexos(idWFMTipoAnexo).refresh();
		//}
		return { success: true };
	} catch (e) {
		console.log('Error Interno: ', e);

		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const deleteSolicitud = form(async () => {
	const { locals, params } = getRequestEvent();
	let id = params.id;


				if( !locals.user){
				redirect(307, '/asociado/login');
				}

	console.log('deleteSolicitud ProcesoxxxYYY:', id);
	try {
		await locals.pb.send('/solicitudes/borrar/', {
			query: { wf_movimiento: id }
		});

	//	console.log('deleteSolicitud ProcesoxxxYYY1:', id);



	} catch (e) {
		console.log('Error Interno: ', e);

		error(403, { message: 'Error interno del servidor:' + e });
	}
	redirect(303, `/asociado/dashboard`);
});



export const registrarSolicitud = form(v.object({ idSiguienteEstado: v.string() }), async (data) => {
	const { locals, params } = getRequestEvent();
	let id = params.id;


				if( !locals.user){
				redirect(307, '/asociado/login');
				}

	console.log('registrarSolicitud ProcesoxxxYYY:', data.idSiguienteEstado);
	try {
		await locals.pb.collection('wf_movimientos').update(`${id}`, {

			wf_estado: data.idSiguienteEstado,
			user: locals.user?.id
		});

		//console.log('deleteSolicitud ProcesoxxxYYY1:', id);



	} catch (e) {
		console.log('Error Interno: ', e);

		error(403, { message: 'Error interno del servidor:' + e });
	}
	redirect(303, `/asociado/dashboard`);
});

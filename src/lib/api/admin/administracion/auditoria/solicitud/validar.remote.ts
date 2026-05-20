import { command, form, getRequestEvent, query } from '$app/server';
import * as v from 'valibot';
import { error, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const getWFMovimiento = query(async () => {
	const { locals } = getRequestEvent();

	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_movimientos = await locals.pb.collection('v_solicitudes_movimientos').getList(1, 50, {
			sort: '-updated'
		});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_movimientos;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const addWFValidarTarea = command(v.string(), async (id) => {
	const { locals } = getRequestEvent();

	if (!locals.user) {
		redirect(307, '/admin/login');
	}

	console.log('updateEstado,id,comite:', id, locals.user.expand?.perfil.gs_entidad);

	try {
	
	
 
		await locals.pb.send('/admin/comite/movimientos/estado', {
			query: { wf_movimiento: id, gs_entidad: locals.user.expand?.perfil.gs_entidad}
		});


		const wf_movimiento = await locals.pb.collection('wf_movimientos').getOne(`${id}`, {});
		console.log('Validar Proceso:', id, wf_movimiento);
		const res = await fetch(
			env.API_FINANCIAL_LOCAL +
				'/habilidades/?identificacion=' +
				wf_movimiento.response_api.identificacion
		);
		const response_api = await res.json();

		const data = {
			wf_tarea: wf_movimiento.wf_tarea,
			wf_movimiento: wf_movimiento.id,
			responseAPI: response_api[0],
			user: locals.user.id
			//"estado": "aprobado"
		};

		const record = await locals.pb.collection('wf_validar_tareas').create(data);

		console.log('Validar ProcesoxxxYYY1:', id, record);
		return record;

	 
	} catch (e) {
		console.log('Error Interno: ', e);

		error(403, { message: 'Error interno del servidor:' + e });
	}
});



export const getWFValidarTarea = query(async () => {
	const { locals, params } = getRequestEvent();

	    console.log("getWFValidarTarea ProcesoxxxZZ:", params.id)
	 try {
		const wf_validar_tarea = await locals.pb
			.collection('wf_validar_tareas')
			.getOne(`${params.id}`, {
				expand:'wf_tarea.wf_workflow,wf_movimiento,wf_tarea.gs_entidad'
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_validar_tarea;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	} 
});


export const getWFValidarTareaEstado = query(v.string(),async (tarea_id) => {
	const { locals } = getRequestEvent();

	    console.log("getWFMovimiento ProcesoxxxZZ:", tarea_id)
	try {
		const wf_validar_tarea_estado = await locals.pb
			.collection('wf_estados')
			.getFullList({
				filter:`wf_tarea='${tarea_id}' && fin=true && inicio=false`,
				sorte: 'orden'
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_validar_tarea_estado;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});


export const getWFValidarTareaParametro = query(v.string(),async (tarea_id) => {
	const { locals } = getRequestEvent();

	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_validar_tarea_parametro = await locals.pb
			.collection('wf_tareas_parametros')
			.getFirstListItem(`wf_tarea='${tarea_id}'`,{			
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_validar_tarea_parametro;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});


export const getWFValidarTareaMovimientoEstado = query(async () => {
	const { locals } = getRequestEvent();

	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_validar_tarea_movimiento_estado = await locals.pb
			.collection('wf_validar_tareas_movimientos_estados')
			.getFullList({
				sorte: 'orden'
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_validar_tarea_movimiento_estado;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

/* export const getWFValidarTareaMovimiento = query(async () => {
	const { locals, params } = getRequestEvent();

	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_validar_tarea = await locals.pb
			.collection('wf_validar_tareas_movimientos')
			.getFullList({
				expand: 'wf_validar_tarea,wf_workflows_tareas_validar,wf_workflow_tarea_requerimiento',
				sort: 'wf_workflows_tareas_validar.tipo',
				filter: `wf_validar_tarea='${params.id}'`
			});

		//    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
		return wf_validar_tarea;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});
 */


export const getWFValidarTareaMovimiento = query(async () => {
	const { locals, params } = getRequestEvent();

	//    console.log("getWFMovimiento ProcesoxxxZZ:", id)
	try {
		const wf_validar_tarea =  await locals.pb.send('/admin/comite/solidaridad/validar', {
			query: { wf_validar_tarea_mov: params.id}
		});

		  //  console.log("getWFValidarTareaMovimiento ProcesoxxxZZ:", await wf_validar_tarea)
		return wf_validar_tarea;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});
export const updateEstado = command(v.string(), async (id) => {
	const { locals } = getRequestEvent();

	let comite = '6ubp7q2uh66o7ky';
//	console.log('updateEstado,id,comite:', id, comite);
	try {
		let estado = await locals.pb.send('/admin/comite/movimientos/estado', {
			query: { wf_movimiento: id, gs_entidad: comite }
		});

		return estado;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

export const updateTipoValidarMovimientoEstado = command(
	v.object({ idValidarMovimiento: v.string(), wf_validar_tareas_movimientos_estado: v.string() }),
	async ({ idValidarMovimiento, wf_validar_tareas_movimientos_estado }) => {
		const { locals } = getRequestEvent();

		if (!locals.user) {
			redirect(307, '/admin/login');
		}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			await locals.pb
				.collection('wf_validar_tareas_movimientos')
				.update(`${idValidarMovimiento}`, { wf_validar_tareas_movimientos_estado,revisado:true });

			//	if (id !== undefined) {
			await getWFValidarTareaMovimiento().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);

export const updateTipoValidarMovimientoObservacion = command(
	v.object({ idValidarMovimiento: v.string(), observacion: v.string() }),
	async ({ idValidarMovimiento, observacion }) => {
		const { locals } = getRequestEvent();

		if (!locals.user) {
			redirect(307, '/admin/login');
		}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			await locals.pb
				.collection('wf_validar_tareas_movimientos')
				.update(`${idValidarMovimiento}`, { observacion });

			//	if (id !== undefined) {
			await getWFValidarTareaMovimiento().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);

export const updateCheckValidarMovimiento = command(
	v.object({ idValidarMovimiento: v.string(), observacion: v.string() }),
	async ({ idValidarMovimiento, observacion }) => {
		const { locals } = getRequestEvent();

		if (!locals.user) {
			redirect(307, '/admin/login');
		}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			await locals.pb
				.collection('wf_validar_tareas_movimientos')
				.update(`${idValidarMovimiento}`, { observacion, revisado: true });

			//	if (id !== undefined) {
			await getWFValidarTareaMovimiento().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);




export const updateWFValidarTarea = form(
	v.object({ estado: v.pipe(v.string(), v.nonEmpty('Por favor registre un estado')),
	
		observacion: v.string() }),
	async ({  estado,observacion }) => {
		const { locals,params } = getRequestEvent();

		if (!locals.user) {
			redirect(307, '/admin/login');
		}

		//     console.log('Update valor:',params.id,banco,numeroCuenta,tipo_cuenta)

		try {
			let validar_tarea = await locals.pb
				.collection('wf_validar_tareas')
				.update(`${params.id}`, { observacion});

				await locals.pb
				.collection('wf_movimientos')
				.update(`${validar_tarea.wf_movimiento}`, {wf_estado:estado, observacion});	
			//	if (id !== undefined) {
			//await getWFValidarTareaMovimiento().refresh();
			//	}
			return { success: true };
		} catch (e) {
			console.log('Error: ', e);
			error(403, { message: 'Error interno del servidor:' + e });
		}
	}
);




export const updateWFValidarTareaFinancial = command(v.string(), async (identificacion) => {
	const { locals,params } = getRequestEvent();

	if (!locals.user) {
		redirect(307, '/admin/login');
	}

	let id = params.id
	let comite = '6ubp7q2uh66o7ky';
	console.log('updateEstado,id,comite:', id, comite);

	try {
	
	
		console.log('Validar Proceso:', id);
		const res = await fetch(
			env.API_FINANCIAL_LOCAL +
				'/habilidades/?identificacion=' +
				identificacion
		);
		const response_api = await res.json();

		const data = {		
			responseAPI: response_api[0],
			user: locals.user.id
			//"estado": "aprobado"
		};

		const record = await locals.pb.collection('wf_validar_tareas').update(`${id}`,data);
		getWFValidarTarea().refresh()
	//console.log('Validar ProcesoxxxYYY1:', id, record);
		return record;

		/* 	await locals.pb.send('/comite/solidaridad/validar', {
			query: { wf_movimiento: id }
		});

		const wf_validar = await locals.pb.collection('wf_movimientos_validar').getFullList({
			expand: 'wf_movimiento,wf_workflows_tareas_validar,wf_workflow_tarea_requerimiento',
			sort: '-updated'
		});

		return wf_validar; */
		//	console.log('deleteSolicitud ProcesoxxxYYY1:', id);
	} catch (e) {
		console.log('Error Interno: ', e);

		error(403, { message: 'Error interno del servidor:' + e });
	}
});
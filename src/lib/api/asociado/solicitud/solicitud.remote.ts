import { form, getRequestEvent, query } from '$app/server';
import { asociadoAPISchema } from '$lib/schemas/auth';

import { error, redirect } from '@sveltejs/kit';
import * as v from 'valibot';
import { getUsuario } from '../login/user.remote';

export const getWorkFlows = query(async () => {
	const { locals } = getRequestEvent();
	
	let cookiesasociado = await getUsuario();

	const asociado = JSON.parse(cookiesasociado ? cookiesasociado : 'null');


 //console.log("Asociado en getWorkFlows:", asociado,locals.user);
	if (locals.user && asociado) {
		if (asociado.nhabilidad === 0) {
			redirect(307, '/asociado/dashboard');
		}
	} else {
		redirect(307, '/login');
	}

	try {
		const workflows = await locals.pb.collection('wf_workflows').getFullList({
			sort: '-created',
			filter: `disable = false && wf_tipo.gs_auxilio.wf_auxilios_tipo= '7t26087ipu84j2d'`
		});
	//	console.log("Registro workflows:",workflows)

		return workflows;
	} catch (e) {
		console.log('Error: ', e);
		error(403, { message: 'Error interno del servidor:' + e });
	}
});

const searchSchema = v.object({
	identificacion:v.number(),
	idWF: v.string(),
	idWFTarea: v.string(),
	idWFEstado: v.string()
});

export const getWFMovimiento = query(searchSchema, async ({ identificacion, idWF, idWFTarea, idWFEstado }) => {
	const { locals } = getRequestEvent();

	// console.log("Asociado en getWorkFlows:", asociado);

	try {
		const wf_movimiento = await locals.pb
			.collection('wf_movimientos')
			.getFirstListItem(
				`wf_estado = '${idWFEstado}' && wf_tarea='${idWFTarea}' && wf_workflow='${idWF}' && response_api.identificacion = ${identificacion}`,
				{
					sort: '-created'
				}
			);

		return wf_movimiento;
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

export const createSolicitud = form(
	v.object({
		workflow: v.pipe(v.string(), v.nonEmpty()),
		urlfuncionalidad: v.pipe(v.string(), v.nonEmpty()),
		response_api: v.pipe(v.string(), v.parseJson(),asociadoAPISchema)
	}),
	async (data) => {
		const { locals } = getRequestEvent();
		let solicitud;
	
		try {
			//console.log('Creando nueva solicitud para el workflow ID:', data, data.response_api);

			const wf_tarea = await locals.pb
				.collection('wf_tareas')
				.getFirstListItem(
					`wf_workflow='${data.workflow}' && wf_estado='918tzb33cm2xu2p' && orden=1`
				);

			const wf_estado = await locals.pb
				.collection('wf_estados')
				.getFirstListItem(`wf_workflow='${data.workflow}' && inicio=true`);

			let idWF = data.workflow;
			let idWFEstado = wf_estado.id;
			let idWFTarea = wf_tarea.id;
			let identificacion = data.response_api.identificacion

			// SI existe una solicitud sin terminar va buscar la ultima solicitud
			solicitud = await getWFMovimiento({identificacion ,idWF, idWFEstado, idWFTarea });

			if (!solicitud) {
				solicitud = await locals.pb.collection('wf_movimientos').create({
					wf_workflow: idWF,
					wf_estado: idWFEstado,
					wf_tarea: idWFTarea,
					response_api: data.response_api,
					user: locals.user?.id
				});

				const fieldsData = {
					wf_movimiento: solicitud.id,
					user: locals.user?.id,
					beneficiario:
						(data.workflow == 'e9mp6m7e4v4t23n' || data.workflow == 's234j3k050oa94q') ? true : false,
					sepe: false,
					uso_sepe: false
				};

				//console.log("Registro WFCon:",fieldsData)

				await locals.pb.collection('wf_movimientos_configuracion').create(fieldsData);
				console.log("createdModule", );
			}
		} catch (e) {
		//	console.log('Error al crear la solicitud:', e);
			const status = e instanceof Error && 'status' in e ? (e as any).status : 500;
			error(status, 'Error al crear la solicitud: ' + String(e));
		}

		redirect(303, `/asociado/solicitud/editar/${solicitud.id}/${data.urlfuncionalidad}`);
	}
);

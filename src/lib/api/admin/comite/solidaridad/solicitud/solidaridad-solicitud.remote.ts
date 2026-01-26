import { getRequestEvent, query } from "$app/server";
import { error } from "@sveltejs/kit";


export const getWFMovimiento = query(async () => {
    const { locals, params } = getRequestEvent();

    let idWFMovimiento = params.id;
    //    console.log("getWFMovimiento ProcesoxxxZZ:", id)
    try {
        const wf_movimientos = await locals.pb
            .collection('v_solicitudes_movimientos')
            .getList(1,50, {
                sort: '-updated',
            });

        //    console.log("getWFMovimiento ProcesoxxxZZ:", wf_movimientos_configuracion)
        return wf_movimientos;
    } catch (e) {
        console.log('Error: ', e);
        error(403, { message: 'Error interno del servidor:' + e });
    }
});
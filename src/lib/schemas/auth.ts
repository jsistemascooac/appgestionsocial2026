import * as v from 'valibot';

// export const loginSchema = z.object({
//   email: z.string().email('Email no es válido'),
//   password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
// });

//export type LoginSchema = z.infer<typeof loginSchema>;

export const loginSchema = v.object({
  email: v.pipe(
    v.string('Your email must be a string.'),
    v.nonEmpty('Please enter your email.'),
    v.email('The email address is badly formatted.')
  ),
  identificacion: v.pipe(
    v.string('tu identificación debe ser un numero.'),
     v.nonEmpty('tu identificación debe ser un numero.'),
      
  ),
});


 export const loginAdminSchema = v.object({
 		identity: v.pipe(v.string(), v.nonEmpty()),
 		password:v.pipe(v.string(), v.nonEmpty())
 	})


  export const asociadoAPISchema =v.object({afiliacion: v.pipe(v.string()),
        nombres: v.pipe(v.string()),
        oficina: v.pipe(v.string()),
        estado: v.pipe(v.string()),
        mora_aporte: v.pipe(v.number()),
        moras_credito: v.pipe(v.string()),
        habilidad: v.pipe(v.string()),
        nhabilidad: v.pipe(v.number()),
        deuda_credito: v.pipe(v.number()),
        deuda_aporte: v.pipe(v.number()),
        email: v.pipe(v.string()),
        identificacion: v.pipe(v.number()),
    })

   
  //export type AsociadoAPISchema = z.infer<typeof asociadoAPISchema>;

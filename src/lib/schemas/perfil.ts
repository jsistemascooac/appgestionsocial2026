import * as v from 'valibot';

export const NavItemSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, "El título es obligatorio")),
  url: v.pipe(v.string(), v.startsWith('/', "La URL debe empezar con /")),
  // El icono es opcional por si la API no envía uno para ciertos items
  icon: v.optional(v.string()), 
  // Soporte para sub-menús (recursivo)
  items: v.optional(v.array(
    v.object({
      title: v.string(),
      url: v.string()
    })
  ))
});

// El esquema final es un array de estos objetos
export const NavMainSchema = v.array(NavItemSchema);

// Tipo de TypeScript extraído del esquema
export type NavMain = v.InferOutput<typeof NavMainSchema>;
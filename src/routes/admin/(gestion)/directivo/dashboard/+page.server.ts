import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
   if (!locals.user) throw redirect(302, '/admin/login');
 // if (locals.user.perifl !== '5r0y47q8j57l955') throw redirect(302, '/'); 
 // console.log("Dashboard Admin:",locals.user.perifl)
  return { user: locals.user };
};

/* Where lesson results are sent (Supabase, insert-only for students).
   The publishable (anon) key is meant to be public; students can only add rows, never read them. */
window.M3_CONFIG = {
  supabaseUrl: "https://rwvgunkkcrddijkxguej.supabase.co",
  supabaseKey: "sb_publishable_pKnRXFNGNDERrv_2Odcszg_bP6GB5-Q",
  table: "m3_results",
  teacherFn: "m3_results_for_teacher"
};

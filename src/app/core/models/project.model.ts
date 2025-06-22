export interface Project {
  id: string;         // UUID
  nombre: string;     // nombre del proyecto
  descripcion?: string;
  ubicacion?: string;
  fecha_inicio?: string;
  fecha_finalizacion?: string;
  estado: string;     // "Planificación", "En construcción", etc.
  codigo: string;     // código del proyecto
  created_at: string; // fecha de creación
  
  // Propiedades transformadas para compatibilidad interna
  name?: string;
  description?: string;
  status?: string;
  createdAt?: Date;
}

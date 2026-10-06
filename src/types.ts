/** Unidades de medida que entiende la app. */
export type UnitId =
  | 'ud' // piezas o unidades (huevos, dientes de ajo, hojas...)
  | 'g'
  | 'kg'
  | 'ml'
  | 'l'
  | 'cda' // cucharada
  | 'cdta' // cucharadita
  | 'vaso'
  | 'taza'
  | 'pizca'
  | 'gusto'; // al gusto, sin cantidad

export type CategoryId =
  | 'verduras'
  | 'frutas'
  | 'carnes'
  | 'embutidos'
  | 'pescados'
  | 'huevos'
  | 'legumbres'
  | 'especias'
  | 'liquidos'
  | 'despensa'
  | 'mias';

export interface Category {
  id: CategoryId;
  name: string;
  /** Clave de la ilustración (ver data/foodArt.ts). */
  art: string;
}

export interface Ingredient {
  id: string;
  name: string;
  category: CategoryId;
  /** Subgrupo dentro de la categoría: «Picadas», «Pescado azul»... */
  group?: string;
  art: string;
  /** La primera unidad es la que se propone por defecto. */
  units: UnitId[];
  /** Nombre de la pieza en singular y plural: ['diente', 'dientes']. */
  piece?: [string, string];
  /** Cantidades pequeñas (especias): los gramos van de 5 en 5. */
  fine?: boolean;
  custom?: boolean;
}

export interface RecipeItem {
  key: string;
  ingredientId: string;
  name: string;
  art?: string;
  /** Solo en recetas guardadas con versiones antiguas. */
  emoji?: string;
  qty: number;
  unit: UnitId;
  units: UnitId[];
  piece?: [string, string];
  fine?: boolean;
}

export interface Step {
  text: string;
  /** Minutos que dura este paso (opcional). */
  minutes?: number;
}

/** Sección del libro. Las de serie y las que cree ella. */
export type CourseId = string;

export interface Course {
  id: CourseId;
  name: string;
  custom?: boolean;
}

export interface Recipe {
  id: string;
  name: string;
  course?: CourseId;
  /** Tiempo total en minutos: la suma de los pasos. */
  minutes?: number;
  /** Trucos, variantes, de quién es la receta... */
  notes?: string;
  favorite?: boolean;
  servings: number;
  items: RecipeItem[];
  steps: Step[];
  photo?: string; // imagen comprimida en data URL
  createdAt: number;
  updatedAt: number;
}

export type RecipeDraft = Pick<Recipe, 'name' | 'course' | 'minutes' | 'notes' | 'servings' | 'items' | 'steps' | 'photo'>;

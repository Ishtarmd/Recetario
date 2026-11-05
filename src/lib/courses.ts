import { useSyncExternalStore } from 'react';
import type { Course } from '../types';
import { DEFAULT_COURSES } from '../data/courses';
import { slug } from '../data/ingredients';
import { getKV, setKV } from './db';

/** Secciones de serie + las que crea ella. Se guardan en el móvil. */
const KEY = 'customCourses';
let custom: Course[] = [];
let snapshot: Course[] = DEFAULT_COURSES;
const listeners = new Set<() => void>();

function emit() {
  snapshot = [...DEFAULT_COURSES, ...custom];
  listeners.forEach((l) => l());
}

export async function loadCourses() {
  custom = (await getKV<Course[]>(KEY)) ?? [];
  emit();
}

export function getCourses() {
  return snapshot;
}

export function useCourses() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => snapshot,
  );
}

export function courseName(id?: string) {
  return snapshot.find((c) => c.id === id)?.name ?? 'Sin sección';
}

export async function addCourse(name: string): Promise<Course> {
  const clean = name.trim().replace(/\s+/g, ' ');
  const pretty = clean.charAt(0).toUpperCase() + clean.slice(1);
  const existing = snapshot.find((c) => c.name.toLowerCase() === pretty.toLowerCase());
  if (existing) return existing;
  const course: Course = { id: `propia-${slug(pretty)}-${Date.now().toString(36)}`, name: pretty, custom: true };
  custom = [...custom, course];
  emit();
  await setKV(KEY, custom);
  return course;
}

export async function removeCourse(id: string) {
  custom = custom.filter((c) => c.id !== id);
  emit();
  await setKV(KEY, custom);
}

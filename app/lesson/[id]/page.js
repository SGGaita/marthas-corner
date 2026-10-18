import { notFound } from "next/navigation";
import { LESSONS, getLesson } from "@/lib/lessons";
import LessonScreen from "@/components/LessonScreen";

// Every lesson page is generated at build time, so the service worker can cache them all.
export const dynamicParams = false;
export function generateStaticParams() {
  return LESSONS.map((l) => ({ id: l.id }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const l = getLesson(id);
  return { title: l ? `${l.title} · Learning Corner` : "Learning Corner" };
}

export default async function Page({ params }) {
  const { id } = await params;
  if (!getLesson(id)) notFound();
  return <LessonScreen id={id} />;
}

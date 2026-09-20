import { getProfile, getTodos, requireUser } from "@/lib/dal";
import { getQuickAddData, getTodoLessonOptions } from "@/lib/queries";
import { TodoBoard, type TodoItem } from "@/components/todo-client";

export default async function TodoPage() {
  const user = await requireUser();
  const profile = await getProfile(user.id);
  const [rows, lessons, quickAdd] = await Promise.all([
    getTodos(user.id),
    getTodoLessonOptions(),
    getQuickAddData(user.id, profile?.weeklyHours ?? 22),
  ]);

  const todos: TodoItem[] = rows.map((todo) => ({
    id: todo.id,
    title: todo.title,
    notes: todo.notes,
    status: todo.status,
    priority: todo.priority,
    lane: todo.lane,
    estMinutes: todo.estMinutes,
    dueDate: todo.dueDate,
    dueTime: todo.dueTime,
    linkedType: todo.linkedType,
    linkedId: todo.linkedId,
  }));

  return (
    <main className="mx-auto w-full max-w-4xl px-5 py-8 sm:px-8 sm:py-10">
      <header className="border-b border-foreground pb-4">
        <p className="fig-label">TODO · PERSONAL SCHEDULE</p>
        <h1 className="mt-1 text-4xl text-primary sm:text-5xl">Your tasks</h1>
      </header>
      <TodoBoard initial={todos} lessons={lessons} quickAdd={quickAdd} />
    </main>
  );
}

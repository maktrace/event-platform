import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { getEvent, updateEvent } from "../api/events.api";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import type { Event } from "../types/api";

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadEvent = useCallback(async () => {
    if (!id) {
      setError("Не вказано ідентифікатор події.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getEvent(id);

      setEvent(data);
      setTitle(data.title);
      setDescription(data.description);
      setLocation(data.location);

      const eventDate = new Date(data.date);

      const localDate = new Date(
        eventDate.getTime() -
          eventDate.getTimezoneOffset() * 60 * 1000
      )
        .toISOString()
        .slice(0, 16);

      setDate(localDate);
    } catch {
      setError("Не вдалося завантажити подію.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadEvent();
  }, [loadEvent]);

  const handleSubmit = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();

    if (!id) {
      return;
    }

    setError("");

    if (
      !title.trim() ||
      !description.trim() ||
      !date ||
      !location.trim()
    ) {
      setError("Заповніть усі поля.");
      return;
    }

    if (title.trim().length < 3) {
      setError("Назва події має містити щонайменше 3 символи.");
      return;
    }

    if (description.trim().length < 10) {
      setError("Опис події має містити щонайменше 10 символів.");
      return;
    }

    const eventDate = new Date(date);

    if (eventDate <= new Date()) {
      setError("Дата події має бути в майбутньому.");
      return;
    }

    setSaving(true);

    try {
      await updateEvent(id, {
        title: title.trim(),
        description: description.trim(),
        date: eventDate.toISOString(),
        location: location.trim(),
      });

      navigate(`/events/${id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося оновити подію."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Loader text="Завантажуємо подію..." />;
  }

  if (error && !event) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <ErrorMessage
          message={error}
          onRetry={() => void loadEvent()}
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Редагувати подію
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Змініть інформацію про подію та збережіть оновлення.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Назва події
            </label>

            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={saving}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Опис
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              disabled={saving}
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="date"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Дата та час
              </label>

              <input
                id="date"
                type="datetime-local"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label
                htmlFor="location"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Місце проведення
              </label>

              <input
                id="location"
                type="text"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                disabled={saving}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate(`/events/${id}`)}
              disabled={saving}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Збереження..." : "Зберегти зміни"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default EditEventPage;
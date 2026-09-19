import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { createEvent } from "../api/events.api";

const CreateEventPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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

    setLoading(true);

    try {
      const createdEvent = await createEvent({
        title: title.trim(),
        description: description.trim(),
        date: eventDate.toISOString(),
        location: location.trim(),
      });

      navigate(`/events/${createdEvent._id}`);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Не вдалося створити подію."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Створити подію
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Заповніть інформацію про майбутній захід.
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
              placeholder="Наприклад: Конференція з веброзробки"
              disabled={loading}
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
              placeholder="Опишіть подію, її програму та особливості..."
              rows={6}
              disabled={loading}
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
                disabled={loading}
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
                placeholder="Наприклад: Київ, вул. Хрещатик, 1"
                disabled={loading}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Створення..." : "Створити подію"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CreateEventPage;
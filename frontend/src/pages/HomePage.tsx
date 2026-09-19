import { useCallback, useEffect, useState } from "react";
import { getEvents } from "../api/events.api";
import EventCard from "../components/events/EventCard";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import Loader from "../components/common/Loader";
import type { Event } from "../types/api";

const HomePage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getEvents();
      setEvents(data);
    } catch {
      setError("Не вдалося завантажити список подій.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  return (
    <main>
      <section className="bg-indigo-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-200">
              Event Platform
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Знаходьте події та беріть участь у них
            </h1>

            <p className="mt-5 text-lg leading-8 text-indigo-100">
              Переглядайте актуальні заходи, дізнавайтеся деталі
              та реєструйтеся на цікаві події.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Найближчі події
          </h2>

          <p className="mt-2 text-slate-500">
            Перелік запланованих заходів
          </p>
        </div>

        {loading && <Loader text="Завантажуємо події..." />}

        {!loading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => void loadEvents()}
          />
        )}

        {!loading && !error && events.length === 0 && (
          <EmptyState
            title="Подій поки немає"
            description="Наразі не опубліковано жодної майбутньої події."
          />
        )}

        {!loading && !error && events.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
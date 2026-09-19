import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { getMyRegistrations } from "../api/registrations.api";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import type { Registration, Event } from "../types/api";

const MyRegistrationsPage = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRegistrations = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyRegistrations();
      setRegistrations(data);
    } catch {
      setError("Не вдалося завантажити ваші реєстрації.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRegistrations();
  }, [loadRegistrations]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          Мої реєстрації
        </h1>

        <p className="mt-2 text-slate-500">
          Події, на які ви зареєструвалися
        </p>
      </div>

      {loading && (
        <Loader text="Завантажуємо ваші реєстрації..." />
      )}

      {!loading && error && (
        <ErrorMessage
          message={error}
          onRetry={() => void loadRegistrations()}
        />
      )}

      {!loading && !error && registrations.length === 0 && (
        <EmptyState
          title="Реєстрацій поки немає"
          description="Ви ще не зареєструвалися на жодну подію."
        />
      )}

      {!loading && !error && registrations.length > 0 && (
        <div className="grid gap-5">
          {registrations.map((registration) => {
            const event =
              typeof registration.eventId === "string"
                ? null
                : (registration.eventId as Event);

            if (!event) {
              return null;
            }

            const eventDate = new Date(event.date);

            const formattedDate = eventDate.toLocaleDateString(
              "uk-UA",
              {
                day: "2-digit",
                month: "long",
                year: "numeric",
              }
            );

            const formattedTime = eventDate.toLocaleTimeString(
              "uk-UA",
              {
                hour: "2-digit",
                minute: "2-digit",
              }
            );

            return (
              <article
                key={registration._id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {event.title}
                    </h2>

                    <div className="mt-3 space-y-1 text-sm text-slate-500">
                      <p>
                        <span className="font-medium text-slate-700">
                          Дата:
                        </span>{" "}
                        {formattedDate}
                      </p>

                      <p>
                        <span className="font-medium text-slate-700">
                          Час:
                        </span>{" "}
                        {formattedTime}
                      </p>

                      <p>
                        <span className="font-medium text-slate-700">
                          Місце:
                        </span>{" "}
                        {event.location}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/events/${event._id}`}
                    className="inline-flex justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
                  >
                    Переглянути подію
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default MyRegistrationsPage;
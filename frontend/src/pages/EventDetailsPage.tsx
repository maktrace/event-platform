import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  deleteEvent,
  getEvent,
} from "../api/events.api";
import {
  getMyRegistrations,
  registerForEvent,
} from "../api/registrations.api";
import {
  createReview,
  getEventReviews,
} from "../api/reviews.api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/common/Loader";
import ErrorMessage from "../components/common/ErrorMessage";
import EmptyState from "../components/common/EmptyState";
import type { Event, Registration, Review } from "../types/api";

const EventDetailsPage = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isRegistered, setIsRegistered] = useState(false);

  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);

  const [error, setError] = useState("");
  const [reviewsError, setReviewsError] = useState("");
  const [registrationError, setRegistrationError] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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
    } catch {
      setError("Не вдалося завантажити інформацію про подію.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadReviews = useCallback(async () => {
    if (!id) {
      return;
    }

    setReviewsLoading(true);
    setReviewsError("");

    try {
      const data = await getEventReviews(id);
      setReviews(data);
    } catch {
      setReviewsError("Не вдалося завантажити відгуки.");
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  const loadRegistrationStatus = useCallback(async () => {
    if (!isAuthenticated || !id) {
      setIsRegistered(false);
      return;
    }

    try {
      const registrations = await getMyRegistrations();

      const registered = registrations.some((registration: Registration) => {
        const eventId =
          typeof registration.eventId === "string"
            ? registration.eventId
            : registration.eventId._id;

        return eventId === id && registration.status === "registered";
      });

      setIsRegistered(registered);
    } catch {
      setIsRegistered(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    void loadEvent();
    void loadReviews();
  }, [loadEvent, loadReviews]);

  useEffect(() => {
    void loadRegistrationStatus();
  }, [loadRegistrationStatus]);

  const handleRegistration = async () => {
  if (!id) {
    return;
  }

  setRegistrationLoading(true);
  setRegistrationError("");

  try {
    await registerForEvent(id);
    setIsRegistered(true);
  } catch (error) {
    setRegistrationError(
      error instanceof Error
        ? error.message
        : "Не вдалося зареєструватися на подію."
    );
  } finally {
    setRegistrationLoading(false);
  }
};
const handleDelete = async () => {
  if (!id) {
    return;
  }

  const confirmed = window.confirm(
    "Ви впевнені, що хочете видалити цю подію?"
  );

  if (!confirmed) {
    return;
  }

  try {
    await deleteEvent(id);
    navigate("/");
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Не вдалося видалити подію."
    );
  }
};
  const handleReviewSubmit = async (
    formEvent: FormEvent<HTMLFormElement>
  ) => {
    formEvent.preventDefault();

    if (!id) {
      return;
    }

    setReviewError("");
    setReviewSuccess("");

    if (!comment.trim()) {
      setReviewError("Введіть текст відгуку.");
      return;
    }

    setReviewLoading(true);

    try {
      await createReview(id, {
        rating,
        comment: comment.trim(),
      });

      setComment("");
      setRating(5);
      setReviewSuccess("Відгук успішно додано.");

      await loadReviews();
    } catch (error) {
      setReviewError(
        error instanceof Error
          ? error.message
          : "Не вдалося додати відгук."
      );
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) {
    return <Loader text="Завантажуємо подію..." />;
  }

  if (error || !event) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <ErrorMessage
          message={error || "Подію не знайдено."}
          onRetry={() => void loadEvent()}
        />
      </main>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate <= new Date();

  const formattedDate = eventDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const organizerName =
    typeof event.organizerId === "string"
      ? "Організатор"
      : event.organizerId.name;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
      >
        ← Повернутися до подій
      </Link>

      <article className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700">
              {formattedDate}
            </span>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              {event.title}
            </h1>

            <p className="mt-3 text-sm text-slate-500">
              Організатор:{" "}
              <span className="font-medium text-slate-700">
                {organizerName}
              </span>
            </p>
          </div>

          <div className="grid gap-4 rounded-xl bg-slate-50 p-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Дата і час
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {formattedDate}, {formattedTime}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Місце
              </p>
              <p className="mt-1 font-medium text-slate-800">
                {event.location}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Про подію
            </h2>

            <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
              {event.description}
            </p>
            {isAuthenticated &&
  user?.role === "organizer" &&
  typeof event.organizerId !== "string" &&
  event.organizerId._id === user.id && (
    <div className="mt-5 flex flex-wrap gap-3">
  <button
    type="button"
    onClick={() => navigate(`/events/${event._id}/edit`)}
    className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700"
  >
    Редагувати подію
  </button>

  <button
    type="button"
    onClick={() => void handleDelete()}
    className="rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700"
  >
    Видалити подію
  </button>
</div>
  )}
          </div>

          {isAuthenticated && !isPastEvent && (
            <div>
              {isRegistered ? (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">
                  Ви успішно зареєструвались на подію.
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRegistration}
                    disabled={registrationLoading}
                    className="w-full rounded-lg bg-indigo-600 px-5 py-3 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                  >
                    {registrationLoading
                      ? "Реєстрація..."
                      : "Зареєструватися на подію"}
                  </button>

                  {registrationError && (
                    <p className="mt-3 text-sm text-red-600">
                      {registrationError}
                    </p>
                  )}
                </>
              )}
            </div>
          )}

          {!isAuthenticated && !isPastEvent && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Щоб зареєструватися на подію,{" "}
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-700"
              >
                увійдіть
              </Link>{" "}
              до облікового запису.
            </div>
          )}
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Відгуки
        </h2>

        <div className="mt-5">
          {reviewsLoading && <Loader text="Завантажуємо відгуки..." />}

          {!reviewsLoading && reviewsError && (
            <ErrorMessage
              message={reviewsError}
              onRetry={() => void loadReviews()}
            />
          )}

          {!reviewsLoading &&
            !reviewsError &&
            reviews.length === 0 && (
              <EmptyState
                title="Відгуків поки немає"
                description="Будьте першим, хто залишить відгук після відвідування події."
              />
            )}

          {!reviewsLoading &&
            !reviewsError &&
            reviews.length > 0 && (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const author =
                    typeof review.userId === "string"
                      ? "Користувач"
                      : review.userId.name;

                  return (
                    <article
                      key={review._id}
                      className="rounded-xl border border-slate-200 bg-white p-5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-medium text-slate-900">
                          {author}
                        </p>

                        <p className="text-sm text-amber-500">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </p>
                      </div>

                      <p className="mt-3 leading-6 text-slate-600">
                        {review.comment}
                      </p>
                    </article>
                  );
                })}
              </div>
            )}
        </div>
      </section>

      {isAuthenticated && isRegistered && isPastEvent && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-semibold text-slate-900">
            Залишити відгук
          </h2>

          <form
            onSubmit={handleReviewSubmit}
            className="mt-5 space-y-5"
          >
            <div>
              <label
                htmlFor="rating"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Оцінка
              </label>

              <select
                id="rating"
                value={rating}
                onChange={(event) =>
                  setRating(Number(event.target.value))
                }
                disabled={reviewLoading}
                className="rounded-lg border border-slate-300 px-4 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              >
                <option value={5}>5 — Відмінно</option>
                <option value={4}>4 — Добре</option>
                <option value={3}>3 — Задовільно</option>
                <option value={2}>2 — Погано</option>
                <option value={1}>1 — Дуже погано</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="comment"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Відгук
              </label>

              <textarea
                id="comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Поділіться своїми враженнями..."
                rows={5}
                disabled={reviewLoading}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
              />
            </div>

            {reviewError && (
              <p className="text-sm text-red-600">{reviewError}</p>
            )}

            {reviewSuccess && (
              <p className="text-sm text-green-600">
                {reviewSuccess}
              </p>
            )}

            <button
              type="submit"
              disabled={reviewLoading}
              className="rounded-lg bg-indigo-600 px-5 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviewLoading
                ? "Надсилання..."
                : "Залишити відгук"}
            </button>
          </form>
        </section>
      )}
    </main>
  );
  };
export default EventDetailsPage;
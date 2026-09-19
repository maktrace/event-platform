import { Link } from "react-router";
import type { Event } from "../../types/api";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  const eventDate = new Date(event.date);

  const formattedDate = eventDate.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const description =
    event.description.length > 140
      ? `${event.description.slice(0, 140)}...`
      : event.description;

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4">
        <span className="inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
          {formattedDate}
        </span>
      </div>

      <h2 className="text-xl font-semibold text-slate-900">
        {event.title}
      </h2>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
        {description}
      </p>

      <div className="mt-5 space-y-2 text-sm text-slate-500">
        <p>
          <span className="font-medium text-slate-700">Час:</span>{" "}
          {formattedTime}
        </p>

        <p>
          <span className="font-medium text-slate-700">Місце:</span>{" "}
          {event.location}
        </p>
      </div>

      <Link
        to={`/events/${event._id}`}
        className="mt-5 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
      >
        Детальніше
      </Link>
    </article>
  );
};

export default EventCard;
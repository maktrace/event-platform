import { Link, useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const Header = () => {
  const { user, isAuthenticated, isOrganizer, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="shrink-0 text-xl font-bold tracking-tight text-indigo-600"
        >
          EventPlatform
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
          >
            Події
          </Link>

          {isAuthenticated && (
            <Link
              to="/my-registrations"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Мої реєстрації
            </Link>
          )}

          {isOrganizer && (
            <Link
              to="/create-event"
              className="text-sm font-medium text-slate-600 transition hover:text-indigo-600"
            >
              Створити подію
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <span className="hidden text-sm text-slate-600 sm:block">
                {user?.name}
              </span>

              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                Вийти
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Увійти
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Реєстрація
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
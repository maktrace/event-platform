interface LoaderProps {
  text?: string;
}

const Loader = ({ text = "Завантаження..." }: LoaderProps) => {
  return (
    <div className="flex min-h-40 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
};

export default Loader;
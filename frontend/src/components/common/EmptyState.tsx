interface EmptyStateProps {
  title: string;
  description?: string;
}

const EmptyState = ({
  title,
  description,
}: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-900">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
};

export default EmptyState;
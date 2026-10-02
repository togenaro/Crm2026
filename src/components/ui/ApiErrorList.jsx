export default function ApiErrorList({ errors = [] }) {
  if (errors.length === 0) return null;

  return (
    <div className="error-banner">
      <ul>
        {errors.map((message, index) => (
          <li key={`${index}-${message}`}>{message}</li>
        ))}
      </ul>
    </div>
  );
}

function pageWindow(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total];
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total];
  return [1, '…', current - 1, current, current + 1, '…', total];
}

export default function Pagination({ page, totalPages, totalItems, pageSize, onPageChange }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="pagination-bar">
      <span className="pagination-info">
        Mostrando {start}–{end} de {totalItems}
      </span>
      <div className="pagination-controls">
        <button
          type="button"
          className="page-btn"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(page - 1, 1))}
        >
          ‹ Anterior
        </button>
        {pageWindow(page, totalPages).map((number, index) =>
          number === '…' ? (
            <span key={`gap-${index}`} className="pagination-ellipsis">…</span>
          ) : (
            <button
              key={number}
              type="button"
              className={`page-btn${number === page ? ' active' : ''}`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          )
        )}
        <button
          type="button"
          className="page-btn"
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        >
          Siguiente ›
        </button>
      </div>
    </div>
  );
}

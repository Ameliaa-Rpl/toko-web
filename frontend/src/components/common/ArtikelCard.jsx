import { Link } from 'react-router-dom';
import { mediaUrl, formatTanggal } from '../../utils';

export default function ArtikelCard({ artikel }) {
  return (
    <Link to={`/artikel/${artikel.id}`} className="text-decoration-none">
      <div className="card h-100 shadow-sm border-1 overflow-hidden">
        <img src={mediaUrl(artikel.gambar, 'artikel')} className="card-img-top" alt={artikel.judul} style={{ height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="card-body">
          <h6 className="card-title fw-bold">{artikel.judul}</h6>
          <p className="card-text text-muted small">{formatTanggal(artikel.created_at, 'date')}</p>
          <p className="card-text text-muted">{artikel.ringkasan}</p>
          <p className='fw-semibold text-decoration-underline'>Baca Selengkapnya</p>
        </div>
      </div>
    </Link>
  );
}
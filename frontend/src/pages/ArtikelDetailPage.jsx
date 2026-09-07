import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';
import { mediaUrl } from '../utils';
import { PLACEHOLDER_IMAGE } from '../utils';

function ArtikelDetailPage() {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);

  useEffect(() => {
    api.getArtikelById(id)
      .then((res) => setArtikel(res.data))
      .catch(() => {});
  }, [id]);

  if (!artikel) {
    return (
      <div className="container py-5 text-muted">Memuat artikel...</div>
    );
  }

  return (
    <article className="container py-4">
      <Link to="/artikel" className="text-decoration-none" style={{ color: '#333333' }}>← Kembali ke artikel</Link>
      <h1 className="fw-bold mt-3 mb-2" style={{ fontFamily: 'georgia' }}>{artikel.judul}</h1>
      <p className="text-muted">
        {new Date(artikel.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric',})}
      </p>
      <img
        src={mediaUrl(artikel.gambar, 'artikel')}
        alt={artikel.judul}
        className="img-fluid rounded-4 my-3"
        style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
        onError={(e) => {
          e.currentTarget.src = PLACEHOLDER_IMAGE;
        }}
      />
      <p className="lead text-muted mb-4">{artikel.ringkasan}</p>
      <div className="article-body" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{artikel.isi}</div>
    </article>
  );
}

export default ArtikelDetailPage;
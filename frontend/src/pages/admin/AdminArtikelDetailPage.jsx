import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatTanggal, mediaUrl } from '../../utils';

function AdminArtikelDetailPage() {
  const { id } = useParams();
  const [artikel, setArtikel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await adminApi.getArtikelById(id);
        setArtikel(res.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail artikel');
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!artikel) {
    return <div className="alert alert-warning">Artikel tidak ditemukan</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Detail Artikel</p>
            <p className="text-muted">Informasi lengkap artikel</p>
          </div>
          <Link to="/admin/artikel" className="btn btn-outline-secondary">← Kembali</Link>
        </div>

        <div className="col-md-12 mx-auto">
          <div className="card border-0 shadow-sm p-4">
            <div className="row">
              <div className="col-md-4">
                <img src={mediaUrl(artikel.gambar, 'artikel')} className="img-fluid rounded-4" style={{ width: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
              </div>
              <div className="col-md-8">
                <p className="fw-bold fs-2">{artikel.judul}</p>
                <p className="text-muted mb-2">
                  <span className="badge" style={{ backgroundColor: '#e8e4e4', color: '#4A4A4A' }}>
                    {formatTanggal(artikel.created_at, 'full')}
                  </span>
                </p>
                <hr />
                <h6 className="fw-bold">Ringkasan</h6>
                <p>{artikel.ringkasan}</p>
                <hr />
                <h6 className="fw-bold">Isi Artikel</h6>
                <p style={{ whiteSpace: 'pre-wrap' }}>{artikel.isi}</p>
                <hr />
                <div className="d-flex gap-2">
                  <Link to={`/admin/artikel/edit/${artikel.id}`} className="btn btn-primary">Edit Artikel</Link>
                  <Link to="/admin/artikel" className="btn btn-outline-secondary">Kembali</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminArtikelDetailPage;
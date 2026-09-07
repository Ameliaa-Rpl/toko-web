import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatTanggal, mediaUrl } from '../../utils';

function AdminArtikelPage() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch artikel dari API
  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await adminApi.getArtikel();
        setArtikel(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, []);

  // Handle delete artikel
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus artikel ini?')) return;
    try {
      await adminApi.deleteArtikel(id);
      setArtikel(artikel.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Gagal menghapus artikel');
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center">
          <div>
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Kelola Artikel</p>
            <p className="text-muted">Artikel & blog</p>
          </div>
          <Link to="/admin/artikel/tambah" className="btn text-white" style={{ backgroundColor: '#333333' }}>+ Tambah Artikel</Link>
        </div>

        <div className="col-12 mt-3">
          {loading && (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col" className="text-muted fw-semibold ps-3">GAMBAR</th>
                    <th scope="col" className="text-muted fw-semibold">JUDUL</th>
                    <th scope="col" className="text-muted fw-semibold">TANGGAL</th>
                    <th scope="col" className="text-muted fw-semibold text-center">TINDAKAN</th>
                  </tr>
                </thead>
                <tbody>
                  {artikel.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">Belum ada artikel. Tambahkan artikel baru.</td>
                    </tr>
                  ) : (
                    artikel.map((item) => (
                      <tr key={item.id}>
                        <td className="ps-3">
                          <img src={mediaUrl(item.gambar, 'artikel')}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px',}}
                          />
                        </td>
                        <td>
                          <div className="fw-medium">{item.judul}</div>
                          <div className="text-muted small">{item.ringkasan}</div>
                        </td>
                        <td>{formatTanggal(item.created_at, 'date')}</td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <Link to={`/admin/artikel/detail/${item.id}`} className="btn btn-sm btn-outline-info">Detail</Link>
                            <Link to={`/admin/artikel/edit/${item.id}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                            <button onClick={() => handleDelete(item.id)} className="btn btn-sm btn-outline-danger">Hapus</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminArtikelPage;
import { useState, useEffect } from 'react';
import { api } from '../api';
import ArtikelCard from '../components/common/ArtikelCard';

function ArtikelListPage() {
  const [artikel, setArtikel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch artikel dari API
  useEffect(() => {
    const fetchArtikel = async () => {
      try {
        const res = await api.getArtikel();
        setArtikel(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat artikel');
      } finally {
        setLoading(false);
      }
    };
    fetchArtikel();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row px-5 pt-5 pb-3">
          <div className="col-12">
            <p className="fw-bolder fs-2 mb-0 font-serif">Artikel</p>
            <p>Temukan inspirasi dan informasi seputar dunia rajut</p>
          </div>
        </div>
      </div>

      <div className="container-fluid px-5">
        {!loading && !error && (
          <p className="text-muted small pb-3 mb-0">
            {artikel.length} artikel ditemukan
          </p>
        )}
      </div>

      <div className="container-fluid px-5 pb-5">
        {loading && (
          <div className="text-center py-5">
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
          <>
            {artikel.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="fs-5">Belum ada artikel</p>
              </div>
            ) : (
              <div className="row">
                {artikel.map((item) => (
                  <div className="col-12 col-md-4 mb-4" key={item.id}>
                    <ArtikelCard artikel={item} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default ArtikelListPage;
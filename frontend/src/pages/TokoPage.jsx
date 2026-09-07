import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import { kategoriDariProduk } from '../utils';
import ProductCard from '../components/common/ProductCard';

function TokoPage() {
  const [searchParams] = useSearchParams();
  const kategoriUrl = searchParams.get('kategori');
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('Semua');

  // Fetch produk dari API
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await api.getProduk();
        setProduk(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  useEffect(() => {
    if (kategoriUrl) {
      setSelectedKategori(kategoriUrl);
    } else {
      setSelectedKategori('Semua');
    }
  }, [kategoriUrl]);

  // Ambil daftar kategori unik dari produk
  const kategoriList = useMemo(() => {
    const list = kategoriDariProduk(produk);
    return ['Semua', ...list];
  }, [produk]);

  // Filter produk berdasarkan kategori
  const produkFiltered = useMemo(() => {
    if (selectedKategori === 'Semua') return produk;
    return produk.filter((p) => p.kategori === selectedKategori);
  }, [produk, selectedKategori]);

  return (
    <>
      <div className="container-fluid">
        <div className="row px-5 pt-5 pb-3">
          <div className="col-12">
            <p className="fw-bolder fs-2 mb-0 font-serif">Koleksi Rajut</p>
            <p>Temukan berbagai produk rajut handmade pilihan kami</p>
          </div>
        </div>
      </div>

      <div className="container-fluid px-5">
        <div className="d-flex flex-wrap gap-2 pb-2">
          {kategoriList.map((kategori) => (
            <button key={kategori} onClick={() => setSelectedKategori(kategori)} className="btn px-4 py-1 fw-semibold"
              style={{ backgroundColor: selectedKategori === kategori ? '#333333' : '#FFFFFF', color: selectedKategori === kategori ? '#FFFFFF' : '#4A4A4A', border: selectedKategori === kategori ? 'none' : '1px solid #D4C5B2', transition: 'all 0.2s'}}>
              {kategori}
            </button>
          ))}
        </div>

        {!loading && !error && (
          <p className="text-muted small pb-3 mb-0">
            {produkFiltered.length} produk ditemukan
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
            {produkFiltered.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <p className="fs-5">Belum ada produk di kategori ini</p>
              </div>
            ) : (
              <div className="row">
                {produkFiltered.map((item) => (
                  <div className="col-12 col-md-3 mb-4" key={item.id_produk}>
                    <ProductCard produk={item} />
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

export default TokoPage;
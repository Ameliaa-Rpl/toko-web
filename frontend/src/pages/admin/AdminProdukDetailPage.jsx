import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatRupiah, mediaUrl } from '../../utils';

function AdminProdukDetailPage() {
  const { id } = useParams();
  const [produk, setProduk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await adminApi.getProdukById(id);
        setProduk(res.data);
      } catch (err) {
        setError(err.message || 'Gagal memuat detail produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
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

  if (!produk) {
    return <div className="alert alert-warning">Produk tidak ditemukan</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Detail Produk</p>
            <p className="text-muted">Informasi lengkap produk</p>
          </div>
          <Link to="/admin/produk" className="btn btn-outline-secondary">← Kembali</Link>
        </div>

        <div className="col-4">
          <img
            src={mediaUrl(produk.gambar, 'produk')}
            className="img-fluid rounded-4"
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        <div className="col-8">
          <h2 className="fw-bold">{produk.nama_produk}</h2>
          <p className="text-muted mb-2">
            <span className="badge" style={{ backgroundColor: '#E8C9B8', color: '#4A4A4A' }}>{produk.kategori}</span>
          </p>
          <h4 className="fw-bold" style={{ color: '#8B4513' }}>{formatRupiah(produk.harga)}</h4>
          <hr />
          <h6 className="fw-bold">Deskripsi</h6>
          <p style={{ whiteSpace: 'pre-wrap' }}>{produk.deskripsi}</p>
          <hr />
          <div className="d-flex gap-2">
            <Link to={`/admin/produk/edit/${produk.id_produk}`} className="btn text-white" style={{backgroundColor: "#333333"}}> Edit Produk</Link>
            <Link to="/admin/produk" className="btn btn-outline-secondary">Kembali ke Daftar</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProdukDetailPage;
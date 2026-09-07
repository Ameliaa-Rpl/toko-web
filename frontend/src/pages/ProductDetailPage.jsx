import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { formatRupiah, mediaUrl } from '../utils';
import { PLACEHOLDER_IMAGE } from '../utils';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [produk, setProduk] = useState(null);

  useEffect(() => {
    api.getProdukById(id)
      .then((res) => setProduk(res.data))
      .catch(() => {});
  }, [id]);

  const handleBeliSekarang = () => {
    const token = localStorage.getItem('toko_token');

    if (!token) {
      // Jika belum login, lempar ke halaman login
      alert('Silakan masuk terlebih dahulu untuk melakukan pembelian.');
      navigate('/login');
    } else {
      // Jika sudah login, arahkan ke halaman PembeliBelanja.jsx
      navigate('/akun/belanja'); 
    }
  };

  if (!produk) {
    return (
      <div className="container py-5 text-muted">Memuat produk...</div>
    );
  }

  return (
    <div className="container py-4">
      <div className='row'>
        <div className='col-12 my-4'>
          <Link to="/toko" className="text-decoration-none" style={{ color: '#333333' }}>← Kembali ke katalog</Link>
        </div>

        <div className="col-md-5 col-lg-4">
          <img
            src={mediaUrl(produk.gambar, 'produk')}
            className="img-fluid rounded-4"
            style={{ width: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = PLACEHOLDER_IMAGE;
            }}
          />
        </div>

        <div className="col-md-7 col-lg-8">
          <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: "georgia" }}>{produk.nama_produk}</p>
          <p className="text-muted mb-2">
            <span className="badge" style={{ backgroundColor: '#e8e4e4', color: '#333333' }}>{produk.kategori}</span>
          </p>
          <p className="fw-bold fs-4" style={{ color: '#333333' }}>{formatRupiah(produk.harga)}</p>
          <hr />
          <p style={{ whiteSpace: 'pre-wrap' }}>{produk.deskripsi}</p>
          <hr />
          <div className="d-flex gap-3 mt-3">
            <button onClick={handleBeliSekarang} className="btn text-white px-4 py-2 border-0" style={{ backgroundColor: '#333333' }}>Beli sekarang</button>
            <Link to="/toko" className="btn btn-outline-secondary px-4 py-2">Lihat produk lain</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
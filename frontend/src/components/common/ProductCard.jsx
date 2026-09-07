import { Link, useNavigate } from 'react-router-dom';
import { formatRupiah, mediaUrl } from '../../utils';

export default function ProductCard({ produk }) {
  const navigate = useNavigate();

  const handleBeliSekarang = () => {
    const token = localStorage.getItem('toko_token');

    if (!token) {
      alert('Silakan masuk terlebih dahulu untuk melakukan pembelian.');
      navigate('/login');
    } else {
      navigate(`/akun/belanja?produk=${produk.id_produk}`); 
    }
  };

  return (
    <div className="card h-100 shadow-sm border-1 overflow-hidden">
      <div style={{ height: '200px', overflow: 'hidden' }}>
        <img 
          src={mediaUrl(produk.gambar, 'produk')} className="w-100 h-100" style={{ objectFit: 'cover' }} 
          onError={(e) => {
            e.target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      <div className="card-body">
        <p className="card-title fs-6 fw-bold mb-0">{produk.nama_produk}</p>
        <p className="card-text text-muted small">{produk.kategori}</p>
        <p className="card-text fw-bold mb-4" style={{ color: '#333333' }}>{formatRupiah(produk.harga)}</p>
        <div className='row g-2'>
          <div className='col-6'>
            <button onClick={handleBeliSekarang} className="btn text-white fw-semibold py-2 border-0 w-100" style={{ backgroundColor: '#333333' }}>Beli</button>
          </div>
          <div className='col-6'>
            <Link to={`/produk/${produk.id_produk}`} className="btn text-white fw-semibold text-decoration-none w-100 py-2 rounded-3 d-block" style={{ padding: "10px 0", backgroundColor: "#333333" }}>Detail</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatRupiah, mediaUrl } from '../../utils';

function AdminProdukPage() {
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch produk dari API
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await adminApi.getProduk();
        setProduk(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  // Handle delete produk
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus produk ini?')) return;
    try {
      await adminApi.deleteProduk(id);
      setProduk(produk.filter((item) => item.id_produk !== id));
    } catch (err) {
      alert(err.message || 'Gagal menghapus produk');
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Daftar Produk</p>
              <p>{produk.length} produk</p>
            </div>
            <Link to="/admin/produk/tambah" className="btn text-white" style={{ backgroundColor: '#333333' }}>+ Tambah Produk</Link>
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
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-semibold ps-3">GAMBAR</th>
                      <th scope="col" className="text-muted fw-semibold">NAMA</th>
                      <th scope="col" className="text-muted fw-semibold">KATEGORI</th>
                      <th scope="col" className="text-muted fw-semibold">HARGA</th>
                      <th scope="col" className="text-muted fw-semibold text-center">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produk.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          Belum ada produk. Tambahkan produk baru.
                        </td>
                      </tr>
                    ) : (
                      produk.map((item) => (
                        <tr key={item.id_produk}>
                          <td className="ps-3">
                            <img
                              src={mediaUrl(item.gambar, 'produk')}
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                              style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px',}}
                              alt={item.nama_produk}
                            />
                          </td>
                          <td className="fw-medium">{item.nama_produk}</td>
                          <td>
                            <span className="badge" style={{ backgroundColor: '#e8e4e4', color: '#4A4A4A' }}>{item.kategori}</span>
                          </td>
                          <td className="fw-bold" style={{ color: '#8B4513' }}>{formatRupiah(item.harga)}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <Link to={`/admin/produk/detail/${item.id_produk}`} className="btn btn-sm btn-outline-info">Detail</Link>
                              <Link to={`/admin/produk/edit/${item.id_produk}`} className="btn btn-sm btn-outline-primary">Edit</Link>
                              <button onClick={() => handleDelete(item.id_produk)} className="btn btn-sm btn-outline-danger">Hapus</button>
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
    </>
  );
}

export default AdminProdukPage;
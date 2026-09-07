import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pembeliApi } from '../../api';
import { formatRupiah, formatTanggal } from '../../utils';

function PembeliOverviewPage() {
  const [stats, setStats] = useState({
    total_pesanan: 0,
    selesai: 0,
    diterima: 0,
    dikirim: 0,
    dikemas: 0,
    tertunda: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await pembeliApi.getDashboard();
        const data = res.data;
        setStats(data.stats || {});
        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Hitung pesanan aktif (status selain Selesai)
  const pesananAktif = recentOrders.filter(
    (order) => order.status !== 'Selesai'
  ).length;

  // Hitung belum bayar
  const belumBayar = recentOrders.filter(
    (order) => order.pembayaran === 'Belum'
  ).length;

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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <p className="fw-bolder fs-2 mb-0" style={{fontFamily: 'georgia'}}>Dashboard</p>
          <p className="text-muted mb-4">Ringkasan aktivitas belanja Anda</p>
        </div>

        <div className="col-12">
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <p className="text-muted mb-1">TOTAL PESANAN</p>
                <p className="fw-bold fs-3 mb-0">{stats.total_pesanan || 0}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <p className="text-muted mb-1">PESANAN AKTIF</p>
                <p className="fw-bold fs-3 mb-0">{pesananAktif}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <p className="text-muted mb-1">BELUM DIBAYAR</p>
                <p className="fw-bold fs-3 mb-0">{belumBayar}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4 mb-4">
            <p className="fw-bold fs-5 mb-1">Total belanja (sudah dibayar)</p>
            <p className="text-muted">Akumulasi harga produk pada pesanan berstatus pembayaran "Dibayar"</p>
            <p className="fw-bold fs-2 text-success">
              {formatRupiah(
                recentOrders
                  .filter((order) => order.pembayaran === 'Dibayar')
                  .reduce((total, order) => total + (order.produk_harga || 0), 0)
              )}
            </p>
          </div>
        </div>

        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-4 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <p className="fw-bold fs-5 mb-0">Pesanan terbaru</p>
              <Link to="/akun/pesanan" className="text-decoration-none fw-semibold" style={{ color: '#333333' }}>Lihat semua →</Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-muted">Belum ada pesanan.</p>
                <Link to="/toko" className="btn text-white px-4" style={{ backgroundColor: '#333333' }}>Mulai belanja</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th className="text-muted fw-semibold">ID</th>
                      <th className="text-muted fw-semibold">Produk</th>
                      <th className="text-muted fw-semibold">Total</th>
                      <th className="text-muted fw-semibold">Status</th>
                      <th className="text-muted fw-semibold">Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.slice(0, 5).map((order) => (
                      <tr key={order.id}>
                        <td className="fw-medium">#{order.id}</td>
                        <td>{order.nama_produk || '-'}</td>
                        <td className="fw-bold" style={{ color: '#8B4513' }}>{formatRupiah(order.produk_harga || 0)}</td>
                        <td>
                          <span
                            className="badge"
                            style={{
                              backgroundColor:
                                order.status === 'Selesai' ? '#2E7D32' :
                                order.status === 'Diterima' ? '#1976D2' :
                                order.status === 'Dikirim' ? '#F57C00' :
                                order.status === 'Dikemas' ? '#9C27B0' :
                                '#C62828',
                              color: '#FFFFFF',
                            }}
                          >
                            {order.status || 'Tertunda'}
                          </span>
                        </td>
                        <td>{formatTanggal(order.created_at, 'date')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="col-12 mt-4">
          <div className="row">
            <div className="col-md-4">
              <Link to="/akun/belanja" className="btn w-100 py-3 text-white fw-semibold rounded-4" style={{ backgroundColor: '#333333' }}>Belanja produk</Link>
            </div>
            <div className="col-md-4">
              <Link to="/akun/pesanan" className="btn w-100 py-3 btn-outline-secondary fw-semibold rounded-4">Riwayat pesanan</Link>
            </div>
            <div className="col-md-4">
              <Link to="/akun/profil" className="btn w-100 py-3 btn-outline-secondary fw-semibold rounded-4">Edit profil</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PembeliOverviewPage;
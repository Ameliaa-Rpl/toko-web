import { useEffect, useState } from 'react';
import { adminApi } from '../../api';
import { formatRupiah, formatTanggal } from '../../utils';
import { Link } from 'react-router-dom';

function AdminOverviewPage() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        const data = res.data;
        setStats(data);
        setRecentOrders(data.recentOrders || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat statistik');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Data statistik untuk card
  const statCards = [
    { label: 'PEMBELI TERDAFTAR', value: stats?.total_pembeli || 0, icon: '👤', color: '#8B4513' },
    { label: 'TOTAL TRANSAKSI', value: stats?.total_pesanan || 0, icon: '📋', color: '#2E7D32' },
    { label: 'PRODUK DI KATALOG', value: stats?.total_produk || 0, icon: '📦', color: '#1976D2' },
    { label: 'PRODUK TERJUAL', value: stats?.total_terjual || 0, icon: '📈', color: '#F57C00' },
    { label: 'ARTIKEL', value: stats?.total_artikel || 0, icon: '📰', color: '#6A1B9A' },
    { label: 'PESANAN DIKEMAS', value: stats?.dikemas || 0, icon: '📦', color: '#9C27B0' },
    { label: 'PESANAN DIKIRIM', value: stats?.dikirim || 0, icon: '🚚', color: '#0288D1' },
    { label: 'BELUM DIBAYAR', value: stats?.belum_bayar || 0, icon: '⏳', color: '#C62828' },
  ];

  return (
    <>
      <div className='container-fluid'>
        <div className="row g-3 mb-4">
          {statCards.map((item) => (
            <div className="col-3" key={item.label}>
              <div className="card border-0 shadow-sm rounded-4 p-3">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">{item.label}</p>
                    <p className="fw-bold mb-0 fs-3">{item.value}</p>
                  </div>
                  <span className='fs-2'>{item.icon}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='container-fluid'>
        <div className="row">
          <div className='col-12 shadow-sm rounded-4 p-4 mb-4 bg-white'>
            <p className="fw-bold fs-4">Pendapatan (dibayar)</p>
            <p className="text-muted">Total dari pesanan dengan status pembayaran "Dibayar"</p>
            <h2 className="fw-bold" style={{ color: '#2E7D32' }}>{formatRupiah(stats?.total_pendapatan || 0)}</h2>
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row'>
          <div className="col-12 bg-white shadow-sm rounded-4 p-4">
            <h5 className="fw-bold mb-3">Transaksi terbaru</h5>
            {recentOrders.length === 0 ? (
              <p className="text-muted text-center py-3">Belum ada pesanan.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Pembeli</th>
                      <th>Produk</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Tanggal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, index) => (
                      <tr key={order.id}>
                        <td>#{index + 1}</td>
                        <td>{order.nama_pembeli || order.user_nama || '-'}</td>
                        <td>{order.nama_produk || '-'}</td>
                        <td>{formatRupiah(order.produk_harga || 0)}</td>
                        <td>
                          <span className="badge" style={{backgroundColor: order.status === 'Selesai' ? '#2E7D32' : order.status === 'Diterima' ? '#1976D2' : order.status === 'Dikirim' ? '#F57C00' : order.status === 'Dikemas' ? '#9C27B0' : '#C62828', color: '#FFFFFF'}}>
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
      </div>

      <div className='container-fluid'>
        <div className='row'>
          <div className='col'>
            <Link to="produk/tambah" className='btn mt-4 me-4 shadow-sm border text-white' style={{backgroundColor: "#333333"}}>+ Tambah Produk</Link>
            <Link to="artikel" className='btn mt-4 shadow-sm border text-white' style={{backgroundColor: "#333333"}}>+ Tulis Artikel</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminOverviewPage;
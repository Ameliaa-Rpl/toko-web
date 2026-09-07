import { useState, useEffect } from 'react';
import { adminApi } from '../../api';
import { formatRupiah, mediaUrl } from '../../utils';
import { STATUS_PROSES, METODE_BAYAR, SHIPPING, STATUS_BAYAR } from '../../constants';

function AdminPembelianPage() {
  const [pembelian, setPembelian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(false);

  // Fetch pembelian dari API
  useEffect(() => {
    const fetchPembelian = async () => {
      try {
        const res = await adminApi.getPembelian();
        setPembelian(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat pembelian');
      } finally {
        setLoading(false);
      }
    };
    fetchPembelian();
  }, []);

  // Handle update status
  const handleUpdateStatus = async (id, newStatus) => {
    if (!window.confirm(`Ubah status pesanan #${id} menjadi "${newStatus}"?`)) return;

    try {
      setUpdating(true);
      const order = pembelian.find((item) => item.id === id);
      await adminApi.updatePembelian(id, {
        ...order,
        status: newStatus,
      });

      setPembelian(
        pembelian.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      alert(err.message || 'Gagal mengupdate status');
    } finally {
      setUpdating(false);
    }
  };

  // Handle update bayar
  const handleUpdateBayar = async (id, newBayar) => {
    if (!window.confirm(`Ubah status pembayaran #${id} menjadi "${newBayar}"?`)) return;

    try {
      setUpdating(true);
      const order = pembelian.find((item) => item.id === id);
      await adminApi.updatePembelian(id, {
        ...order,
        pembayaran: newBayar,
      });

      setPembelian(
        pembelian.map((item) =>
          item.id === id ? { ...item, pembayaran: newBayar } : item
        )
      );

      if (selectedOrder && selectedOrder.id === id) {
        setSelectedOrder({ ...selectedOrder, pembayaran: newBayar });
      }
    } catch (err) {
      alert(err.message || 'Gagal mengupdate status pembayaran');
    } finally {
      setUpdating(false);
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm(`Yakin ingin menghapus pesanan #${id}?`)) return;
    try {
      await adminApi.deletePembelian(id);
      setPembelian(pembelian.filter((item) => item.id !== id));
      if (selectedOrder && selectedOrder.id === id) {
        setShowModal(false);
      }
    } catch (err) {
      alert(err.message || 'Gagal menghapus pesanan');
    }
  };

  // Open modal detail
  const handleDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  // Filter data
  const filteredData =
    filterStatus === 'Semua'
      ? pembelian
      : pembelian.filter((item) => item.status === filterStatus);

  // Warna badge status
  const getStatusColor = (status) => {
    const colors = {
      Tertunda: '#C62828',
      Dikemas: '#9C27B0',
      Dikirim: '#F57C00',
      Diterima: '#1976D2',
      Selesai: '#2E7D32',
    };
    return colors[status] || '#6c757d';
  };

  const getBayarColor = (status) => {
    return status === 'Dibayar' ? '#2E7D32' : '#C62828';
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Kelola Pesanan</p>
              <p className="text-muted">Daftar transaksi pembelian</p>
            </div>
          </div>

          {/* Filter Status */}
          <div className="col-12 mt-2">
            <div className="d-flex flex-wrap gap-2 mb-3">
              {['Semua', ...STATUS_PROSES].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className="btn btn-sm px-3"
                  style={{
                    backgroundColor: filterStatus === status ? '#333333' : '#FFFFFF',
                    color: filterStatus === status ? '#FFFFFF' : '#4A4A4A',
                    border: filterStatus === status ? 'none' : '1px solid #D4C5B2',
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="col-12 mt-2">
            {loading && (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th className="text-muted fw-semibold">ID</th>
                      <th className="text-muted fw-semibold">PEMBELI</th>
                      <th className="text-muted fw-semibold">GAMBAR</th>
                      <th className="text-muted fw-semibold">PRODUK</th>
                      <th className="text-muted fw-semibold">TOTAL</th>
                      <th className="text-muted fw-semibold">STATUS</th>
                      <th className="text-muted fw-semibold">BAYAR</th>
                      <th className="text-muted fw-semibold text-center">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="text-center text-muted py-4">Belum ada pesanan.</td>
                      </tr>
                    ) : (
                      filteredData.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-medium">#{item.id}</td>
                          <td>{item.nama_pembeli || item.user_nama || '-'}</td>
                          <td>
                            <img
                              src={mediaUrl(item.gambar || item.produk_gambar, 'produk')}
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                              style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px',}}
                            />
                          </td>
                          <td>{item.nama_produk || '-'}</td>
                          <td className="fw-bold" style={{ color: '#333333' }}>{formatRupiah(item.produk_harga || 0)}</td>
                          <td>
                            <span className="badge" style={{backgroundColor: getStatusColor(item.status), color: '#FFFFFF',}}>
                              {item.status || 'Tertunda'}
                            </span>
                          </td>
                          <td>
                            <span className="badge" style={{backgroundColor: getBayarColor(item.pembayaran), color: '#FFFFFF',}}>
                              {item.pembayaran || 'Belum'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <button onClick={() => handleDetail(item)} className="btn btn-sm btn-outline-info">Detail</button>
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

      {/* ===== MODAL DETAIL PESANAN ===== */}
      {showModal && selectedOrder && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedOrder(null);
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title fs-5 fw-bold">Detail Pesanan #{selectedOrder.id}</p>
                <button type="button" className="btn-close" onClick={() => {setShowModal(false); setSelectedOrder(null);}} />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">Pembeli</p>
                    <p className="text-muted">{selectedOrder.nama_pembeli || selectedOrder.user_nama || '-'}</p>

                    <p className="fw-bold mb-1">Produk</p>
                    <p className="text-muted">{selectedOrder.nama_produk || '-'}</p>

                    <p className="fw-bold mb-1">Total Harga</p>
                    <p className="fw-bold" style={{ color: '#333333' }}>{formatRupiah(selectedOrder.produk_harga || 0)}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">Metode Pembayaran</p>
                    <p className="text-muted">{selectedOrder.metode_pembayaran || '-'}</p>

                    <p className="fw-bold mb-1">Status Pembayaran</p>
                    <span className="badge text-white" style={{backgroundColor: getBayarColor(selectedOrder.pembayaran)}}>
                      {selectedOrder.pembayaran || 'Belum'}
                    </span>

                    <p className="fw-bold mb-1 mt-2">Metode Pengiriman</p>
                    <p className="text-muted">{selectedOrder.pengiriman || '-'}</p>
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-12">
                    <p className="fw-bold mb-1">Catatan</p>
                    <p className="text-muted">{selectedOrder.catatan || '-'}</p>
                  </div>
                </div>

                <div className="row mt-3">
                  <div className="col-12">
                    <p className="fw-bold mb-2">Ubah Status</p>
                    <div className="d-flex flex-wrap gap-2">
                      {STATUS_PROSES.map((status) => (
                        <button
                          key={status}
                          onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                          className="btn btn-sm"
                          style={{
                            backgroundColor:
                              selectedOrder.status === status ? '#333333' : '#FFFFFF',
                            color: selectedOrder.status === status ? '#FFFFFF' : '#4A4A4A',
                            border: '1px solid #D4C5B2',
                          }}
                          disabled={updating}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="row mt-3">
                <div className="col-12">
                  <p className="fw-bold mb-2">Ubah Status Pembayaran</p>
                  <div className="d-flex flex-wrap gap-2">
                    {STATUS_BAYAR.map((status) => (
                      <button
                        key={status}
                        onClick={() => handleUpdateBayar(selectedOrder.id, status)}
                        className="btn btn-sm rounded-pill px-3"
                        style={{
                          backgroundColor: selectedOrder.pembayaran === status ? '#2E7D32' : '#FFFFFF',
                          color: selectedOrder.pembayaran === status ? '#FFFFFF' : '#4A4A4A',
                          border: '1px solid #D4C5B2',
                        }}
                        disabled={updating}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => {setShowModal(false); setSelectedOrder(null);}}>Tutup</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPembelianPage;
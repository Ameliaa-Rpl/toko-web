import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pembeliApi } from '../../api';
import { formatRupiah, formatTanggal, mediaUrl } from '../../utils';
import { STATUS_PROSES, STATUS_BAYAR, SITE } from '../../constants';

function PembeliPesananPage() {
  const [pesanan, setPesanan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPesanan = async () => {
      try {
        const res = await pembeliApi.getPembelian();
        setPesanan(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat pesanan');
      } finally {
        setLoading(false);
      }
    };
    fetchPesanan();
  }, []);

  const handleDetail = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

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
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Pesanan Saya</p>
            <p className="text-muted mb-4">Daftar riwayat pembelian Anda</p>
          </div>

          <div className="col-12">
            {pesanan.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">Belum ada pesanan.</p>
                <Link to="/akun/belanja" className="btn text-white px-4" style={{ backgroundColor: '#A83225' }}>Mulai Belanja</Link>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th className="text-muted fw-semibold">ID</th>
                      <th className="text-muted fw-semibold">GAMBAR</th>
                      <th className="text-muted fw-semibold">PRODUK</th>
                      <th className="text-muted fw-semibold">TOTAL</th>
                      <th className="text-muted fw-semibold">STATUS</th>
                      <th className="text-muted fw-semibold">BAYAR</th>
                      <th className="text-muted fw-semibold">KURIR</th>
                      <th className="text-muted fw-semibold">TANGGAL</th>
                      <th className="text-muted fw-semibold text-center">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pesanan.map((item) => (
                      <tr key={item.id}>
                        <td className="fw-medium">#{item.id}</td>
                        <td>
                          <img
                            src={mediaUrl(item.gambar || item.produk_gambar, 'produk')}
                            alt={item.nama_produk}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px',}}
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg';
                            }}
                          />
                        </td>
                        <td>{item.nama_produk || '-'}</td>
                        <td className="fw-bold" style={{ color: '#333333' }}>{formatRupiah(item.produk_harga || 0)}</td>
                        <td>
                          <span
                            className="badge"
                            style={{backgroundColor: getStatusColor(item.status), color: '#FFFFFF'}}>
                            {item.status || 'Tertunda'}
                          </span>
                        </td>
                        <td>
                          <span
                            className="badge"
                            style={{ backgroundColor: getBayarColor(item.pembayaran), color: '#FFFFFF'}}
                          >
                            {item.pembayaran || 'Belum'}
                          </span>
                        </td>
                        <td>{item.pengiriman || '-'}</td>
                        <td>{formatTanggal(item.created_at, 'date')}</td>
                        <td><button onClick={() => handleDetail(item)} className="btn btn-sm btn-outline-info">Detail</button></td>
                      </tr>
                    ))}
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
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ height: '600px' }}>
              <div className="modal-header">
                <p className="modal-title fs-5 fw-bold">Detail Pesanan #{selectedOrder.id}</p>
                <button type="button" className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedOrder(null);
                  }}
                />
              </div>
              <div className="modal-body" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                <div className="row mb-3">
                  <div className="col-3">
                    <img
                      src={mediaUrl(selectedOrder.gambar || selectedOrder.produk_gambar, 'produk')}                      
                      style={{ width: '100%' 
                      }}
                      onError={(e) => {
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                  </div>
                </div>

                {selectedOrder.metode_pembayaran === 'Bank Transfer' && (
                  <div className="card border-0 bg-light p-3 rounded-4 mb-4">
                    <p className="fw-bold">Rekening tujuan transfer</p>
                    <p className="text-muted mb-2" style={{fontSize: '14px'}}>
                      Jumlah transfer: <span className="fw-bold" style={{ color: '#333333' }}>{formatRupiah(selectedOrder.produk_harga || 0)}
                      </span> 
                      — cantumkan <span className="fw-bold">#{selectedOrder.id}</span> di berita transfer
                    </p>
                    <div className="d-flex">
                      <div className='me-4'>
                        <p className="fw-bold mb-0">{SITE.nama_bank_a || 'BCA'}</p>
                        <p className="text-muted small">{SITE.no_rek_a || '1234567890'}</p>
                      </div>
                      <div>
                        <p className="fw-bold mb-0">{SITE.nama_bank_b || 'Mandiri'}</p>
                        <p className="text-muted small">{SITE.no_rek_b || '9876543210'}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="row">
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">ID Pesanan</p>
                    <p className="text-muted">#{selectedOrder.id}</p>

                    <p className="fw-bold mb-1">Produk</p>
                    <p className="text-muted">{selectedOrder.nama_produk || '-'}</p>

                    <p className="fw-bold mb-1">Harga</p>
                    <p className="fw-bold" style={{ color: '#333333' }}>
                      {formatRupiah(selectedOrder.produk_harga || 0)}
                    </p>

                    <p className="fw-bold mb-1">Nama Penerima</p>
                    <p className="text-muted">{selectedOrder.nama_pembeli || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">Alamat Kirim</p>
                    <p className="text-muted">{selectedOrder.alamat_pembeli || '-'}</p>

                    <p className="fw-bold mb-1">Telepon</p>
                    <p className="text-muted">{selectedOrder.phone_pembeli || '-'}</p>

                    <p className="fw-bold mb-1">Metode Bayar</p>
                    <p className="text-muted">{selectedOrder.metode_pembayaran || '-'}</p>

                    <p className="fw-bold mb-1">Status Bayar</p>
                    <span className="badge text-white" style={{ backgroundColor: getBayarColor(selectedOrder.pembayaran) }}>
                      {selectedOrder.pembayaran || 'Belum'}
                    </span>
                  </div>
                </div>

                <hr />

                <div className="row">
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">Kurir</p>
                    <p className="text-muted">{selectedOrder.pengiriman || '-'}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="fw-bold mb-1">Status Pesanan</p>
                    <span className="badge text-white" style={{ backgroundColor: getStatusColor(selectedOrder.status)}}>
                      {selectedOrder.status || 'Tertunda'}
                    </span>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <p className="fw-bold mb-1">Catatan</p>
                    <p className="text-muted">{selectedOrder.catatan || '-'}</p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12">
                    <p className="fw-bold mb-1">Tanggal</p>
                    <p className="text-muted">{formatTanggal(selectedOrder.created_at, 'full')}</p>
                  </div>
                </div>

                {selectedOrder.foto_bukti && (
                  <>
                    <hr />
                    <div className="row">
                      <div className="col-12">
                        <p className="fw-bold mb-1">Bukti Pembayaran</p>
                        <img
                          src={`http://localhost:5000${selectedOrder.foto_bukti}`}
                          className="img-fluid rounded-3"
                          style={{ maxHeight: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
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

export default PembeliPesananPage;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { formatTanggal, formatRupiah, mediaUrl } from '../../utils';

function AdminPembeliPage() {
  const [pembeli, setPembeli] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [selectedPembeli, setSelectedPembeli] = useState(null);
  const [riwayatPesanan, setRiwayatPesanan] = useState([]);
  const [form, setForm] = useState({
    nama_d: '',
    nama_b: '',
    email: '',
    uname: '',
    passwd: '',
    kelamin: 'Laki-laki',
    lahir: '',
    phone: '',
    alamat: '',
    foto: 'default.jpg',
  });

  // Fetch pembeli dari API
  useEffect(() => {
    const fetchPembeli = async () => {
      try {
        const res = await adminApi.getPembeli();
        setPembeli(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat pembeli');
      } finally {
        setLoading(false);
      }
    };
    fetchPembeli();
  }, []);

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus pembeli ini?')) return;
    try {
      await adminApi.deletePembeli(id);
      setPembeli(pembeli.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.message || 'Gagal menghapus pembeli');
    }
  };

  // Handle detail pembeli
  const handleDetail = async (item) => {
    setSelectedPembeli(item);
    try {
      // Ambil riwayat pesanan pembeli
      const res = await adminApi.getPembelian();
      const pesananUser = res.data.filter((p) => p.id_pembeli === item.id);
      setRiwayatPesanan(pesananUser);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
    } finally {
      setShowDetailModal(true);
    }
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  // Handle submit (tambah/edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.nama_d || !form.nama_b || !form.email || !form.uname) {
      setError('Nama depan, nama belakang, email, dan username wajib diisi');
      return;
    }

    if (!editingId && !form.passwd) {
      setError('Password wajib diisi untuk pembeli baru');
      return;
    }

    try {
      let fotoPath = form.foto;

      if (selectedFile) {
        setUploading(true);
        const uploadRes = await adminApi.uploadGambar(selectedFile);
        fotoPath = uploadRes.data.path;
        setUploading(false);
      }

      if (editingId) {
        const { passwd, ...updateData } = form;
        await adminApi.updatePembeli(editingId, { ...updateData, foto: fotoPath });
        const updated = pembeli.map((item) =>
          item.id === editingId ? { ...item, ...updateData, foto: fotoPath } : item
        );
        setPembeli(updated);
      } else {
        const payload = {
          nama_d: form.nama_d,
          nama_b: form.nama_b,
          email: form.email,
          uname: form.uname,
          passwd: form.passwd,
          kelamin: form.kelamin,
          lahir: form.lahir,
          phone: form.phone,
          alamat: form.alamat,
          foto: fotoPath || 'default.jpg',
        };
        const res = await adminApi.createPembeli(payload);
        setPembeli([res.data, ...pembeli]);
      }
      setShowModal(false);
      resetForm();
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pembeli');
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      nama_d: '',
      nama_b: '',
      email: '',
      uname: '',
      passwd: '',
      kelamin: 'Laki-laki',
      lahir: '',
      phone: '',
      alamat: '',
      foto: 'default.jpg',
    });
    setSelectedFile(null);
    setEditingId(null);
    setError('');
  };

  // Open modal untuk edit
  const handleEdit = (item) => {
    setForm({
      nama_d: item.nama_d,
      nama_b: item.nama_b,
      email: item.email,
      uname: item.uname,
      passwd: '',
      kelamin: item.kelamin || 'Laki-laki',
      lahir: item.lahir || '',
      phone: item.phone || '',
      alamat: item.alamat || '',
      foto: item.foto || 'default.jpg',
    });
    setSelectedFile(null);
    setEditingId(item.id);
    setShowModal(true);
  };

  // Open modal untuk tambah
  const handleTambah = () => {
    resetForm();
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

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <div>
              <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Daftar Pembeli</p>
              <p>{pembeli.length} pembeli terdaftar</p>
            </div>
            <button onClick={handleTambah} className="btn text-white" style={{ backgroundColor: '#333333' }}>+ Tambah Pembeli</button>
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
              <div className="alert alert-danger" role="alert">{error}</div>
            )}

            {!loading && !error && (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th scope="col" className="text-muted fw-semibold ps-3">FOTO</th>
                      <th scope="col" className="text-muted fw-semibold">NAMA</th>
                      <th scope="col" className="text-muted fw-semibold">EMAIL</th>
                      <th scope="col" className="text-muted fw-semibold">USERNAME</th>
                      <th scope="col" className="text-muted fw-semibold">TELEPON</th>
                      <th scope="col" className="text-muted fw-semibold">TERDAFTAR</th>
                      <th scope="col" className="text-muted fw-semibold text-center">TINDAKAN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pembeli.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="text-center text-muted py-4">Belum ada pembeli terdaftar.</td>
                      </tr>
                    ) : (
                      pembeli.map((item) => (
                        <tr key={item.id}>
                          <td className="ps-3">
                            <img src={mediaUrl(item.foto, 'avatar')}
                              onError={(e) => {
                                e.target.src = '/placeholder-image.jpg';
                              }}
                              style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                          </td>
                          <td className="fw-medium">{`${item.nama_d} ${item.nama_b}`}</td>
                          <td>{item.email}</td>
                          <td>{item.uname}</td>
                          <td>{item.phone || '-'}</td>
                          <td>{formatTanggal(item.created_at, 'date')}</td>
                          <td>
                            <div className="d-flex gap-2 justify-content-center">
                              <button onClick={() => handleDetail(item)} className="btn btn-sm btn-outline-info">Detail</button>
                              <button onClick={() => handleEdit(item)} className="btn btn-sm btn-outline-primary">Edit</button>
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

      {/* ===== MODAL TAMBAH/EDIT ===== */}
      {showModal && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              resetForm();
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <p className="modal-title fw-bold fs-5">{editingId ? 'Edit Pembeli' : 'Tambah Pembeli'}</p>
                <button type="button" className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}/>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Nama Depan</label>
                      <input type="text" name="nama_d" className="form-control mb-2" value={form.nama_d} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Nama Belakang</label>
                      <input type="text" name="nama_b" className="form-control mb-2" value={form.nama_b} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Email</label>
                      <input type="email" name="email" className="form-control mb-2" value={form.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Username</label>
                      <input type="text" name="uname" className="form-control mb-2" value={form.uname} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Password {editingId ? '(kosongkan jika tidak diubah)' : '*'}</label>
                      <input type="password" name="passwd" className="form-control mb-2" placeholder={editingId ? 'Kosongkan jika tidak diubah' : 'Minimal 6 karakter'} value={form.passwd} onChange={handleChange} required={!editingId} minLength={6} />
                    </div>
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Jenis Kelamin</label>
                      <select name="kelamin" className="form-select mb-2" value={form.kelamin} onChange={handleChange}>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className='fw-medium mb-1'>Tanggal Lahir</label>
                      <input type="date" name="lahir" className="form-control mb-2" value={form.lahir} onChange={handleChange} />
                    </div>
                    <div className='col-md-6'>
                      <label className="fw-medium mb-1">Nomor Telepon</label>
                      <input type="number" name="phone" className="form-control mb-2" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <label className="fw-medium mb-1">Alamat</label>
                  <textarea name="alamat" className="form-control mb-2" rows="2" value={form.alamat} onChange={handleChange} />

                  <label className="fw-medium mb-1">Foto</label>
                  <input type="file" name="foto" className="form-control mb-2" accept="image/*" onChange={handleFileChange} />
                  <p style={{fontSize: "12px"}}>Format yang diizinkan: jpeg, jpg, png, gif, webp</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => {setShowModal(false);resetForm();}}>Batal</button>
                  <button type="submit" className="btn text-white" style={{ backgroundColor: '#333333' }} disabled={uploading}>
                    {uploading ? 'Upload...' : editingId ? 'Update' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODAL DETAIL PEMBELI ===== */}
      {showDetailModal && selectedPembeli && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDetailModal(false);
              setSelectedPembeli(null);
              setRiwayatPesanan([]);
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <p className="modal-title fs-5 fw-bold">Detail Pembeli</p>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedPembeli(null);
                    setRiwayatPesanan([]);
                  }}
                />
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                <div className='container-fluid'>
                  <div className="row mb-3">
                    <div className="col-md-3 text-center">
                      <img
                        src={mediaUrl(selectedPembeli.foto, 'avatar')}
                        alt={selectedPembeli.nama_d}
                        className="rounded-circle"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="col-md-9">
                      <h5 className="fw-bold">{selectedPembeli.nama_d} {selectedPembeli.nama_b}</h5>
                      <p className="text-muted mb-1">📧 {selectedPembeli.email}</p>
                      <p className="text-muted mb-1">👤 {selectedPembeli.uname}</p>
                      <p className="text-muted mb-1">📞 {selectedPembeli.phone || '-'}</p>
                      <p className="text-muted mb-1">📍 {selectedPembeli.alamat || '-'}</p>
                      <p className="text-muted mb-1">📅 Bergabung: {formatTanggal(selectedPembeli.created_at, 'full')}</p>
                    </div>
                  </div>

                  <hr />

                  <p className="fw-bold mb-3 fs-6">Riwayat Transaksi</p>
                  {riwayatPesanan.length === 0 ? (
                    <p className="text-muted text-center py-3">Belum ada transaksi.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Produk</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Bayar</th>
                            <th>Tanggal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {riwayatPesanan.map((order) => (
                            <tr key={order.id}>
                              <td>#{order.id}</td>
                              <td>{order.nama_produk || '-'}</td>
                              <td className="fw-bold" style={{ color: '#333333' }}>{formatRupiah(order.produk_harga || 0)}</td>
                              <td>
                                <span className="badge text-white" style={{backgroundColor: getStatusColor(order.status)}}>{order.status || 'Tertunda'}</span>
                              </td>
                              <td>
                                <span className="badge text-white" style={{backgroundColor: getBayarColor(order.pembayaran)}}>{order.pembayaran || 'Belum'}</span>
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
              <div className="modal-footer">
                <button className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedPembeli(null);
                    setRiwayatPesanan([]);
                  }}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPembeliPage;
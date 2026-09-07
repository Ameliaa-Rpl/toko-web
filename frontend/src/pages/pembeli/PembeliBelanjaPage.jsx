import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { pembeliApi } from '../../api';
import { formatRupiah, mediaUrl } from '../../utils';
import { METODE_BAYAR, SHIPPING } from '../../constants';

function PembeliBelanjaPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [produk, setProduk] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [selectedProduk, setSelectedProduk] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    id_produk: '',
    nama_pembeli: '',
    alamat_pembeli: '',
    phone_pembeli: '',
    metode_pembayaran: 'COD',
    pengiriman: 'JNT Express',
    catatan: '',
    foto_bukti: null,
  });

  // Fetch produk
  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await pembeliApi.getProduk();
        setProduk(res.data || []);
      } catch (err) {
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, []);

  // Set form dari user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        nama_pembeli: `${user.nama_d || ''} ${user.nama_b || ''}`.trim() || user.uname || '',
        alamat_pembeli: user.alamat || '',
        phone_pembeli: user.phone || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    const produkId = searchParams.get('produk');
    if (produkId && produk.length > 0) {
      const item = produk.find((p) => p.id_produk === parseInt(produkId));
      if (item) {
        handlePesan(item);
      }
    }
  }, [produk, searchParams]);

  // Kategori unik
  const kategoriList = ['Semua', ...new Set(produk.map((p) => p.kategori).filter(Boolean))];

  // Filter produk
  const filteredProduk =
    filterKategori === 'Semua'
      ? produk
      : produk.filter((p) => p.kategori === filterKategori);

  // Handle modal
  const handlePesan = (item) => {
    setSelectedProduk(item);
    setForm((prev) => ({ ...prev, id_produk: item.id_produk }));
    setShowModal(true);
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
      setForm((prev) => ({ ...prev, foto_bukti: file }));
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      let fotoPath = null;

      // Upload bukti bayar jika ada
      if (form.foto_bukti) {
        const uploadRes = await pembeliApi.uploadGambar(form.foto_bukti);
        fotoPath = uploadRes.data.path;
      }

      await pembeliApi.createPembelian({
        id_produk: form.id_produk,
        nama_pembeli: form.nama_pembeli,
        alamat_pembeli: form.alamat_pembeli,
        phone_pembeli: form.phone_pembeli,
        metode_pembayaran: form.metode_pembayaran,
        catatan: form.catatan || '',
        foto_bukti: fotoPath,
      });

      setShowModal(false);
      setForm((prev) => ({
        ...prev,
        catatan: '',
        foto_bukti: null,
      }));
      alert('Pesanan berhasil dibuat!');
    } catch (err) {
      setError(err.message || 'Gagal membuat pesanan');
    } finally {
      setSubmitting(false);
    }
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
    <div className="container-fluid">
      <div className="row">
        <div className="col-12">
          <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Belanja</p>
          <p className="text-muted mb-4">{produk.length} produk tersedia</p>
        </div>

        <div className="col-12">
          <div className="d-flex flex-wrap gap-2 mb-4">
            {kategoriList.map((kategori) => (
              <button
                key={kategori}
                onClick={() => setFilterKategori(kategori)}
                className="btn btn-sm px-3"
                style={{
                  backgroundColor: filterKategori === kategori ? '#333333' : '#FFFFFF',
                  color: filterKategori === kategori ? '#FFFFFF' : '#4A4A4A',
                  border: filterKategori === kategori ? 'none' : '1px solid #D4C5B2',
                }}
              >
                {kategori === 'Semua' ? 'SEMUA' : kategori.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="col-12">
          <div className="row">
            {filteredProduk.length === 0 ? (
              <div className="col-12 text-center text-muted py-4">
                Belum ada produk di kategori ini
              </div>
            ) : (
              filteredProduk.map((item) => (
                <div className="col-md-6 col-lg-3 mb-4" key={item.id_produk}>
                  <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
                    <div style={{ height: '200px', overflow: 'hidden', backgroundColor: '#fff' }}>
                      <img 
                        src={mediaUrl(item.gambar, 'produk')} className="w-100 h-100" style={{ objectFit: 'cover' }} 
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <p className="card-title fw-bold fs-6">{item.nama_produk}</p>
                      <p className="card-text text-muted">{item.kategori}</p>
                      <p className="fw-bold" style={{ color: '#333333' }}>
                        {formatRupiah(item.harga)}
                      </p>
                      <button onClick={() => handlePesan(item)} className="btn w-100 text-white" style={{ backgroundColor: '#333333' }}>Pesan</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && selectedProduk && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setSelectedProduk(null);
            }
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <p className="modal-title fs-5 fw-bold">Checkout: {selectedProduk.nama_produk}</p>
                <button type="button" className="btn-close" onClick={() => 
                  { setShowModal(false);
                    setSelectedProduk(null);
                  }}
                />
              </div>

              <form onSubmit={handleSubmit}>
                <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {error && <div className="alert alert-danger">{error}</div>}

                  <div className="row mb-3">
                    <div className="col-md-4">
                      <img
                        src={mediaUrl(selectedProduk.gambar, 'produk')}
                        className="img-fluid rounded-3"
                        style={{ width: '100%', objectFit: 'cover', maxHeight: '150px' }}
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg';
                        }}
                      />
                    </div>
                    <div className="col-md-8">
                      <p className="fw-bold mb-1">{selectedProduk.nama_produk}</p>
                      <div className="text-muted mb-2" style={{ fontSize: "15px", maxHeight: '90px', overflowY: 'auto', whiteSpace: 'pre-wrap', lineHeight: '1.5' }}>
                        {selectedProduk.deskripsi}
                      </div>
                      <p className="fw-bold fs-5" style={{ color: '#333333' }}>{formatRupiah(selectedProduk.harga)}</p>
                    </div>
                  </div>

                  <hr />

                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Nama penerima *</label>
                      <input type="text" name="nama_pembeli" className="form-control mb-2" value={form.nama_pembeli} onChange={handleChange} required/>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Telepon *</label>
                      <input type="number" name="phone_pembeli" className="form-control mb-2" value={form.phone_pembeli} onChange={handleChange} required/>
                    </div>
                  </div>

                  <label className="fw-medium mb-1">Alamat pengiriman *</label>
                  <textarea name="alamat_pembeli" className="form-control mb-2" rows="2" value={form.alamat_pembeli} onChange={handleChange} required/>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Kurir *</label>
                      <select name="pengiriman" className="form-select mb-2" value={form.pengiriman} onChange={handleChange}>
                        {SHIPPING.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="fw-medium mb-1">Metode bayar *</label>
                      <select name="metode_pembayaran" className="form-select mb-2" value={form.metode_pembayaran} onChange={handleChange}>
                        {METODE_BAYAR.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <label className="fw-medium mb-1">Catatan (opsional)</label>
                  <textarea name="catatan" className="form-control mb-2" rows="2" placeholder="Tambahkan catatan untuk pesanan" value={form.catatan} onChange={handleChange}/>

                  <label className="fw-medium mb-1">Bukti bayar (opsional)</label>
                  <input type="file" name="foto_bukti" className="form-control mb-2" accept="image/*" onChange={handleFileChange}/>
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowModal(false);
                      setSelectedProduk(null);
                    }}
                  >
                    Batal
                  </button>
                  <button type="submit" className="btn text-white" style={{ backgroundColor: '#333333' }} disabled={submitting}>{submitting ? 'Memproses...' : 'Pesan'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PembeliBelanjaPage;
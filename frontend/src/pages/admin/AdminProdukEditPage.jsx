// frontend/src/pages/admin/AdminProdukEditPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api';
import { KATEGORI_PRODUK } from '../../constants';

function AdminProdukEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    nama_produk: '',
    deskripsi: '',
    harga: '',
    kategori: 'Risol',
    gambar: '',
  });

  useEffect(() => {
    const fetchProduk = async () => {
      try {
        const res = await adminApi.getProdukById(id);
        const data = res.data;
        setForm({
          nama_produk: data.nama_produk,
          deskripsi: data.deskripsi,
          harga: data.harga,
          kategori: data.kategori,
          gambar: data.gambar || '',
        });
      } catch (err) {
        setError(err.message || 'Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProduk();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    // Validasi
    if (!form.nama_produk || !form.deskripsi || !form.harga) {
      setError('Nama produk, deskripsi, dan harga wajib diisi');
      setSaving(false);
      return;
    }

    try {
      let gambarPath = form.gambar;

      // Upload gambar baru jika ada
      if (selectedFile) {
        setUploading(true);
        const uploadRes = await adminApi.uploadGambar(selectedFile);
        gambarPath = uploadRes.data.path;
        setUploading(false);
      }

      await adminApi.updateProduk(id, {
        nama_produk: form.nama_produk,
        deskripsi: form.deskripsi,
        harga: parseInt(form.harga),
        kategori: form.kategori,
        gambar: gambarPath || null,
      });
      navigate('/admin/produk');
    } catch (err) {
      setError(err.message || 'Gagal mengupdate produk');
    } finally {
      setSaving(false);
      setUploading(false);
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

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Edit Produk</p>
            <p className="text-muted">Ubah informasi produk</p>
          </div>
          <Link to="/admin/produk" className="btn btn-outline-secondary">← Kembali</Link>
        </div>

        <div className="col-md-12 mx-auto">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="card p-4 border-0 shadow-sm">
            <label htmlFor="nama_produk" className="fw-medium mb-2">Nama Produk</label>
            <input type="text" name="nama_produk" className="form-control mb-3" placeholder="Masukkan nama produk" value={form.nama_produk} onChange={handleChange} required />

            <label htmlFor="deskripsi" className="fw-medium mb-2">Deskripsi</label>
            <textarea name="deskripsi" className="form-control mb-3" placeholder="Masukkan deskripsi produk" value={form.deskripsi} onChange={handleChange} required />

            <div className="row">
              <div className="col-md-6">
                <label htmlFor="harga" className="fw-medium mb-2">Harga</label>
                <input type="number" name="harga" className="form-control mb-3" placeholder="Masukkan harga" value={form.harga} onChange={handleChange} required />
              </div>
              <div className="col-md-6">
                <label htmlFor="kategori" className="fw-medium mb-2">Kategori</label>
                <select name="kategori" className="form-select mb-3" value={form.kategori} onChange={handleChange} required>
                  <option value="">Pilih Kategori</option>
                  {KATEGORI_PRODUK.map((k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <label htmlFor="gambar" className="fw-medium mb-2">Gambar</label>
            <input type="file" name="gambar" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn text-white fw-semibold rounded-3" style={{ backgroundColor: '#333333', padding: "5px 140px" }} disabled={saving || uploading}>
                {uploading ? 'Upload gambar...' : saving ? 'Menyimpan...' : 'Update Produk'}
              </button>
              <Link to="/admin/produk" className="btn btn-outline-secondary rounded-3" style={{ padding: "5px 60px" }}>Batal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminProdukEditPage;
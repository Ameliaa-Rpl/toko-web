import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api';

function AdminArtikelTambahPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    judul: '',
    ringkasan: '',
    isi: '',
    gambar: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setForm((prev) => ({ ...prev, gambar: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!form.judul || !form.ringkasan || !form.isi) {
      setError('Judul, ringkasan, dan isi artikel wajib diisi');
      setLoading(false);
      return;
    }

    try {
      let gambarPath = null;

      if (selectedFile) {
        setUploading(true);
        const uploadRes = await adminApi.uploadGambar(selectedFile);
        gambarPath = uploadRes.data.path;
        setUploading(false);
      }

      await adminApi.createArtikel({
        judul: form.judul,
        ringkasan: form.ringkasan,
        isi: form.isi,
        gambar: gambarPath || null,
      });

      navigate('/admin/artikel');
    } catch (err) {
      setError(err.message || 'Gagal menambahkan artikel');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-12 d-flex justify-content-between align-items-center mb-4">
          <div>
            <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Tambah Artikel</p>
            <p className="text-muted">Isi form untuk menambahkan artikel baru</p>
          </div>
          <Link to="/admin/artikel" className="btn btn-outline-secondary">← Kembali</Link>
        </div>

        <div className="col-md-12 mx-auto">
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit} className="card p-4 border-0 shadow-sm">
            <label htmlFor="judul" className="fw-medium mb-2">Judul Artikel</label>
            <input type="text" name="judul" className="form-control mb-3" placeholder="Masukkan judul artikel" value={form.judul} onChange={handleChange} required />

            <label htmlFor="ringkasan" className="fw-medium mb-2">Ringkasan</label>
            <textarea name="ringkasan" className="form-control mb-3" rows="2" placeholder="Masukkan ringkasan artikel" value={form.ringkasan} onChange={handleChange} required />

            <label htmlFor="isi" className="fw-medium mb-2">Isi Artikel</label>
            <textarea name="isi" className="form-control mb-3" rows="6" placeholder="Masukkan isi artikel lengkap" value={form.isi} onChange={handleChange} required />

            <label htmlFor="gambar" className="fw-medium mb-2">Gambar</label>
            <input type="file" name="gambar" className="form-control mb-3" accept="image/*" onChange={handleFileChange} />
            <p style={{fontSize: "12px"}}>Format yang diizinkan: jpeg, jpg, png, gif, webp</p>

            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn text-white fw-semibold rounded-3" style={{ backgroundColor: '#333333', padding: "5px 140px" }} disabled={loading || uploading}>
                {uploading ? 'Upload gambar...' : loading ? 'Menyimpan...' : 'Simpan'}
              </button>
              <Link to="/admin/artikel" className="btn btn-outline-secondary rounded-3" style={{ padding: "5px 60px" }}>Batal</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminArtikelTambahPage;
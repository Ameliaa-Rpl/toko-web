import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api';
import { mediaUrl } from '../../utils';
import { KELAMIN } from '../../constants';
import { useAuth } from '../../context/AuthContext';

function AdminProfilPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [form, setForm] = useState({
    nama_d: '',
    nama_b: '',
    email: '',
    uname: '',
    kelamin: 'Laki-laki',
    lahir: '',
    alamat: '',
    phone: '',
    foto: 'default.jpg',
  });
  const [passwordForm, setPasswordForm] = useState({
    passwd_lama: '',
    passwd_baru: '',
    passwd_confirm: '',
  });

  // Fetch data admin
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await adminApi.getMe();
        const data = res.data;
        setForm({
          nama_d: data.nama_d || '',
          nama_b: data.nama_b || '',
          email: data.email || '',
          uname: data.uname || '',
          kelamin: data.kelamin || 'Laki-laki',
          lahir: data.lahir || '',
          alamat: data.alamat || '',
          phone: data.phone || '',
          foto: data.foto || 'default.jpg',
        });
      } catch (err) {
        setError(err.message || 'Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
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
    setSuccess('');
    setSaving(true);

    try {
      let fotoPath = form.foto;

      // Upload gambar baru jika ada
      if (selectedFile) {
        setUploading(true);
        const uploadRes = await adminApi.uploadGambar(selectedFile);
        fotoPath = uploadRes.data.path;
        setUploading(false);
      }

      // Update profil
      await adminApi.putMe({
        nama_d: form.nama_d,
        nama_b: form.nama_b,
        email: form.email,
        kelamin: form.kelamin,
        lahir: form.lahir,
        alamat: form.alamat,
        phone: form.phone,
        foto: fotoPath,
      });

      setSuccess('Profil berhasil diupdate!');
      await refreshUser();
      setSelectedFile(null);

      // Reload data
      const res = await adminApi.getMe();
      const data = res.data;
      setForm({
        nama_d: data.nama_d || '',
        nama_b: data.nama_b || '',
        email: data.email || '',
        uname: data.uname || '',
        kelamin: data.kelamin || 'Laki-laki',
        lahir: data.lahir || '',
        alamat: data.alamat || '',
        phone: data.phone || '',
        foto: data.foto || 'default.jpg',
      });
    } catch (err) {
      setError(err.message || 'Gagal update profil');
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validasi
    if (!passwordForm.passwd_lama || !passwordForm.passwd_baru || !passwordForm.passwd_confirm) {
      setError('Semua field password wajib diisi');
      return;
    }

    if (passwordForm.passwd_baru.length < 6) {
      setError('Password baru minimal 6 karakter');
      return;
    }

    if (passwordForm.passwd_baru !== passwordForm.passwd_confirm) {
      setError('Konfirmasi password baru tidak cocok');
      return;
    }

    setSaving(true);

    try {
      await adminApi.putMe({
        ...form,
        passwd_lama: passwordForm.passwd_lama,
        passwd_baru: passwordForm.passwd_baru,
      });

      setSuccess('Password berhasil diubah!');
      setPasswordForm({
        passwd_lama: '',
        passwd_baru: '',
        passwd_confirm: '',
      });
    } catch (err) {
      setError(err.message || 'Gagal mengganti password');
    } finally {
      setSaving(false);
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
        <div className="col-12">
          <p className="fw-bolder fs-2 mb-0" style={{ fontFamily: 'georgia' }}>Profil Admin</p>
          <p className="text-muted mb-4">Kelola informasi akun Anda</p>
        </div>

        <div className="col-lg-8">
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="card border-0 shadow-sm p-4 mb-4">
            <p className="fw-bold mb-3 fs-5">Informasi Profil</p>
            <form onSubmit={handleSubmit}>
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
                  <input type="text" name="uname" className="form-control mb-2" value={form.uname} onChange={handleChange} disabled />
                  <small className="text-muted">Username tidak dapat diubah</small>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <label className="fw-medium mb-1">Jenis Kelamin</label>
                  <select name="kelamin" className="form-select mb-2" value={form.kelamin} onChange={handleChange}>
                    {KELAMIN.map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="fw-medium mb-1">Tanggal Lahir</label>
                  <input type="date" name="lahir" className="form-control mb-2" value={form.lahir} onChange={handleChange} />
                </div>
              </div>

              <label className="fw-medium mb-1">Alamat</label>
              <textarea name="alamat" className="form-control mb-2" rows="2" value={form.alamat} onChange={handleChange} />

              <label className="fw-medium mb-1">Telepon</label>
              <input type="number" name="phone" className="form-control mb-2" value={form.phone} onChange={handleChange} />

              <label className="fw-medium mb-1">Foto Profil</label>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={mediaUrl(form.foto, 'avatar')}
                  alt="Profile"
                  className="rounded-circle"
                  style={{ width: '64px', height: '64px', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg';
                  }}
                />
                <input type="file" className="form-control" accept="image/*" onChange={handleFileChange} />
              </div>
              <p style={{fontSize: "12px"}}>Format yang diizinkan: jpeg, jpg, png, gif, webp</p>

              <button type="submit" className="btn text-white mt-2" style={{ backgroundColor: '#333333' }} disabled={saving || uploading}>
                {uploading ? 'Upload foto...' : saving ? 'Menyimpan...' : 'Update Profil'}
              </button>
            </form>
          </div>

          <div className="card border-0 shadow-sm p-4">
            <h5 className="fw-bold mb-3">Ganti Password</h5>
            <form onSubmit={handleChangePassword}>
              <label className="fw-medium mb-1">Password Lama</label>
              <input type="password" name="passwd_lama" className="form-control mb-2" placeholder="Masukkan password lama" value={passwordForm.passwd_lama} onChange={handlePasswordChange} required />

              <label className="fw-medium mb-1">Password Baru</label>
              <input type="password" name="passwd_baru" className="form-control mb-2" placeholder="Minimal 6 karakter" value={passwordForm.passwd_baru} onChange={handlePasswordChange} required minLength={6} />

              <label className="fw-medium mb-1">Konfirmasi Password Baru</label>
              <input type="password" name="passwd_confirm" className="form-control mb-2" placeholder="Konfirmasi password baru" value={passwordForm.passwd_confirm} onChange={handlePasswordChange} required minLength={6} />

              <button type="submit" className="btn text-white mt-2" style={{ backgroundColor: '#333333' }} disabled={saving}>
                {saving ? 'Menyimpan...' : 'Ganti Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfilPage;
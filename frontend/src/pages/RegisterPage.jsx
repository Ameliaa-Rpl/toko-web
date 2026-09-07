import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { KELAMIN, SITE } from '../constants';

function RegisterPage() {
  const [form, setForm] = useState({
    nama_d: '',
    nama_b: '',
    email: '',
    uname: '',
    passwd: '',
    kelamin: 'Laki-laki',
    lahir: '',
    alamat: '',
    phone: '',
    foto: 'default.jpg'
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setForm(prev => ({ ...prev, foto: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (form.passwd.length < 6) {
      setError('Password minimal 6 karakter.');
      setLoading(false);
      return;
    }

    try {
      let fotoPath = 'default.jpg';

      // Upload gambar jika ada
      if (selectedFile) {
        setUploading(true);
        const uploadRes = await api.uploadGambar(selectedFile);
        fotoPath = uploadRes.data.path;
        setUploading(false);
      }

      await api.register({
        ...form,
        foto: fotoPath, 
      });

      setSuccess('Registrasi berhasil! Silakan login.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-6 vh-100 text-white d-flex flex-column justify-content-end" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45)), url(${SITE.foto_banner})`, 
            backgroundSize: "cover", 
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat", 
            padding: "0px 70px 50px 70px" 
          }}
        >
          <p className='fw-bolder fs-2 mb-0 font-serif'>"Setiap rajutan memiliki cerita."</p>
          <p style={{color: "#E8C9B8"}}>Temukan koleksi rajut pilihan untuk melengkapi gaya keseharian anda.</p>
        </div>

        <div className='col-6 vh-100 overflow-auto' style={{ backgroundColor: "#FAF8F5", padding: "50px 80px"}}>
          <Link to="/login" className='text-decoration-none' style={{color: "#333333"}}>← Sudah punya akun</Link>
          <p className='fw-bolder fs-2 mb-0 mt-4' style={{fontFamily: "georgia"}}>Buat Akun Baru</p>
          <p className='mb-4'>Daftar untuk mulai menjelajahi dan membeli koleksi rajut kami</p>

          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <label className="fw-medium mb-2">Nama Depan</label>
                <input type="text" name="nama_d" className="form-control mb-3" value={form.nama_d} onChange={handleChange} required />
              </div>
              <div className="col-6">
                <label className="fw-medium mb-2">Nama Belakang</label>
                <input type="text" name="nama_b" className="form-control mb-3" value={form.nama_b} onChange={handleChange} required />
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
                <label className="fw-medium mb-2">Password</label>
                <input type="password" name="passwd" className="form-control mb-3" placeholder="Minimal 6 karakter" autoComplete='new-password' value={form.passwd} onChange={handleChange} required />
              </div>
              <div className='col-md-6'>
                <label className="fw-medium mb-2">Jenis Kelamin</label>
                <select name="kelamin" className="form-select mb-3" value={form.kelamin} onChange={handleChange}>
                  {KELAMIN.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <label className='fw-medium mb-1'>Tanggal Lahir</label>
                <input type="date" name="lahir" className="form-control mb-2" value={form.lahir} onChange={handleChange} required />
              </div>
              <div className='col-md-6'>
                <label className="fw-medium mb-1">Nomor Telepon</label>
                <input type="number" name="phone" className="form-control mb-2" value={form.phone} onChange={handleChange} required />
              </div>
            </div>

            <label className="fw-medium mb-2">Alamat</label>
            <textarea name="alamat" className="form-control mb-3" rows="2" value={form.alamat} onChange={handleChange} required />

            <label className="fw-medium mb-1">Foto (opsional)</label>
            <input type="file" name="foto" className="form-control mb-2" accept="image/*" onChange={handleFileChange} />
            <p style={{fontSize: "12px"}}>Format yang diizinkan: jpeg, jpg, png, gif, webp</p>

            <button type="submit" className="btn text-light rounded-3 mt-3 py-2 fw-semibold" style={{ backgroundColor: '#333333', width: "100%" }} disabled={loading}>
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
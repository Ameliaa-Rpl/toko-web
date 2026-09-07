import { Link } from 'react-router-dom';
import { SITE, KATEGORI_DATA } from '../constants';
import ProductCard from '../components/common/ProductCard';
import ArtikelCard from '../components/common/ArtikelCard';
import { useBerandaData } from '../hooks';

function HomePage() {
  const { produkTerbaru, artikelTampil, loading, error, produk } = useBerandaData();

  const getJumlahProduk = (kategori) => {
    return produk.filter((p) => p.kategori === kategori).length;
  };

  return (
    <>
      <div className="container-fluid" style={{backgroundColor: '#e8e4e4'}}>
        <div className="row">
          <div className="col-6" style={{height: "500px", padding: "100px 70px"}}>
            <p className='fw-medium text-muted' style={{fontSize: "15px"}}>SELAMAT DATANG DI TOKO RAJUT</p>
            <h1 className="display-4 font-serif fw-bold mb-3">{SITE.nama_toko}</h1>
            <p className='text-muted mb-5'>{SITE.tentang}</p>
            <Link to="/toko" className="px-3 py-2 bg-dark text-white text-decoration-none">BELANJA SEKARANG</Link>
          </div>
          <div className='col-6' style={{height: "500px", padding: "50px 80px 0px 30px"}}>
            <img src={SITE.foto_banner} className='w-100 rounded-5' style={{height: "400px", objectFit: "cover"}} onError={(e) => { e.currentTarget.src = PLACEHOLDER_IMAGE; }}></img>
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row p-5'>
          <div className='col-12'>
            <p className='fw-bolder fs-2 mb-0 font-serif'>Kategori Produk</p>
            <p>Temukan berbagai produk rajut sesuai kebutuhan Anda</p>
          </div>
          {KATEGORI_DATA.map((kategori) => (
            <div className="col mb-3" key={kategori.nama}>
              <Link to={`/toko?kategori=${encodeURIComponent(kategori.nama)}`} className="text-decoration-none text-dark h-100 d-block">
                <div className="py-2 px-3 rounded-4 text-center h-100 bg-white" style={{ boxShadow: '0 0 10px lightgrey'}}>
                  {kategori.gambar ? (
                    <img 
                      src={kategori.gambar} 
                      style={{ width: '85px', height: '85px', objectFit: 'contain' }} 
                    />
                  ) : (
                    <p className='fs-1 mb-1'>{kategori.icon}</p>
                  )}
                  <p className='fw-semibold fs-5 mb-1'>{kategori.nama}</p>
                  <p className='text-muted small mb-0'>{getJumlahProduk(kategori.nama)} Produk</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className='container-fluid' style={{backgroundColor: "#e8e4e4"}}>
        <div className='row p-5'>
          <div className='col-12'>
            <p className='fw-bolder fs-2 mb-0 font-serif'>Produk Terbaru</p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Koleksi rajut terbaru yang tersedia di toko kami</p>
              <Link to="/toko" className='text-decoration-none fw-semibold' style={{ color: "black" }}>Lihat semua →</Link>
            </div>
          </div>
        </div>

        {/* Loading & Error */}
        {loading && (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-danger mx-5" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="row px-5 pb-5">
            {produkTerbaru.slice(0, 4).map((produk) => (
              <div className="col-3 mb-4" key={produk.id_produk}>
                <ProductCard produk={produk} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='container-fluid bg-black'>
        <div className='row py-5 text-white text-center'>
          <div className='col-12'>
            <p className='display-3'>🧶</p>
            <p className='fw-bolder fs-2 mb-2 font-serif'>Temukan Rajutan Favoritmu</p>
            <p className="mb-4">Temukan koleksi rajut favoritmu dan pilih produk yang cocok untuk menemani setiap momenmu.</p>
            <Link to="/daftar" type='button' className='btn btn-light fw-medium me-3'>Daftar Gratis</Link>
            <Link to="/toko" type='button' className='btn btn-outline-light fw-medium'>Lihat Produk</Link>
          </div>
        </div>
      </div>

      <div className='container-fluid'>
        <div className='row p-5'>
          <div className='col-md-12'>
            <p className='fw-bolder fs-2 mb-0 font-serif'>Artikel Terbaru</p>
            <div className="d-flex justify-content-between align-items-center">
              <p className="mb-0">Inspirasi dan informasi seputar dunia rajut</p>
              <Link to="/artikel" className='text-decoration-none fw-semibold' style={{ color: "black" }}>Lihat semua →</Link>
            </div>
          </div>
        </div>

        {!loading && !error && (
          <div className="row px-5 pb-5">
            {artikelTampil.slice(0, 3).map((artikel) => (
              <div className="col-4 mb-4" key={artikel.id}>
                <ArtikelCard artikel={artikel} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default HomePage;
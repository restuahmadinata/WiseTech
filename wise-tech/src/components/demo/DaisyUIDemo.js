import React from 'react';

/**
 * Komponen Demo untuk menunjukkan penggunaan DaisyUI di WiseTech
 * 
 * Komponen ini menampilkan berbagai komponen DaisyUI yang digunakan dalam proyek
 * dan dapat digunakan untuk mendemonstrasikan kepada tim bahwa proyek telah
 * mengimplementasikan DaisyUI secara menyeluruh.
 */
const DaisyUIDemo = () => {
  return (
    <div className="min-h-screen bg-base-200 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-base-100 shadow-xl rounded-box p-6 mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Demo Komponen DaisyUI WiseTech</h1>
          <p className="text-base-content/70 mb-6">
            Halaman ini menunjukkan semua komponen DaisyUI yang diimplementasikan dalam proyek WiseTech.
          </p>

          <div className="tabs tabs-boxed mb-6">
            <button className="tab tab-active">Semua Komponen</button>
            <button className="tab">Buttons</button>
            <button className="tab">Cards</button>
            <button className="tab">Forms</button>
          </div>

          {/* BUTTON SECTION */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Buttons</h2>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
              </div>
              <div className="flex flex-wrap gap-2">
                <button className="btn btn-ghost">Ghost</button>
                <button className="btn btn-link">Link</button>
                <button className="btn btn-outline btn-primary">Outline</button>
                <button className="btn btn-sm">Small</button>
                <button className="btn btn-lg">Large</button>
                <button className="btn btn-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <button className="btn btn-disabled">Disabled</button>
                <button className="btn btn-primary btn-loading">Loading</button>
              </div>
            </div>
          </section>

          {/* CARD SECTION */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Cards</h2>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="card card-compact bg-base-100 shadow-lg border border-base-300">
                <figure className="px-4 pt-4">
                  <div className="bg-base-300 h-48 w-full rounded-lg flex items-center justify-center">
                    <span className="text-base-content/50 text-lg">Product Image</span>
                  </div>
                </figure>
                <div className="card-body">
                  <h3 className="card-title">iPhone 15 Pro Max</h3>
                  <div className="badge badge-secondary">Apple</div>
                  <p>The latest flagship smartphone from Apple with impressive camera...</p>
                  <div className="rating rating-sm">
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                    <input type="radio" name="rating-1" className="mask mask-star-2 bg-orange-400" checked readOnly />
                  </div>
                  <div className="card-actions justify-between items-center mt-3">
                    <span className="text-lg font-semibold">Rp 18.999.000</span>
                    <button className="btn btn-primary">View Details</button>
                  </div>
                </div>
              </div>
              
              <div className="card bg-primary text-primary-content">
                <div className="card-body">
                  <h2 className="card-title">Card dengan Warna</h2>
                  <p>Kartu ini menggunakan warna primary dari tema DaisyUI.</p>
                  <div className="card-actions justify-end">
                    <button className="btn btn-secondary">OK</button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BADGE SECTION */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Badges</h2>
            <div className="divider"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="badge">Default</span>
              <span className="badge badge-primary">Primary</span>
              <span className="badge badge-secondary">Secondary</span>
              <span className="badge badge-accent">Accent</span>
              <span className="badge badge-outline">Outline</span>
              <span className="badge badge-lg">Large</span>
              <span className="badge badge-sm">Small</span>
              <span className="badge badge-success">Success</span>
              <span className="badge badge-warning">Warning</span>
              <span className="badge badge-error">Error</span>
            </div>
          </section>

          {/* FORM SECTION */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Forms</h2>
            <div className="divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Email</span>
                  </div>
                  <input type="email" placeholder="email@example.com" className="input input-bordered w-full" />
                </label>
                
                <label className="form-control w-full mt-4">
                  <div className="label">
                    <span className="label-text">Password</span>
                  </div>
                  <input type="password" placeholder="••••••••" className="input input-bordered w-full" />
                </label>
                
                <div className="form-control mt-4">
                  <label className="label cursor-pointer">
                    <span className="label-text">Remember me</span>
                    <input type="checkbox" className="checkbox checkbox-primary" />
                  </label>
                </div>
                
                <button className="btn btn-primary w-full mt-4">Login</button>
              </div>
              
              <div>
                <label className="form-control">
                  <div className="label">
                    <span className="label-text">Select your favorite gadget type</span>
                  </div>
                  <select className="select select-bordered w-full">
                    <option disabled selected>Pick one</option>
                    <option>Smartphone</option>
                    <option>Laptop</option>
                    <option>Tablet</option>
                    <option>Smartwatch</option>
                  </select>
                </label>
                
                <label className="form-control mt-4">
                  <div className="label">
                    <span className="label-text">Your bio</span>
                  </div>
                  <textarea className="textarea textarea-bordered h-24" placeholder="Tell us about yourself..."></textarea>
                </label>
                
                <div className="flex justify-center mt-4">
                  <div className="join">
                    <input className="join-item btn" type="radio" name="options" aria-label="Low" />
                    <input className="join-item btn" type="radio" name="options" aria-label="Medium" checked />
                    <input className="join-item btn" type="radio" name="options" aria-label="High" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* MISC COMPONENTS */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Komponen Lainnya</h2>
            <div className="divider"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Alerts</h3>
                <div className="alert alert-info mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Ini adalah pesan informasi.</span>
                </div>
                <div className="alert alert-success mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Profil Anda berhasil diperbarui!</span>
                </div>
                
                <h3 className="font-bold mt-4 mb-2">Progress</h3>
                <progress className="progress progress-primary w-full" value="70" max="100"></progress>
                
                <h3 className="font-bold mt-4 mb-2">Toggle</h3>
                <input type="checkbox" className="toggle toggle-primary" checked />
              </div>
              
              <div>
                <h3 className="font-bold mb-2">Avatars</h3>
                <div className="flex gap-2 mb-4">
                  <div className="avatar">
                    <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                      <div className="bg-primary text-primary-content w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold">JD</span>
                      </div>
                    </div>
                  </div>
                  <div className="avatar">
                    <div className="w-12 rounded-full">
                      <div className="bg-secondary text-secondary-content w-full h-full flex items-center justify-center">
                        <span className="text-lg font-bold">AS</span>
                      </div>
                    </div>
                  </div>
                  <div className="avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-12">
                      <span>MX</span>
                    </div>
                  </div>
                </div>
                
                <h3 className="font-bold mt-4 mb-2">Loading Spinners</h3>
                <div className="flex gap-4">
                  <button className="btn">
                    <span className="loading loading-spinner"></span>
                    loading
                  </button>
                  <span className="loading loading-dots loading-lg text-primary"></span>
                  <span className="loading loading-ring loading-lg text-secondary"></span>
                </div>
                
                <h3 className="font-bold mt-4 mb-2">Tooltip</h3>
                <div className="tooltip" data-tip="Tooltip konten">
                  <button className="btn">Hover di sini</button>
                </div>
              </div>
            </div>
          </section>
          
          {/* THEME SECTION */}
          <section>
            <h2 className="text-2xl font-bold mb-4">Tema DaisyUI</h2>
            <div className="divider"></div>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-outline">corporate (default)</button>
              <button className="btn btn-outline">light</button>
              <button className="btn btn-outline">dark</button>
            </div>
            <p className="mt-4 text-base-content/70">
              Proyek WiseTech menggunakan tema "corporate" sebagai default dengan kemampuan untuk beralih ke mode "dark".
              Tema ini diatur melalui <code className="bg-base-200 px-1 py-0.5 rounded">src/utils/theme.js</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DaisyUIDemo;

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search, Star, X, ImagePlus } from 'lucide-react';
import { db } from '@/db/database';
import { formatPrice } from '@/utils/formatters';
import type { Product } from '@/types';

const BADGE_COLORS = {
  bestseller: 'bg-amber-100 text-amber-700',
  new: 'bg-blue-100 text-blue-700',
  sale: 'bg-red-100 text-red-700',
  popular: 'bg-emerald-100 text-emerald-700',
};

function ImageManager({
  images,
  onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  const addImage = () => onChange([...images, '']);
  const removeImage = (i: number) => onChange(images.filter((_, idx) => idx !== i));
  const updateImage = (i: number, val: string) =>
    onChange(images.map((img, idx) => (idx === i ? val : img)));

  return (
    <div className="flex flex-col gap-2">
      {images.map((img, i) => (
        <div key={i} className="flex items-center gap-2">
          {/* Thumbnail */}
          <div className="w-10 h-10 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
            {img ? (
              <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <ImagePlus className="w-4 h-4" />
              </div>
            )}
          </div>
          <input
            value={img}
            onChange={(e) => updateImage(i, e.target.value)}
            placeholder={i === 0 ? 'Main image URL (thumbnail)' : `Image ${i + 1} URL`}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {i === 0 && (
            <span className="shrink-0 text-[10px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-lg">MAIN</span>
          )}
          {images.length > 1 && (
            <button
              onClick={() => removeImage(i)}
              className="shrink-0 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ))}
      <button
        onClick={addImage}
        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-1 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add another image
      </button>
    </div>
  );
}

function ProductFormModal({
  product,
  onClose,
  onSave,
}: {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: Partial<Product>) => Promise<void>;
}) {
  const [form, setForm] = useState<{
    name: string;
    brand: Product['brand'];
    category: Product['category'];
    strength: string;
    shortDescription: string;
    images: string[];
    badge: Product['badge'];
    inStock: boolean;
    featured: boolean;
    rating: number;
    reviewCount: number;
  }>({
    name: product?.name ?? '',
    brand: product?.brand ?? 'Sun Pharma',
    category: product?.category ?? 'modafinil',
    strength: product?.strength ?? '200mg',
    shortDescription: product?.shortDescription ?? '',
    images: product?.images?.length ? product.images : [product?.image ?? ''],
    badge: product?.badge ?? undefined,
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    rating: product?.rating ?? 4.5,
    reviewCount: product?.reviewCount ?? 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const validImages = form.images.filter(Boolean);
    setSaving(true);
    await onSave({
      ...form,
      images: validImages,
      image: validImages[0] ?? '',
    });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Brand</label>
              <select value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value as Product['brand'] })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="Sun Pharma">Sun Pharma</option>
                <option value="HAB Pharma">HAB Pharma</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="modafinil">Modafinil</option>
                <option value="armodafinil">Armodafinil</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Strength</label>
              <input value={form.strength} onChange={(e) => setForm({ ...form, strength: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Badge</label>
              <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value as Product['badge'] })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">None</option>
                <option value="bestseller">Bestseller</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="popular">Popular</option>
              </select>
            </div>
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">Short Description</label>
              <textarea rows={2} value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                className="border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>

            {/* Multi-image section */}
            <div className="col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase">
                Product Images
                <span className="ml-1 normal-case font-normal text-slate-400">— first image is the thumbnail</span>
              </label>
              <ImageManager
                images={form.images.length ? form.images : ['']}
                onChange={(imgs) => setForm({ ...form, images: imgs })}
              />
            </div>

            <div className="flex items-center gap-3">
              <input type="checkbox" id="inStock" checked={form.inStock} onChange={(e) => setForm({ ...form, inStock: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <label htmlFor="inStock" className="text-sm font-medium text-slate-700">In Stock</label>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 text-blue-600 rounded" />
              <label htmlFor="featured" className="text-sm font-medium text-slate-700">Featured</label>
            </div>
          </div>
          <button onClick={handleSave} disabled={saving}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50">
            {saving ? 'Saving...' : product ? 'Save Changes' : 'Create Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [editProduct, setEditProduct] = useState<Product | null | undefined>(undefined);

  const { data: products } = useQuery({
    queryKey: ['products'],
    queryFn: () => db.products.toArray(),
  });

  const filtered = (products ?? []).filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Partial<Product>) => {
    if (editProduct?.id) {
      await db.products.update(editProduct.id, data);
    } else {
      const images = (data.images ?? []).filter(Boolean);
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        slug: data.name?.toLowerCase().replace(/\s+/g, '-') ?? 'new-product',
        pillsPerStrip: 10,
        description: data.shortDescription ?? '',
        images,
        image: images[0] ?? '',
        variants: [{ id: 'v1', quantity: 100, price: 99 }],
        effects: [],
        ingredients: '',
        manufacturer: data.brand ?? 'Sun Pharma',
        createdAt: new Date(),
        ...data,
      } as Product;
      await db.products.add(newProduct);
    }
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      await db.products.delete(id);
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Products</h1>
          <p className="text-slate-500 text-sm mt-1">{products?.length ?? 0} products in catalog</p>
        </div>
        <button
          onClick={() => setEditProduct(null)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..."
          className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group">
            <div className="relative h-44 overflow-hidden bg-slate-50">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              {/* image count badge */}
              {product.images?.length > 1 && (
                <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ImagePlus className="w-3 h-3" />
                  {product.images.length}
                </div>
              )}
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.badge && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${BADGE_COLORS[product.badge]}`}>
                    {product.badge}
                  </span>
                )}
                {!product.inStock && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-white">Out of Stock</span>
                )}
              </div>
              {product.featured && (
                <div className="absolute top-3 right-3 bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full">Featured</div>
              )}
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">{product.brand}</p>
              <h3 className="font-bold text-slate-900 mt-0.5 mb-1">{product.name}</h3>
              <p className="text-xs text-slate-500 line-clamp-2 mb-3">{product.shortDescription}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{product.rating} ({product.reviewCount.toLocaleString()} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-slate-900">
                    {formatPrice(product.variants[0]?.price ?? 0)}+
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setEditProduct(product)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Empty add card */}
        <button
          onClick={() => setEditProduct(null)}
          className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl h-full min-h-[200px] flex flex-col items-center justify-center gap-3 hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center group-hover:border-blue-300">
            <Plus className="w-6 h-6 text-slate-400 group-hover:text-blue-500" />
          </div>
          <p className="text-sm font-medium text-slate-400 group-hover:text-blue-500">Add New Product</p>
        </button>
      </div>

      {editProduct !== undefined && (
        <ProductFormModal
          product={editProduct}
          onClose={() => setEditProduct(undefined)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

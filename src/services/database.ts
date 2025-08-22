import type { Property, Image as ImageModel, Lead, Sale, Community } from '../types';

const getApiBase = (): string => {
  const envBase = process.env.REACT_APP_API_BASE_URL;
  if (envBase && envBase.trim().length > 0) return envBase.replace(/\/$/, '');
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    // When developing locally, always talk directly to the backend to avoid proxy issues
    if (host === 'localhost' || host === '127.0.0.1') {
      return 'http://localhost:5050';
    }
    // In production, default to same-origin unless REACT_APP_API_BASE_URL is provided
    return '';
  }
  // SSR or unknown: fall back to localhost backend
  return 'http://localhost:5050';
};

const API_BASE = getApiBase();

const toAbsoluteUrl = (maybePath: string): string => {
  if (!maybePath) return maybePath;
  if (maybePath.startsWith('http://') || maybePath.startsWith('https://')) return maybePath;
  if (maybePath.startsWith('/')) return `${API_BASE}${maybePath}`;
  return maybePath;
};

const parseNumber = (value: any): number | undefined => {
  if (value === null || value === undefined || value === '') return undefined;
  const n = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(n) ? undefined : n;
};

const mapApiPropertyToClient = (p: any): Property => {
  const images = Array.isArray(p.images) ? p.images.map((u: string) => toAbsoluteUrl(u)) : [];
  const priceNum = parseNumber(p.price) ?? 0;
  return {
    id: String(p.id),
    title: p.title || '',
    description: p.description || '',
    price: priceNum,
    bedrooms: parseNumber(p.bedrooms) ?? 0,
    sqft: parseNumber(p.sqft),
    squareFeet: parseNumber(p.squareFeet) ?? parseNumber(p.sqft),
    bathrooms: parseNumber(p.bathrooms),
    stories: parseNumber(p.stories),
    address: p.address || '',
    city: p.city || '',
    state: p.state || 'TX',
    zip_code: p.zip_code || p.zipCode,
    zipCode: p.zipCode || p.zip_code,
    lat: parseNumber(p.lat),
    lng: parseNumber(p.lng),
    status: p.status || 'available',
    type: p.type,
    community: p.community,
    build_plan_url: p.build_plan_url ? toAbsoluteUrl(p.build_plan_url) : undefined,
    published: Boolean(p.published ?? true),
    update_at: p.update_at,
    garageSpaces: parseNumber(p.garageSpaces),
    features: Array.isArray(p.features) ? p.features : undefined,
    mlsNumber: p.mlsNumber,
    floorPlan: p.floorPlan,
    yearBuilt: parseNumber(p.yearBuilt),
    lotSize: parseNumber(p.lotSize),
    images,
    isQuickMoveIn: Boolean(p.isQuickMoveIn),
  };
};

const apiGet = async (path: string) => {
  const res = await fetch(`${API_BASE}${path}`, { credentials: 'omit' });
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
};

const apiJson = async (path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
};

const uploadFile = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('image', file);
  const res = await fetch(`${API_BASE}/api/upload-image`, { method: 'POST', body: form as any });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  const json = await res.json();
  const url: string = json?.data?.imageUrl;
  return toAbsoluteUrl(url);
};

const migrateLocalToMySQLIfNeeded = async () => {
  if (typeof window === 'undefined' || !window.localStorage) return;
  const MIGRATION_KEY = 're_local_to_mysql_migrated_v1';
  if (window.localStorage.getItem(MIGRATION_KEY) === 'yes') return;

  try {
    const listRes = await apiGet('/api/properties');
    const existing = Array.isArray(listRes?.data) ? listRes.data : [];
    if (existing.length > 0) {
      window.localStorage.setItem(MIGRATION_KEY, 'yes');
      return;
    }

    const rawProps = window.localStorage.getItem('re_props_v1');
    const rawImages = window.localStorage.getItem('re_images_v1');
    if (!rawProps) return;
    const props: Property[] = JSON.parse(rawProps);
    const images: ImageModel[] = rawImages ? JSON.parse(rawImages) : [];

    for (const p of props) {
      const payload = {
        title: p.title || '',
        description: p.description || '',
        price: p.price || 0,
        bedrooms: p.bedrooms || 0,
        sqft: p.squareFeet || p.sqft || 0,
        address: p.address || '',
        city: p.city || '',
        state: p.state || 'TX',
        zip_code: p.zipCode || p.zip_code || '',
        lat: p.lat || 0,
        lng: p.lng || 0,
        status: p.status || 'available',
        build_plan_url: p.build_plan_url || '',
        published: p.published !== false,
      };
      const created = await apiJson('/api/properties', 'POST', payload);
      const newId = String(created?.data?.id);
      const imgs = images.filter(i => i.property_id === p.id).sort((a, b) => a.order - b.order);
      for (const [index, img] of imgs.entries()) {
        await apiJson(`/api/properties/${newId}/images`, 'POST', {
          image_url: img.image_url,
          caption: img.caption || `Property image ${index + 1}`,
          order: index,
        });
      }
    }

    window.localStorage.setItem(MIGRATION_KEY, 'yes');
  } catch (e) {
    // Best-effort migration; ignore errors
    console.warn('Local-to-MySQL migration skipped:', e);
  }
};

export const DatabaseService = {
  testConnection: async (): Promise<boolean> => {
    try {
      const res = await apiGet('/api/test');
      return Boolean(res?.success);
    } catch (e) {
      return false;
    }
  },

  addTestProperty: async (): Promise<Property | null> => {
    try {
      const created = await apiJson('/api/properties', 'POST', {
        title: 'Test Property',
        description: 'Inserted from UI to verify MySQL persistence',
        price: 500000,
        bedrooms: 3,
        sqft: 2000,
        address: '123 Test Street',
        city: 'Test City',
        state: 'TX',
        zip_code: '12345',
        lat: 32.7767,
        lng: -96.7970,
        status: 'available',
        build_plan_url: '',
        published: true,
      });
      const id = String(created?.data?.id);
      const property = await DatabaseService.getPropertyById(id);
      return property;
    } catch (e) {
      return null;
    }
  },

  testGetAllProperties: async (): Promise<Property[]> => {
    const res = await apiGet('/api/properties');
    const rows = Array.isArray(res?.data) ? res.data : [];
    return rows.map(mapApiPropertyToClient);
  },

  getAllProperties: async (): Promise<Property[]> => {
    await migrateLocalToMySQLIfNeeded();
    const res = await apiGet('/api/properties');
    const rows = Array.isArray(res?.data) ? res.data : [];
    return rows.map(mapApiPropertyToClient);
  },

  getAllPropertiesAdmin: async (): Promise<Property[]> => {
    await migrateLocalToMySQLIfNeeded();
    const res = await apiGet('/api/properties/admin');
    const rows = Array.isArray(res?.data) ? res.data : [];
    return rows.map(mapApiPropertyToClient);
  },

  getPropertyById: async (id: string): Promise<Property | null> => {
    const res = await apiGet(`/api/properties/${encodeURIComponent(id)}`);
    if (!res?.success) return null;
    return mapApiPropertyToClient(res.data);
  },

  createProperty: async (property: Omit<Property, 'id' | 'update_at'>): Promise<Property | null> => {
    const payload = {
      title: property.title || '',
      description: property.description || '',
      price: property.price || 0,
      bedrooms: property.bedrooms || 0,
      sqft: property.squareFeet || property.sqft || 0,
      address: property.address || '',
      city: property.city || '',
      state: property.state || 'TX',
      zip_code: property.zipCode || property.zip_code || '',
      lat: property.lat || 0,
      lng: property.lng || 0,
      status: property.status || 'available',
      build_plan_url: property.build_plan_url || '',
      published: property.published !== false,
    };
    const res = await apiJson('/api/properties', 'POST', payload);
    const id = String(res?.data?.id);
    return await DatabaseService.getPropertyById(id);
  },

  updateProperty: async (id: string, updates: Partial<Property>): Promise<Property | null> => {
    const payload: Record<string, any> = {};
    const assignIf = (key: string, value: any) => { if (value !== undefined) payload[key] = value; };
    assignIf('title', updates.title);
    assignIf('description', updates.description);
    assignIf('price', updates.price);
    assignIf('bedrooms', updates.bedrooms);
    assignIf('sqft', updates.squareFeet ?? updates.sqft);
    assignIf('address', updates.address);
    assignIf('city', updates.city);
    assignIf('state', updates.state);
    assignIf('zip_code', updates.zipCode ?? updates.zip_code);
    assignIf('lat', updates.lat);
    assignIf('lng', updates.lng);
    assignIf('status', updates.status);
    assignIf('build_plan_url', updates.build_plan_url);
    assignIf('published', updates.published);

    await apiJson(`/api/properties/${encodeURIComponent(id)}`, 'PUT', payload);
    return await DatabaseService.getPropertyById(id);
  },

  deleteProperty: async (id: string): Promise<boolean> => {
    try {
      await apiJson(`/api/properties/${encodeURIComponent(id)}`, 'DELETE');
      return true;
    } catch (e) {
      return false;
    }
  },

  createLead: async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead | null> => {
    try {
      const res = await apiJson('/api/leads', 'POST', lead);
      return res?.data || null;
    } catch (e) {
      return null;
    }
  },

  getLeadsByProperty: async (_propertyId: string): Promise<Lead[]> => {
    // Not implemented on backend yet
    return [];
  },

  getAllSales: async (): Promise<Sale[]> => {
    try {
      const res = await apiGet('/api/sales');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  getCurrentActiveSale: async (): Promise<Sale | null> => {
    const sales = await DatabaseService.getAllSales();
    return sales.length > 0 ? sales[0] : null;
  },

  getSetting: async (_key: string): Promise<string | null> => {
    // No settings API yet; default behavior
    return 'show';
  },

  updateSetting: async (_key: string, _value: string, _description?: string): Promise<boolean> => {
    // No settings API yet; noop
    return true;
  },

  getSoldPropertyVisibility: async (): Promise<'hide' | 'show'> => {
    return 'show';
  },

  initializeDefaultSettings: async (): Promise<void> => {
    // No-op until settings endpoints exist
  },

  createSale: async (_sale: Omit<Sale, 'id' | 'created_at'>): Promise<Sale | null> => {
    // Not implemented; return null to indicate unsupported
    return null;
  },

  uploadImage: async (file: File, propertyId: string, caption: string = '', order: number = 0): Promise<string | null> => {
    try {
      const fileUrl = await uploadFile(file);
      await apiJson(`/api/properties/${encodeURIComponent(propertyId)}/images`, 'POST', {
        image_url: fileUrl.replace(API_BASE, ''),
        caption,
        order,
      });
      return fileUrl;
    } catch (e) {
      return null;
    }
  },

  uploadFloorPlan: async (file: File, propertyId: string): Promise<string | null> => {
    try {
      const fileUrl = await uploadFile(file);
      await DatabaseService.updateProperty(propertyId, { build_plan_url: fileUrl });
      return fileUrl;
    } catch (e) {
      return null;
    }
  },

  deleteImage: async (imageId: string): Promise<boolean> => {
    try {
      await apiJson(`/api/images/${encodeURIComponent(imageId)}`, 'DELETE');
      return true;
    } catch (e) {
      return false;
    }
  },

  getAllImages: async (): Promise<ImageModel[]> => {
    // Not needed currently; use getImagesByProperty
    return [];
  },

  getImagesByProperty: async (propertyId: string): Promise<ImageModel[]> => {
    try {
      const res = await apiGet(`/api/properties/${encodeURIComponent(propertyId)}/images`);
      const rows: any[] = Array.isArray(res?.data) ? res.data : [];
      return rows.map((r) => ({
        id: String(r.id),
        property_id: String(r.property_id),
        image_url: toAbsoluteUrl(r.image_url),
        caption: r.caption || '',
        order: parseNumber(r.order) ?? 0,
        created_at: r.created_at,
      }));
    } catch (e) {
      return [];
    }
  },

  getAllCommunities: async (): Promise<Community[]> => {
    try {
      const res = await apiGet('/api/communities');
      return Array.isArray(res?.data) ? res.data : [];
    } catch (e) {
      return [];
    }
  },

  getCommunityById: async (_id: string): Promise<Community | null> => {
    // No per-id endpoint; consumer can filter client-side if needed
    return null;
  },

  createCommunity: async (_community: Omit<Community, 'id'>): Promise<Community | null> => {
    return null;
  },

  updateCommunity: async (_id: string, _updates: Partial<Community>): Promise<Community | null> => {
    return null;
  },

  deleteCommunity: async (_id: string): Promise<boolean> => {
    return false;
  },

  createSampleProperties: async (): Promise<void> => {
    // No-op; properties are managed via admin UI
  },

  createSampleSales: async (): Promise<void> => {
    // No-op
  },
};

export default DatabaseService;
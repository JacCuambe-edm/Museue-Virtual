const API_BASE = import.meta.env.VITE_API_BASE || '/api';

interface ApiResponse<T> {
    data?: T;
    error?: string;
}

function getToken(): string | null {
    return localStorage.getItem('museu_token');
}

function setToken(token: string): void {
    localStorage.setItem('museu_token', token);
}

function removeToken(): void {
    localStorage.removeItem('museu_token');
}

function getUser(): any | null {
    const user = localStorage.getItem('museu_user');
    return user ? JSON.parse(user) : null;
}

function setUser(user: any): void {
    localStorage.setItem('museu_user', JSON.stringify(user));
}

function removeUser(): void {
    localStorage.removeItem('museu_user');
}

async function request<T>(method: string, path: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body && (method === 'POST' || method === 'PUT')) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE}${path}`, config);

    if (!response.ok) {
        if (response.status === 401) {
            removeToken();
            removeUser();
            window.location.href = '/admin/login';
        }
        const errorData = await response.json().catch(() => ({ error: 'Erro de rede' }));
        throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return response.json();
}

export const api = {
    // Auth
    login: async (email: string, password: string) => {
        const data = await request<{ token: string; user: any }>('POST', '/auth/login', { email, password });
        setToken(data.token);
        setUser(data.user);
        return data;
    },

    logout: () => {
        removeToken();
        removeUser();
    },

    getMe: () => request<any>('GET', '/auth/me'),
    forgotPassword: (email: string) => request<any>('POST', '/auth/forgot-password', { email }),

    isAuthenticated: () => !!getToken(),
    getCurrentUser: getUser,

    // Articles
    getArticles: (params?: { category?: string; limit?: number }) => {
        const query = new URLSearchParams();
        if (params?.category) query.set('category', params.category);
        if (params?.limit) query.set('limit', params.limit.toString());
        const qs = query.toString();
        return request<any[]>('GET', `/articles${qs ? '?' + qs : ''}`);
    },
    getArticle: (id: number) => request<any>('GET', `/articles/${id}`),
    createArticle: (data: any) => request<any>('POST', '/articles', data),
    updateArticle: (id: number, data: any) => request<any>('PUT', `/articles/${id}`, data),
    deleteArticle: (id: number) => request<any>('DELETE', `/articles/${id}`),

    // Testemunhos
    getTestemunhos: () => request<any[]>('GET', '/testemunhos'),
    getTestemunho: (id: number) => request<any>('GET', `/testemunhos/${id}`),
    createTestemunho: (data: any) => request<any>('POST', '/testemunhos', data),
    updateTestemunho: (id: number, data: any) => request<any>('PUT', `/testemunhos/${id}`, data),
    deleteTestemunho: (id: number) => request<any>('DELETE', `/testemunhos/${id}`),

    // Patrimonios
    getPatrimonios: (params?: { area_negocio?: string; regiao?: string }) => {
        const query = new URLSearchParams();
        if (params?.area_negocio) query.set('area_negocio', params.area_negocio);
        if (params?.regiao) query.set('regiao', params.regiao);
        const qs = query.toString();
        return request<any[]>('GET', `/patrimonios${qs ? '?' + qs : ''}`);
    },
    getPatrimonio: (id: number) => request<any>('GET', `/patrimonios/${id}`),
    createPatrimonio: (data: any) => request<any>('POST', '/patrimonios', data),
    updatePatrimonio: (id: number, data: any) => request<any>('PUT', `/patrimonios/${id}`, data),
    deletePatrimonio: (id: number) => request<any>('DELETE', `/patrimonios/${id}`),

    // Exposicoes
    getExposicoes: () => request<any[]>('GET', '/exposicoes'),
    getExposicao: (id: number) => request<any>('GET', `/exposicoes/${id}`),
    createExposicao: (data: any) => request<any>('POST', '/exposicoes', data),
    updateExposicao: (id: number, data: any) => request<any>('PUT', `/exposicoes/${id}`, data),
    deleteExposicao: (id: number) => request<any>('DELETE', `/exposicoes/${id}`),

    // Eventos
    getEventos: () => request<any[]>('GET', '/eventos'),
    getEvento: (id: number) => request<any>('GET', `/eventos/${id}`),
    createEvento: (data: any) => request<any>('POST', '/eventos', data),
    updateEvento: (id: number, data: any) => request<any>('PUT', `/eventos/${id}`, data),
    deleteEvento: (id: number) => request<any>('DELETE', `/eventos/${id}`),

    // Tags
    getTags: () => request<any[]>('GET', '/tags'),
    createTag: (data: any) => request<any>('POST', '/tags', data),
    deleteTag: (id: number) => request<any>('DELETE', `/tags/${id}`),

    // Comments
    getComments: (type: string, id: number) => request<any[]>('GET', `/comments/${type}/${id}`),
    createComment: (type: string, id: number, data: any) => request<any>('POST', `/comments/${type}/${id}`, data),
    getPendingComments: () => request<any[]>('GET', '/comments/admin/pending'),
    getAllComments: () => request<any[]>('GET', '/comments/admin/all'),
    updateCommentStatus: (id: number, status: string) => request<any>('PUT', `/comments/admin/${id}/status`, { status }),
    deleteComment: (id: number) => request<any>('DELETE', `/comments/admin/${id}`),

    // Metrics
    getMetrics: (type: string, id: number) => request<any>('GET', `/metrics/${type}/${id}`),
    recordView: (type: string, id: number) => request<any>('POST', `/metrics/${type}/${id}/view`),
    recordLike: (type: string, id: number) => request<any>('POST', `/metrics/${type}/${id}/like`),

    // Testimonials
    getTestimonials: () => request<any[]>('GET', '/testimonials'),
    createTestimonial: (data: any) => request<any>('POST', '/testimonials', data),
    deleteTestimonial: (id: number) => request<any>('DELETE', `/testimonials/${id}`),

    // Users
    getUsers: () => request<any[]>('GET', '/users'),
    createUser: (data: any) => request<any>('POST', '/users', data),
    updateUser: (id: number, data: any) => request<any>('PUT', `/users/${id}`, data),
    deleteUser: (id: number) => request<any>('DELETE', `/users/${id}`),
    updateProfile: async (data: any) => {
        const result = await request<any>('PUT', '/auth/profile', data);
        if (result.user) setUser(result.user);
        return result;
    },
    updatePassword: (data: any) => request<any>('PUT', '/auth/password', data),

    // Artefatos
    getArtefatos: (params?: { area_negocio?: string; categoria?: string }) => {
        const query = new URLSearchParams();
        if (params?.area_negocio) query.set('area_negocio', params.area_negocio);
        if (params?.categoria) query.set('categoria', params.categoria);
        const qs = query.toString();
        return request<any[]>('GET', `/artefatos${qs ? '?' + qs : ''}`);
    },
    getArtefato: (id: number) => request<any>('GET', `/artefatos/${id}`),
    createArtefato: (data: any) => request<any>('POST', '/artefatos', data),
    updateArtefato: (id: number, data: any) => request<any>('PUT', `/artefatos/${id}`, data),
    deleteArtefato: (id: number) => request<any>('DELETE', `/artefatos/${id}`),

    // Dashboard
    getDashboardStats: () => request<any>('GET', '/dashboard/stats'),
    getDashboardChartData: () => request<any[]>('GET', '/dashboard/chart-data'),
    getAnalyticsDetails: (range?: string) => request<any>('GET', `/dashboard/analytics-details${range ? `?range=${range}` : ''}`),

    // Logs / Session Tracking
    startSession: (data: { session_id: string; referrer?: string; page_path?: string; page_title?: string }) =>
        request<any>('POST', '/logs/session', data),
    logPage: (data: { session_id: string; page_path: string; page_title?: string; prev_page_id?: number; time_spent_seconds?: number }) =>
        request<any>('POST', '/logs/page', data),
    endSession: (data: { session_id: string; duration_seconds: number; last_page_id?: number; last_page_time?: number }) =>
        request<any>('POST', '/logs/session/end', data),
    getLogsSummary: () => request<any>('GET', '/logs/summary'),
    getLogsSessions: (params?: { page?: number; limit?: number; range?: string; device?: string; search?: string }) => {
        const query = new URLSearchParams();
        if (params?.page)   query.set('page',   String(params.page));
        if (params?.limit)  query.set('limit',  String(params.limit));
        if (params?.range)  query.set('range',  params.range);
        if (params?.device) query.set('device', params.device);
        if (params?.search) query.set('search', params.search);
        const qs = query.toString();
        return request<any>('GET', `/logs/sessions${qs ? '?' + qs : ''}`);
    },
    getSessionPages: (session_id: string) => request<any[]>('GET', `/logs/session/${session_id}/pages`),
    getLogsExportUrl: (range = '30d') => `${API_BASE}/logs/export?range=${range}`,

    // Search
    search: (q: string) => request<any[]>('GET', `/search?q=${encodeURIComponent(q)}`),

    // File Upload (Multipart Form Data)
    uploadImage: async (file: File) => {
        const token = getToken();
        const formData = new FormData();
        formData.append('image', file);

        const config: RequestInit = {
            method: 'POST',
            body: formData,
        };

        if (token) {
            config.headers = { 'Authorization': `Bearer ${token}` };
        }

        const response = await fetch(`${API_BASE}/upload`, config);

        if (!response.ok) {
            if (response.status === 401) {
                removeToken();
                removeUser();
                window.location.href = '/admin/login';
            }
            const errorData = await response.json().catch(() => ({ error: 'Upload falhou' }));
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        return response.json();
    },
};

export default api;

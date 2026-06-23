import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/apiClient';

function generateSessionId(): string {
    return 'sess_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 9);
}

function getPageTitle(path: string): string {
    const map: Record<string, string> = {
        '/': 'Página Inicial',
        '/sobre-museu': 'Sobre o Museu',
        '/apresentacao-empresa': 'Apresentação da Empresa',
        '/geracao': 'Geração',
        '/transporte': 'Transporte',
        '/distribuicao': 'Distribuição',
        '/comercial': 'Comercial',
        '/historia-geracao': 'História - Geração',
        '/historia-transporte': 'História - Transporte',
        '/historia-distribuicao': 'História - Distribuição',
        '/historia-comercializacao': 'História - Comercialização',
        '/galeria-presidentes': 'Galeria dos Presidentes',
        '/patrimonio-geracao': 'Património - Geração',
        '/patrimonio-transporte': 'Património - Transporte',
        '/patrimonio-distribuicao': 'Património - Distribuição',
        '/patrimonio-comercial': 'Património - Comercial',
        '/transmissao-sul': 'Transmissão Sul',
        '/transmissao-centro': 'Transmissão Centro',
        '/transmissao-norte': 'Transmissão Norte',
        '/exposicoes': 'Exposições',
        '/artefatos-geracao': 'Artefatos - Geração',
        '/artefatos-transporte': 'Artefatos - Transporte',
        '/artefatos-distribuicao': 'Artefatos - Distribuição',
        '/artefatos-comercial': 'Artefatos - Comercial',
        '/timeline': 'Linha do Tempo',
    };
    if (map[path]) return map[path];
    if (path.startsWith('/artigo/')) return 'Artigo';
    if (path.startsWith('/patrimonio/')) return 'Património - Detalhe';
    if (path.startsWith('/exposicao/')) return 'Exposição - Detalhe';
    if (path.startsWith('/artefato/')) return 'Artefato - Detalhe';
    if (path.startsWith('/evento/')) return 'Evento - Detalhe';
    return path;
}

const SessionTracker: React.FC = () => {
    const location = useLocation();
    const sessionIdRef = useRef<string>('');
    const sessionStartRef = useRef<number>(0);
    const currentPageIdRef = useRef<number | null>(null);
    const currentPageStartRef = useRef<number>(0);

    // Skip tracking for admin pages
    const isAdmin = location.pathname.startsWith('/admin');

    useEffect(() => {
        if (isAdmin) return;

        // Get or create session ID
        let sid = sessionStorage.getItem('_museu_sid');
        if (!sid) {
            sid = generateSessionId();
            sessionStorage.setItem('_museu_sid', sid);
        }
        sessionIdRef.current = sid;
        sessionStartRef.current = Date.now();
        currentPageStartRef.current = Date.now();

        const referrer = document.referrer || '';

        api.startSession({
            session_id: sid,
            referrer,
            page_path: location.pathname,
            page_title: getPageTitle(location.pathname),
        }).then((res: any) => {
            if (res?.page_visit_id) currentPageIdRef.current = res.page_visit_id;
        }).catch(() => {});

        const handleUnload = () => {
            const duration = Math.round((Date.now() - sessionStartRef.current) / 1000);
            const pageTime = Math.round((Date.now() - currentPageStartRef.current) / 1000);
            // Use sendBeacon for reliability on unload
            const payload = JSON.stringify({
                session_id: sessionIdRef.current,
                duration_seconds: duration,
                last_page_id: currentPageIdRef.current,
                last_page_time: pageTime,
            });
            navigator.sendBeacon('/api/logs/session/end', new Blob([payload], { type: 'application/json' }));
        };

        window.addEventListener('beforeunload', handleUnload);
        return () => window.removeEventListener('beforeunload', handleUnload);
    }, []); // Only on mount

    useEffect(() => {
        if (isAdmin || !sessionIdRef.current) return;

        const timeSpent = Math.round((Date.now() - currentPageStartRef.current) / 1000);
        const prevPageId = currentPageIdRef.current;
        currentPageStartRef.current = Date.now();
        currentPageIdRef.current = null;

        api.logPage({
            session_id: sessionIdRef.current,
            page_path: location.pathname,
            page_title: getPageTitle(location.pathname),
            prev_page_id: prevPageId ?? undefined,
            time_spent_seconds: timeSpent,
        }).then((res: any) => {
            if (res?.page_visit_id) currentPageIdRef.current = res.page_visit_id;
        }).catch(() => {});
    }, [location.pathname]);

    return null;
};

export default SessionTracker;

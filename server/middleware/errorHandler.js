function errorHandler(err, req, res, _next) {
    console.error('❌ Error:', err.message);
    console.error(err.stack);

    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Registo duplicado' });
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.status(400).json({ error: 'Referência inválida' });
    }

    const status = err.statusCode || 500;
    const message = err.statusCode ? err.message : 'Erro interno do servidor';

    res.status(status).json({ error: message });
}

function notFound(req, res) {
    res.status(404).json({ error: `Rota não encontrada: ${req.method} ${req.path}` });
}

module.exports = { errorHandler, notFound };

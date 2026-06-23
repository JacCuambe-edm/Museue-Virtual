#!/bin/bash
# =============================================================
# Script de Deploy — Museu Virtual da EDM
# Usar no servidor Ubuntu após o primeiro clone do repositório
# =============================================================
set -e

APP_DIR="/var/www/museu"
SERVICE_NAME="museu-virtual"
NODE_MIN="20"

echo ""
echo "==========================================="
echo " Deploy — Museu Virtual da EDM"
echo "==========================================="
echo ""

# ── 1. Verificar Node.js ──────────────────────────────────────
echo "▶ A verificar Node.js..."
NODE_VER=0
if command -v node &>/dev/null; then
  NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
fi
if [ "$NODE_VER" -lt "$NODE_MIN" ]; then
  echo "  Node.js $NODE_VER insuficiente (requer >= $NODE_MIN). A instalar Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
echo "  ✅ Node.js $(node --version)"

# ── 2. Ficheiro .env ─────────────────────────────────────────
echo "▶ A verificar .env..."
if [ ! -f "$APP_DIR/.env" ]; then
  echo "  A criar .env a partir de .env.example..."
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  JWT=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
  sed -i "s/coloque_aqui_uma_chave_aleatoria_longa_e_segura/$JWT/" "$APP_DIR/.env"
  echo "  ✅ .env criado com JWT_SECRET aleatório"
  echo ""
  echo "  ⚠️  Confirme os valores em: sudo nano $APP_DIR/.env"
  echo ""
fi

# ── 3. Instalar dependências do frontend ──────────────────────
echo "▶ A instalar dependências do frontend..."
cd "$APP_DIR"
npm ci --prefer-offline
echo "  ✅ Dependências do frontend instaladas"

# ── 4. Build do frontend ──────────────────────────────────────
echo "▶ A compilar frontend React..."
npm run build
echo "  ✅ Frontend compilado em dist/"

# ── 5. Instalar dependências do backend ───────────────────────
echo "▶ A instalar dependências do backend..."
cd "$APP_DIR/backend"
npm ci --prefer-offline
echo "  ✅ Dependências do backend instaladas"

# ── 6. Criar pasta de uploads ─────────────────────────────────
echo "▶ A criar pasta de uploads..."
mkdir -p "$APP_DIR/backend/uploads"
chmod 755 "$APP_DIR/backend/uploads"
echo "  ✅ backend/uploads/ pronta"

# ── 7. Permissões da pasta ────────────────────────────────────
echo "▶ A ajustar permissões..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"
sudo chmod 664 "$APP_DIR/backend/museu.db" 2>/dev/null || true
sudo chmod 664 "$APP_DIR/.env"
echo "  ✅ Permissões ajustadas"

# ── 8. Instalar serviço systemd ───────────────────────────────
echo "▶ A instalar serviço systemd..."

sudo cp "$APP_DIR/museu-virtual.service" /etc/systemd/system/${SERVICE_NAME}.service
sudo systemctl daemon-reload
sudo systemctl enable "${SERVICE_NAME}"

if sudo systemctl is-active --quiet "${SERVICE_NAME}"; then
  sudo systemctl restart "${SERVICE_NAME}"
  echo "  ✅ Serviço reiniciado"
else
  sudo systemctl start "${SERVICE_NAME}"
  echo "  ✅ Serviço iniciado"
fi

# ── 9. Verificar estado do serviço ────────────────────────────
echo ""
echo "▶ Estado do serviço systemd:"
sudo systemctl status "${SERVICE_NAME}" --no-pager -l | head -20

# ── 10. Verificar saúde da API ────────────────────────────────
echo ""
echo "▶ A verificar saúde da API..."
sleep 4
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5050/api/health)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ API a responder em http://127.0.0.1:5050/api/health"
else
  echo "  ⚠️  API não responde (código $HTTP_CODE)"
  echo "     Ver logs: sudo journalctl -u ${SERVICE_NAME} -n 50"
fi

# ── 11. Activar módulos Apache ────────────────────────────────
echo ""
echo "▶ A configurar Apache..."
sudo a2enmod proxy proxy_http rewrite headers 2>/dev/null || true
sudo cp "$APP_DIR/apache/museu.conf" /etc/apache2/sites-available/museu.conf
sudo a2ensite museu.conf

echo "  A testar configuração Apache..."
if sudo apachectl configtest; then
  sudo systemctl reload apache2
  echo "  ✅ Apache recarregado"
else
  echo "  ❌ Erro na configuração Apache"
  exit 1
fi

echo ""
echo "==========================================="
echo " ✅ Deploy concluído!"
echo "==========================================="
echo ""
echo " Aplicação:  https://museu.edm.co.mz"
echo ""
echo " Gerir o serviço:"
echo "   sudo systemctl status  museu-virtual"
echo "   sudo systemctl restart museu-virtual"
echo "   sudo systemctl stop    museu-virtual"
echo "   sudo journalctl -u museu-virtual -f     (logs em tempo real)"
echo ""
echo " Credenciais iniciais:"
echo "   Email: admin@museu.edm.co.mz"
echo "   Senha: admin@edm2025"
echo "   ⚠️  Altere após o primeiro login!"
echo ""
echo " HTTPS (após verificar que HTTP funciona):"
echo "   sudo apt install certbot python3-certbot-apache"
echo "   sudo certbot --apache -d museu.edm.co.mz"
echo ""

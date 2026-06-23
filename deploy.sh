#!/bin/bash
# =============================================================
# Script de Deploy — Museu Virtual da EDM
# Usar no servidor Ubuntu após o primeiro clone do repositório
# =============================================================
set -e

APP_DIR="/var/www/museu"
NODE_MIN="20"

echo ""
echo "==========================================="
echo " Deploy — Museu Virtual da EDM"
echo "==========================================="
echo ""

# ── 1. Verificar Node.js ──────────────────────────────────────
echo "▶ A verificar Node.js..."
if ! command -v node &>/dev/null; then
  echo "  Node.js não encontrado. A instalar via NodeSource..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
NODE_VER=$(node -e "process.stdout.write(process.versions.node.split('.')[0])")
if [ "$NODE_VER" -lt "$NODE_MIN" ]; then
  echo "  ERRO: Node.js $NODE_VER encontrado mas requer >= $NODE_MIN"
  exit 1
fi
echo "  ✅ Node.js $(node --version)"

# ── 2. Verificar PM2 ─────────────────────────────────────────
echo "▶ A verificar PM2..."
if ! command -v pm2 &>/dev/null; then
  echo "  A instalar PM2..."
  sudo npm install -g pm2
fi
echo "  ✅ PM2 $(pm2 --version)"

# ── 3. Ficheiro .env ─────────────────────────────────────────
echo "▶ A verificar .env..."
if [ ! -f "$APP_DIR/.env" ]; then
  echo "  A criar .env a partir de .env.example..."
  cp "$APP_DIR/.env.example" "$APP_DIR/.env"
  # Gerar JWT_SECRET aleatório
  JWT=$(node -e "console.log(require('crypto').randomBytes(48).toString('hex'))")
  sed -i "s/coloque_aqui_uma_chave_aleatoria_longa_e_segura/$JWT/" "$APP_DIR/.env"
  echo "  ✅ .env criado com JWT_SECRET aleatório"
  echo ""
  echo "  ⚠️  IMPORTANTE: edite $APP_DIR/.env e confirme os valores antes de continuar"
  echo "      sudo nano $APP_DIR/.env"
  echo ""
fi

# ── 4. Instalar dependências do frontend ──────────────────────
echo "▶ A instalar dependências do frontend..."
cd "$APP_DIR"
npm ci --prefer-offline
echo "  ✅ Dependências do frontend instaladas"

# ── 5. Build do frontend ──────────────────────────────────────
echo "▶ A compilar frontend React..."
npm run build
echo "  ✅ Frontend compilado em dist/"

# ── 6. Instalar dependências do backend ───────────────────────
echo "▶ A instalar dependências do backend..."
cd "$APP_DIR/backend"
npm ci --prefer-offline
echo "  ✅ Dependências do backend instaladas"

# ── 7. Criar pasta de uploads ─────────────────────────────────
echo "▶ A criar pasta de uploads..."
mkdir -p "$APP_DIR/backend/uploads"
chmod 755 "$APP_DIR/backend/uploads"
echo "  ✅ backend/uploads/ pronta"

# ── 8. Permissões da pasta ────────────────────────────────────
echo "▶ A ajustar permissões..."
sudo chown -R www-data:www-data "$APP_DIR"
sudo chmod -R 755 "$APP_DIR"
# A base de dados precisa de permissão de escrita
sudo chmod 664 "$APP_DIR/backend/museu.db" 2>/dev/null || true
echo "  ✅ Permissões ajustadas"

# ── 9. Iniciar/Reiniciar com PM2 ──────────────────────────────
echo "▶ A iniciar aplicação com PM2..."
cd "$APP_DIR"
# Carregar .env no ambiente do PM2
export $(grep -v '^#' .env | xargs)

if pm2 list | grep -q "museu-virtual"; then
  pm2 restart museu-virtual --update-env
  echo "  ✅ Aplicação reiniciada"
else
  pm2 start ecosystem.config.cjs --env production
  echo "  ✅ Aplicação iniciada"
fi

# Guardar configuração PM2 para arrancar com o sistema
pm2 save
sudo pm2 startup systemd -u "$USER" --hp "$HOME" 2>/dev/null || true

# ── 10. Apache ────────────────────────────────────────────────
echo ""
echo "▶ A configurar Apache..."
# Activar módulos necessários
sudo a2enmod proxy proxy_http rewrite headers 2>/dev/null || true

# Copiar e activar configuração do site
sudo cp "$APP_DIR/apache/museu.conf" /etc/apache2/sites-available/museu.conf
sudo a2ensite museu.conf

# Testar configuração
echo "  A testar configuração Apache..."
if sudo apachectl configtest; then
  sudo systemctl reload apache2
  echo "  ✅ Apache recarregado com sucesso"
else
  echo "  ❌ Erro na configuração Apache — verificar acima"
  exit 1
fi

# ── 11. Verificar saúde da API ────────────────────────────────
echo ""
echo "▶ A verificar saúde da API..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:5050/api/health)
if [ "$HTTP_CODE" = "200" ]; then
  echo "  ✅ API a responder em http://127.0.0.1:5050/api/health"
else
  echo "  ⚠️  API não responde (código $HTTP_CODE) — verificar logs: pm2 logs museu-virtual"
fi

echo ""
echo "==========================================="
echo " ✅ Deploy concluído!"
echo "==========================================="
echo ""
echo " Aplicação:   https://museu.edm.co.mz"
echo " API health:  http://127.0.0.1:5050/api/health"
echo " Logs PM2:    pm2 logs museu-virtual"
echo " Status PM2:  pm2 status"
echo ""
echo " Credenciais iniciais de admin:"
echo "   Email:  admin@museu.edm.co.mz"
echo "   Senha:  admin@edm2025"
echo "   ⚠️  Altere a senha após o primeiro login!"
echo ""
echo " HTTPS (após verificar que o HTTP funciona):"
echo "   sudo apt install certbot python3-certbot-apache"
echo "   sudo certbot --apache -d museu.edm.co.mz"
echo ""

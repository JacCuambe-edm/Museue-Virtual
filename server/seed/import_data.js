const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const { getPool } = require('../config/database');

async function importData() {
    console.log('🚀 Starting data import process...\n');

    const pool = getPool();
    const dataDir = path.join(__dirname, '..', '..', 'Dados para inserir');

    console.log('Using DB:', process.env.DB_NAME);

    try {
        // 1. IMPORT USERS
        console.log('👤 Importing Users...');
        const usersFile = path.join(dataDir, 'export_All-Users_2026-03-14_06-07-00.ndjson');
        if (fs.existsSync(usersFile)) {
            const userLines = fs.readFileSync(usersFile, 'utf8').split('\n').filter(line => line.trim());
            const passwordHash = await bcrypt.hash('admin123', 10);
            
            for (const line of userLines) {
                const data = JSON.parse(line);
                const dob = data['Date of birth_USER'] ? new Date(data['Date of birth_USER']).toISOString().slice(0, 19).replace('T', ' ') : null;
                
                const [result] = await pool.query(
                    'INSERT IGNORE INTO users (email, password_hash, bio, category, address, date_of_birth, allow_notifications, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        data.email, 
                        passwordHash, 
                        data.Bio_USER || '', 
                        data.Categori || '', 
                        data.Address_USER || '', 
                        dob, 
                        data['Allow notifications_USER'] === 'true', 
                        'viewer'
                    ]
                );
                console.log(`   - User ${data.email}: ${result.affectedRows > 0 ? 'Inserted (ID: ' + result.insertId + ')' : 'Ignored (exists)'}`);
            }
            console.log(`   ✅ Users process completed`);
        }

        // 2. IMPORT ARTICLES
        console.log('📰 Importing Articles...');
        const articlesFile = path.join(dataDir, 'export_All-Articles_2026-03-14_06-05-41.ndjson');
        if (fs.existsSync(articlesFile)) {
            const articleLines = fs.readFileSync(articlesFile, 'utf8').split('\n').filter(line => line.trim());
            for (const line of articleLines) {
                const data = JSON.parse(line);
                const title = data['Short Description '] || 'Sem título'; // Fallback
                
                const [result] = await pool.query(
                    'INSERT INTO articles (title, short_description, body_text, body_text2, body_text3, category, added_to_favorites) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [
                        title,
                        data['Short Description '] || '',
                        data['Body text'] || '',
                        data['Body text2'] || '',
                        data['Body text3'] || '',
                        data.Category || '',
                        data['Added to favorites'] || ''
                    ]
                );
                console.log(`   - Article: ${title} (ID: ${result.insertId})`);
            }
            console.log(`   ✅ Articles process completed`);
        }

        // 3. IMPORT ARTEFATOS
        console.log('🏺 Importing Artefatos...');
        const artefatosFile = path.join(dataDir, 'export_All-artefatos-modified_2026-03-14_06-05-02.ndjson');
        if (fs.existsSync(artefatosFile)) {
            const artefatoLines = fs.readFileSync(artefatosFile, 'utf8').split('\n').filter(line => line.trim());
            for (const line of artefatoLines) {
                const data = JSON.parse(line);
                let title = 'Artefato sem título';
                if (data['Descrição']) {
                    const firstSentence = data['Descrição'].split(/[.!?]/)[0];
                    title = firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
                }

                const [result] = await pool.query(
                    'INSERT INTO artefatos (titulo, categoria, data_aquisicao, descricao, dimensoes, estado, foto, localizacao, material, origem, responsavel) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        title,
                        data.Categoria || '',
                        data.data_aquisicao || '',
                        data['Descrição'] || '',
                        data['Dimensões'] || '',
                        data['Estado de conservação'] || '',
                        data.foto || '',
                        data.localizacao_atual || '',
                        data.Materiais || '',
                        data.Origem || '',
                        data['Responsável'] || ''
                    ]
                );
                console.log(`   - Artefato: ${title} (ID: ${result.insertId})`);
            }
            console.log(`   ✅ Artefatos process completed`);
        }

        // 4. IMPORT PATRIMONIOS
        console.log('🏗️ Importing Patrimonios...');
        const patrimoniosFile = path.join(dataDir, 'export_All-patrimonios-modified_2026-03-14_05-59-21.ndjson');
        if (fs.existsSync(patrimoniosFile)) {
            const patrimonioLines = fs.readFileSync(patrimoniosFile, 'utf8').split('\n').filter(line => line.trim());
            for (const line of patrimonioLines) {
                const data = JSON.parse(line);
                
                const [result] = await pool.query(
                    'INSERT INTO patrimonios (nome, sigla, area_negocio, localizacao, ano_entrada_servico, potencia_instalada_inicial, potencia_instalada_actual, niveis_tensao, transformadores_potencia, barramento_inicial, barramento_final, capacidade_linha, condutor, circuito, comprimento, tipo_postes, tipo_isoladores, cabo_guarda, foto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                        data.Titulo || 'Sem Nome',
                        data.Substitulo || '',
                        data['Área de Negócio'] || '',
                        data['Localização'] || '',
                        data['Ano de entrada em serviço'] || '',
                        data['Potência instalada aquando entrada em serviço'] || '',
                        data['Potência instalada actual'] || '',
                        data['Níveis de tensão'] || '',
                        data['Transformadores de potência'] || '',
                        data['Barramento inicial'] || '',
                        data['Barramento final'] || '',
                        data['Capacidade da linha'] || '',
                        data.Condutor || '',
                        data.Circuito || '',
                        data.Comprimento || '',
                        data['Tipo de postes'] || '',
                        data['Tipo de isoladores'] || '',
                        data['Cabo de guarda'] || '',
                        data['Imagem'] || ''
                    ]
                );
                console.log(`   - Patrimonio: ${data.Titulo} (ID: ${result.insertId})`);
            }
            console.log(`   ✅ Patrimonios process completed`);
        }

        console.log('\n✨ All data successfully imported!');

    } catch (err) {
        console.error('\n❌ Import failed:', err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

importData();

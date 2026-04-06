const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const { initDatabase } = require('../config/database');

async function seed() {
    console.log('🌱 Starting database seed...\n');

    await initDatabase();

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'museu_edm',
        port: parseInt(process.env.DB_PORT || '3306'),
        charset: 'utf8mb4'
    });

    try {
        // Clear existing data (reverse FK order)
        console.log('🗑️  Clearing existing data...');
        await connection.query('SET FOREIGN_KEY_CHECKS = 0');
        const tables = ['replies', 'comments', 'tags', 'testimonials', 'testemunhos', 'patrimonios', 'artefatos', 'exposicoes', 'eventos', 'articles', 'users'];
        for (const table of tables) {
            await connection.query(`TRUNCATE TABLE ${table}`);
        }
        await connection.query('SET FOREIGN_KEY_CHECKS = 1');

        // ========== 1. USERS ==========
        console.log('👤 Seeding users...');
        const adminHash = await bcrypt.hash('admin123', 10);
        const users = [
            { email: 'admin@museu.cd', password_hash: adminHash, bio: 'Administrador do Museu', category: 'Geração , Transporte , Distribuição , Comercial', role: 'admin' },
            { email: 'admin@gmail.com', password_hash: adminHash, bio: 'admin', category: 'Geração , Transporte', role: 'admin' },
            { email: 'adminmuseu@edm.co.mz', password_hash: adminHash, bio: 'N/A', category: 'Geração , Transporte , Distribuição , Comercial , Outros', role: 'admin' },
            { email: 'fernando.machava@edm.co.mz', password_hash: adminHash, bio: 'kjhbj', category: 'Geração', role: 'editor' }
        ];

        for (const u of users) {
            await connection.query(
                'INSERT INTO users (email, password_hash, bio, category, role) VALUES (?, ?, ?, ?, ?)',
                [u.email, u.password_hash, u.bio, u.category, u.role]
            );
        }
        console.log(`   ✅ ${users.length} users inserted`);

        // ========== 2. ARTICLES ==========
        console.log('📰 Seeding articles...');
        const articles = [
            { title: "Rede de Baixa Tensão", short_description: "Lichinga", body_text: "[color=rgb(102, 102, 102)]Com a evolução progressiva da urbe, houve maior demanda que se reflectiu pelas inúmeras solicitações que os consumidores foram fazendo, dali que a edilidade decidiu contrair um crédito bancário que viria aplicar em dois importantes Planos: Aquisição de uma máquina a diesel e a construção da Rede de Distribuição da cidade.[/color]", category: "Distribuição", image3: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745304485630x328580670237779160/IMG_0270.JPG", views: 22 },
            { title: "Evolução Histórica do Fornecimento de Energia Eléctrica", short_description: "Lourenço Marques", body_text: "[justify]O fornecimento de corrente elétrica em Lourenço Marques (atual Maputo) esteve, desde os primórdios, intimamente ligado às actividades comerciais e industriais...[/justify]", category: "Geração", image3: "", views: 35 },
            { title: "A Central Térmica de Maputo", short_description: "CTM", body_text: "A Central Térmica de Maputo - CTM (Antiga Central Térmica de Lourenço Marques) surgiu no quadro das profundas transformações urbanas e económicas...", category: "Geração", image3: "//c53f2b24c4d40c33bcd27707a1b97c49.cdn.bubble.io/f1747485761366x775578358457991800/CTM.png", views: 61 },
            { title: "Fornecimento de Energia Elétrica na Cidade da Beira", short_description: "Origens e Evolução", body_text: "A história do fornecimento de energia elétrica na cidade da Beira remonta ao início do século XX, quando a iluminação pública era assegurada de forma rudimentar por uma fábrica de gelo...", category: "Geração", image3: "", views: 27 },
            { title: "O Sector Comercial da EDM", short_description: "Um Pilar da Ligação com o Cliente", body_text: "Ao longo da sua história, a Electricidade de Moçambique (EDM) consolidou a função comercial como um dos pilares fundamentais...", category: "Comercial", image3: "", views: 22 },
            { title: "Integração da Linha de 275 kV da África do Sul a Maputo", short_description: "Tramsporte", body_text: "Na década de 1980, diante da crescente incapacidade de satisfazer a procura de energia eléctrica nas regiões de Lourenço Marques...", category: "Transporte", image3: "", views: 28 },
            { title: "Fornecimento de Energia eléctrica Manica", short_description: "Primórdios da electrificação em Manica", body_text: "A introdução da energia eléctrica na província de Manica remonta ao período colonial...", category: "Geração", image3: "", views: 13 },
            { title: "Central Hidroeléctrica de Mavuzi", short_description: "Retrospectiva Histórica", body_text: "A construção da Central Hidroeléctrica de Mavuzi constitui um marco importante na história da electrificação na região centro de Moçambique...", category: "Geração", image3: "", views: 7 },
            { title: "Barragem e Central Hidroeléctrica de Chicamba", short_description: "Origens e Expansão (1956–1970)", body_text: "A construção da Barragem de Chicamba inscreve-se no processo de consolidação do sistema hidroeléctrico da região centro de Moçambique...", category: "Geração", image3: "", views: 14 },
            { title: "História da Electrificação na Zambézia", short_description: "Quelimane e Mocuba", body_text: "A introdução da energia eléctrica em Quelimane remonta à década de 1920...", category: "Geração", image3: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745224843323x740071021602093300/Centrais%20Isoladas.JPG", views: 15 },
            { title: "Fornecimento de energia eléctrica em Inhambane", short_description: "Retrospectiva Histórica", body_text: "A cidade de Inhambane, inicialmente um reino absoluto, foi elevada à categoria de vila em 9 de maio de 1761...", category: "Geração", image3: "", views: 3 },
            { title: "Histórico da Electrificação de Cabo Delgado", short_description: "Central Eléctrica de Pemba", body_text: "O processo de electrificação da cidade de Pemba teve início nas vésperas da sua elevação à categoria de cidade...", category: "Geração", image3: "", views: 3 },
            { title: "Histórico do Fornecimento de Energia Eléctrica no Niassa", short_description: "Lichinga e Cuamba", body_text: "O fornecimento de energia eléctrica na província do Niassa teve início ainda no período colonial...", category: "Geração", image3: "", views: 4 },
            { title: "Linha de Transmissão Centro-Norte da EDM", short_description: "Linha Centro-Norte", body_text: "A Linha de Transmissão Eléctrica Centro-Norte representa um dos maiores marcos na consolidação da infra-estrutura energética...", category: "Transporte", image3: "", views: 29 },
            { title: "Criação da Electricidade de Moçambique, Empresa Estatal ", short_description: "EDM, E.E", body_text: "Com a independência nacional alcançada em 1975, Moçambique entrou numa nova fase de reorganização política, económica e social...", category: "", image3: "", views: 3 },
            { title: "Evolução das Actividades Comerciais na EDM", short_description: "Sector da Energia Eléctrica", body_text: "As actividades comerciais ligadas ao fornecimento de energia eléctrica em Moçambique tiveram início sob a gestão dos SMAE...", category: "Comercial", image3: "", views: 40 },
            { title: "Introdução do Sistema de Pré-Pagamento de Electricidade", short_description: "CREDELEC em Moçambique", body_text: "O sistema de pré-pagamento de electricidade em Moçambique, conhecido como CREDELEC, começou a ser concebido no início da década de 1990...", category: "Comercial", image3: "", views: 6 },
            { title: "Projecto de ampliação do sistema de distribuição de energia eléctrica", short_description: "O Projecto Electricidade I", body_text: "O Projecto Electricidade I teve o seu início formal em setembro de 1993...", category: "Distribuição", image3: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745480305025x417261486393909900/501.JPG", views: 20 },
            { title: "Projecto Electricidade II ", short_description: "Ampliação da rede distribuição", body_text: "O Projecto Electricidade II foi concebido como uma extensão estratégica do Projecto Electricidade I...", category: "Distribuição", image3: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745482035439x200349386264349060/12.jpeg", views: 8 },
            { title: "Subestação Nampula 220KV", short_description: "Entrada da Energia da linha de transmissão Centro-Norte a Nampula", body_text: "A subestação Nampula 220KV é a entrada da linha de transmissão Centro-Norte...", category: "Transporte", image3: "//5ceac115bc97b67e4e2c5bc8bf799cc1.cdn.bubble.io/f1746781547839x815099074359881300/071A2965.JPG", views: 22 }
        ];

        for (const a of articles) {
            await connection.query(
                'INSERT INTO articles (title, short_description, body_text, category, image3, views, author_email) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [a.title, a.short_description, a.body_text, a.category, a.image3, a.views, 'fernando.machava@edm.co.mz']
            );
        }
        console.log(`   ✅ ${articles.length} articles inserted`);

        // ========== 3. TESTEMUNHOS ==========
        console.log('🗣️  Seeding testemunhos...');
        const testemunhos = [
            { name: "António Chamusso", message: "António Chamusso ingressou na EDM em 1980, iniciando uma trajetória marcada por coragem, dedicação e profundo envolvimento com a operação técnica da empresa. Atuou por décadas na área de manutenção de subestações e redes, enfrentando desafios em contextos complexos e contribuindo para a expansão da infraestrutura elétrica nacional.", image: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745420634295x985148913551777700/antonio_chamusso.png", department: "", display_order: 2 },
            { name: "João Cumbe", message: "João Cumbe ingressou na EDM em 1980, iniciando uma carreira marcada por dedicação à operação e manutenção de infraestruturas elétricas. Atuou por décadas em áreas técnicas, contribuindo para a expansão e estabilidade da rede elétrica nacional.", image: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745420545583x886215819524998000/joao_cumbe.png", department: "", display_order: 1 },
            { name: "Samuel Checo", message: "Samuel Checo ingressou na EDM em 1982, iniciando uma trajetória marcada por compromisso técnico e dedicação institucional. Atuou por décadas na área de manutenção e operação de subestações, contribuindo diretamente para a estabilidade e segurança da rede elétrica nacional.", image: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745420673756x821909222495173900/samuel_checo.png", department: "", display_order: 3 },
            { name: "Fatima Artur", message: "Fátima Arthur ingressou na EDM em 1981, iniciando uma carreira sólida na área administrativa. Ao longo de mais de 40 anos, apoiou equipas técnicas e contribuiu para o funcionamento interno da empresa com dedicação exemplar.", image: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1745420785636x448454090911649200/fatima_artur.png", department: "", display_order: 4 }
        ];

        for (const t of testemunhos) {
            await connection.query(
                'INSERT INTO testemunhos (name, message, image, department, display_order) VALUES (?, ?, ?, ?, ?)',
                [t.name, t.message, t.image, t.department, t.display_order]
            );
        }
        console.log(`   ✅ ${testemunhos.length} testemunhos inserted`);

        // ========== 4. TESTIMONIALS ==========
        console.log('💬 Seeding testimonials...');
        const testimonials = [
            { nome: "Ananias Thaunde", descricao: "\"As a professional constantly juggling multiple projects, I can't express how thrilled I am with Bubble. The intelligent summarization and natural language processing makes my notes more coherent and saves me hours of time.\"", foto: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744177610743x246095775806020930/Foto%20tipo%20passe.png" },
            { nome: "Jose Aninha", descricao: "\"As a professional constantly juggling multiple projects, I can't express how thrilled I am with Bubble. The intelligent summarization and natural language processing makes my notes more coherent and saves me hours of time.\"", foto: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744177728221x636576675373748400/IMG_20240419_131050_772.jpg" }
        ];

        for (const t of testimonials) {
            await connection.query(
                'INSERT INTO testimonials (nome, descricao, foto) VALUES (?, ?, ?)',
                [t.nome, t.descricao, t.foto]
            );
        }
        console.log(`   ✅ ${testimonials.length} testimonials inserted`);

        // ========== 5. TAGS ==========
        console.log('🏷️  Seeding tags...');
        const uniqueTags = [
            { name: "historia", creator_email: "admin@gmail.com" },
            { name: "Distribuição", creator_email: "admin@gmail.com" },
            { name: "Comercial", creator_email: "admin@gmail.com" },
            { name: "Transporte", creator_email: "admin@gmail.com" },
            { name: "Geração", creator_email: "admin@gmail.com" },
            { name: "EDM", creator_email: "fernando.machava@edm.co.mz" },
            { name: "Fernando", creator_email: "adminmuseu@edm.co.mz" },
            { name: "Machava", creator_email: "fernando.machava@edm.co.mz" },
            { name: "Teste", creator_email: "admin@gmail.com" }
        ];

        for (const t of uniqueTags) {
            await connection.query(
                'INSERT INTO tags (name, creator_email) VALUES (?, ?)',
                [t.name, t.creator_email]
            );
        }
        console.log(`   ✅ ${uniqueTags.length} tags inserted (deduplicated)`);

        // ========== 6. EXPOSICOES ==========
        console.log('🖼️  Seeding exposicoes...');
        const exposicoes = [
            {
                curador: "EDM",
                descricao: "O concurso em Moçambique era relativo a construção da linha de 275KV de Ressano-Garcia a Infulene incluindo a subestação, numa distância de 77 kms...",
                artefatos_expostos: "Telas espositivas",
                foto1: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744622113961x276477185571428960/Servicos_TestService_TransformadordePotencia.jpg",
                foto2: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744623267135x483478175806066900/Exposi%C3%A7%C3%A3o%2045%20anos.JPG",
                data_inicio: "2024-10-19",
                data_fim: "2024-10-21"
            },
            {
                curador: "Fernando Dava",
                descricao: "No âmbito das celebrações dos 45 anos da sua criação, a Electricidade de Moçambique (EDM) promoveu uma Exposição Museológica de carácter comemorativo...",
                artefatos_expostos: "Exposição Museológica",
                foto1: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744705204030x761754455148129700/IMG_0344.JPG",
                foto2: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1744705315796x893468689455008500/IMG_0263.JPG",
                data_inicio: "2022-08-26",
                data_fim: "2022-09-26"
            },
            {
                curador: "EDM",
                descricao: "",
                artefatos_expostos: "Manuais, Exposição fotográfica, artefatos históricos da EDM",
                foto1: "//5ceac115bc97b67e4e2c5bc8bf799cc1.cdn.bubble.io/f1745486610928x660837333775939200/DSC09372.jpg",
                foto2: "//5ceac115bc97b67e4e2c5bc8bf799cc1.cdn.bubble.io/f1745486628983x820146054558674300/DSC09405.jpg",
                data_inicio: "2024-06-08",
                data_fim: "2024-06-09"
            }
        ];

        for (const e of exposicoes) {
            await connection.query(
                'INSERT INTO exposicoes (curador, descricao, artefatos_expostos, foto1, foto2, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [e.curador, e.descricao, e.artefatos_expostos, e.foto1, e.foto2, e.data_inicio, e.data_fim]
            );
        }
        console.log(`   ✅ ${exposicoes.length} exposicoes inserted`);

        // ========== 7. EVENTOS ==========
        console.log('📅 Seeding eventos...');
        const eventos = [
            {
                nome: "Publicar eventos",
                subtitulo: "Publicar eventos",
                foto: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1743843602813x216361189321746750/Post%20design%20social%20media%20flyer%20%E2%80%A2%20NiperKadion%20repost.jpg",
                local_evento: "10/10/2000",
                participantes: "10/10/2000",
                data_inicio: "2000-10-10",
                data_fim: "2000-10-10"
            },
            {
                nome: "Publicar eventos",
                subtitulo: "Publicar eventos",
                foto: "//99feff0db2fbf736fa847654ee83fd1d.cdn.bubble.io/f1743844011705x669920177832742100/Post%20design%20social%20media%20flyer%20%E2%80%A2%20NiperKadion%20repost.jpg",
                local_evento: "10/10/2000",
                participantes: "10/10/2000",
                data_inicio: "2000-10-10",
                data_fim: "2000-10-10"
            }
        ];

        for (const e of eventos) {
            await connection.query(
                'INSERT INTO eventos (nome, subtitulo, foto, local_evento, participantes, data_inicio, data_fim) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [e.nome, e.subtitulo, e.foto, e.local_evento, e.participantes, e.data_inicio, e.data_fim]
            );
        }
        console.log(`   ✅ ${eventos.length} eventos inserted`);

        // ========== 8. PATRIMONIOS ==========
        console.log('🏗️  Seeding patrimonios...');
        const patrimonios = [
            { area_negocio: "Transporte", ano_entrada_servico: "2004", barramento_inicial: "Província de Za", barramento_final: "Província de Za", cabo_guarda: "N/A", capacidade_linha: "70MW", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2005", barramento_inicial: "Cuamba - Niassa", barramento_final: "Cuamba - Niassa", cabo_guarda: "Sim", capacidade_linha: "70MW", circuito: "NA" },
            { area_negocio: "Transporte", ano_entrada_servico: "2019", barramento_inicial: "Cuamba - Niassa", barramento_final: "Cuamba - Niassa", cabo_guarda: "Sim", capacidade_linha: "70MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "Tempo colonial e requalificada em 2003/2004", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1984", barramento_inicial: "Subestação", barramento_final: "Subestação", cabo_guarda: "Não", capacidade_linha: "99MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "1992", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1990", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2011", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2014", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2017", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1984", barramento_inicial: "Nampula Central", barramento_final: "Nampula Central", cabo_guarda: "Sim", capacidade_linha: "84MW", circuito: "NA" },
            { area_negocio: "Transporte", ano_entrada_servico: "1999", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2012", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1984", barramento_inicial: "Monapo", barramento_final: "Monapo", cabo_guarda: "Sim", capacidade_linha: "84MW", circuito: "ACCC" },
            { area_negocio: "Transporte", ano_entrada_servico: "2007", barramento_inicial: "Nampula 220KV", barramento_final: "Nampula 220KV", cabo_guarda: "Sim", capacidade_linha: "70MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "2005", barramento_inicial: "Nampula 220KV", barramento_final: "Nampula 220KV", cabo_guarda: "Sim", capacidade_linha: "77MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "2005", barramento_inicial: "Ancuabe", barramento_final: "Ancuabe", cabo_guarda: "Não", capacidade_linha: "77MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "2015", barramento_inicial: "Nacala", barramento_final: "Nacala", cabo_guarda: "", capacidade_linha: "99MW", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "1988", barramento_inicial: "N/A", barramento_final: "N/A", cabo_guarda: "N/A", capacidade_linha: "N/A", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2016", barramento_inicial: "Karpowership", barramento_final: "Karpowership", cabo_guarda: "Sim", capacidade_linha: "", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "1973", barramento_inicial: "SE Ressano", barramento_final: "SE Ressano", cabo_guarda: "Condutor de aço", capacidade_linha: "479MVA", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1972", barramento_inicial: "SE Infulene", barramento_final: "SE Infulene", cabo_guarda: "Condutor de aço", capacidade_linha: "479MVA", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2000", barramento_inicial: "SE Infulene", barramento_final: "SE Infulene", cabo_guarda: "Condutor de aço", capacidade_linha: "479MVA", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2002", barramento_inicial: "SE Chicumbane", barramento_final: "SE Chicumbane", cabo_guarda: "Condutor de aço", capacidade_linha: "68MVA", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "2015", barramento_inicial: "SE Kuvaninga", barramento_final: "SE Kuvaninga", cabo_guarda: "Condutor de aço", capacidade_linha: "99MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "2015", barramento_inicial: "SE Lione", barramento_final: "SE Lione", cabo_guarda: "Condutor de aço", capacidade_linha: "99MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "2019", barramento_inicial: "SE Beluluana", barramento_final: "SE Beluluana", cabo_guarda: "Condutor de aço", capacidade_linha: "120MVA", circuito: "Duplo" },
            { area_negocio: "Transporte", ano_entrada_servico: "2019", barramento_inicial: "SE Matola Gare", barramento_final: "SE Matola Gare", cabo_guarda: "Condutor de aço", capacidade_linha: "120MVA", circuito: "Duplo" },
            { area_negocio: "Transporte", ano_entrada_servico: "2019", barramento_inicial: "SE Infulene", barramento_final: "SE Infulene", cabo_guarda: "Condutor de aço", capacidade_linha: "120MVA", circuito: "Duplo" },
            { area_negocio: "Transporte", ano_entrada_servico: "2002", barramento_inicial: "SE Boane", barramento_final: "SE Boane", cabo_guarda: "Condutor de aço", capacidade_linha: "650MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "1955", barramento_inicial: "S/E de Munhava", barramento_final: "S/E de Munhava", cabo_guarda: "ACSSW", capacidade_linha: "77 MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "2018", barramento_inicial: "S/E de Dondo", barramento_final: "S/E de Dondo", cabo_guarda: "OPGW", capacidade_linha: "238 MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "1986", barramento_inicial: "SE's Alto Moloc", barramento_final: "SE's Alto Moloc", cabo_guarda: "Condutor de aço", capacidade_linha: "239MVA", circuito: "N/A" },
            { area_negocio: "Transporte", ano_entrada_servico: "1984", barramento_inicial: "SE Chimuara – S", barramento_final: "SE Chimuara – S", cabo_guarda: "Condutor de aço", capacidade_linha: "477MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "1983", barramento_inicial: "SE Matambo – SE", barramento_final: "SE Matambo – SE", cabo_guarda: "Condutor de aço", capacidade_linha: "477MVA", circuito: "Simples" },
            { area_negocio: "Transporte", ano_entrada_servico: "2009", barramento_inicial: "S/E MATAMBO", barramento_final: "S/E MATAMBO", cabo_guarda: "OPGW", capacidade_linha: "56 MVA", circuito: "Simples" },
            { area_negocio: "Geração", ano_entrada_servico: "1953", barramento_inicial: "", barramento_final: "", cabo_guarda: "", capacidade_linha: "", circuito: "" },
            { area_negocio: "Transporte", ano_entrada_servico: "1959", barramento_inicial: "", barramento_final: "", cabo_guarda: "", capacidade_linha: "", circuito: "" }
        ];

        for (const p of patrimonios) {
            await connection.query(
                'INSERT INTO patrimonios (area_negocio, ano_entrada_servico, barramento_inicial, barramento_final, cabo_guarda, capacidade_linha, circuito) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [p.area_negocio, p.ano_entrada_servico, p.barramento_inicial, p.barramento_final, p.cabo_guarda, p.capacidade_linha, p.circuito]
            );
        }
        console.log(`   ✅ ${patrimonios.length} patrimonios inserted`);

        // ========== 9. COMMENTS ==========
        console.log('💬 Seeding comments...');
        const comments = [
            { entity_type: 'article', entity_id: 20, author_name: 'Admin', content: "FNVHGHGJH", status: 'approved' },
            { entity_type: 'article', entity_id: 20, author_name: 'Admin', content: "GKJKJGK", status: 'approved' },
            { entity_type: 'article', entity_id: 20, author_name: 'Admin', content: "HFJHGJGKJGKJ", status: 'approved' }
        ];

        for (const c of comments) {
            await connection.query(
                'INSERT INTO comments (entity_type, entity_id, author_name, content, status) VALUES (?, ?, ?, ?, ?)',
                [c.entity_type, c.entity_id, c.author_name, c.content, c.status]
            );
        }
        console.log(`   ✅ ${comments.length} comments inserted`);

        // ========== SUMMARY ==========
        console.log('\n' + '='.repeat(50));
        console.log('🎉 SEED COMPLETE! Summary:');
        console.log('='.repeat(50));

        const countTables = ['users', 'articles', 'testemunhos', 'testimonials', 'tags', 'patrimonios', 'exposicoes', 'eventos', 'comments'];
        for (const table of countTables) {
            const [rows] = await connection.query(`SELECT COUNT(*) as count FROM ${table}`);
            console.log(`   📊 ${table}: ${rows[0].count} registos`);
        }

        console.log('\n🔑 Login credentials:');
        console.log('   Email: admin@museu.cd');
        console.log('   Password: admin123\n');

    } finally {
        await connection.end();
    }
}

seed().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});

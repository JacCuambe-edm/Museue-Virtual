module.exports = {
  apps: [
    {
      name: 'museu-virtual',
      script: './backend/index.js',
      cwd: '/var/www/museu',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '300M',
      env_production: {
        NODE_ENV: 'production',
        PORT: 5050,
        DB_PATH: '/var/www/museu/backend/museu.db',
        JWT_SECRET: 'CHANGE_THIS_TO_A_STRONG_RANDOM_SECRET_IN_PRODUCTION',
        ALLOWED_ORIGIN: 'https://museu.edm.co.mz',
      },
    },
  ],
};

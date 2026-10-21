module.exports = {
  apps: [{
    name: 'novicovs',
    cwd: '/mnt/server/storage/novicovs',
    script: './server.mjs',
    interpreter: '/mnt/server/loader/.runtime/node-v22.23.1-linux-x64/bin/node',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    max_memory_restart: '256M',
    time: true,
    env: { NODE_ENV: 'production', PORT: '1488' },
  }],
};

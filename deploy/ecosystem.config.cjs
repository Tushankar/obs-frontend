// PM2 process file for the OBS Events API (§4.5).
// Usage on EC2:  pm2 start deploy/ecosystem.config.cjs && pm2 save && pm2 startup
//
// Fork mode, single instance. The API itself is stateless, but the cron jobs
// (expireOrders / remind24h / completeEvents) run in-process — keep ONE instance
// so they fire once per tick. The jobs are idempotent anyway (conditional flips
// + reminderSentAt claim), so a brief overlap during a restart is safe. If you
// scale the API horizontally later, run the crons on a single dedicated instance
// (or split them into their own pm2 app) rather than every web node.
module.exports = {
  apps: [
    {
      name: 'obs-events-api',
      cwd: './server',
      script: 'src/index.js',
      exec_mode: 'fork',
      instances: 1,
      max_memory_restart: '400M',
      env: {
        NODE_ENV: 'production',
      },
      // .env is loaded by the app (dotenv) from ./server/.env — keep secrets there,
      // not here. This file is committed; .env is gitignored.
      out_file: '/var/log/obs/api.out.log',
      error_file: '/var/log/obs/api.err.log',
      merge_logs: true,
      time: true,
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "job-scrapper-api",
      script: "server.js",
      cwd: "/var/www/systems/app/scrapper",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: 5000
      }
    },
    {
      name: "job-scrapper-worker",
      script: "workers/scrape.worker.js",
      cwd: "/var/www/systems/app/scrapper",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      cron_restart: "*/30 * * * *",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
};

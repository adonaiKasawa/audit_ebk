module.exports = {
  apps: [
    {
      name: "ebk_front",
      script: "./next",
      args: "start -p 3000", // ou le port que tu veux
      env: {
        NODE_ENV: "production",
      },
      node_args: "--max-old-space-size=20596", // 20 Go
      instances: "max", // ou "max" si tu veux utiliser tous les cœurs CPU
      autorestart: true,
      watch: false,
      max_memory_restart: "20596M", // redémarre si dépasse 20 Go
    },
  ],
};

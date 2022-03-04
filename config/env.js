module.exports = {
    path: process.env.NODE_ENV ? (process.env.NODE_ENV && process.env.NODE_ENV.trim() == "dev" ? ".env.dev" : ".env.prod") : ".env.prod"
}
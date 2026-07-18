# Deployment notes

1. Create a MySQL database on your hosting account.
2. Add these environment variables in the hosting control panel:
   - MYSQL_HOST
   - MYSQL_PORT
   - MYSQL_USER
   - MYSQL_PASSWORD
   - MYSQL_DATABASE
   - PORT
3. Start the server with:
   - `node server.js`
4. The server will create the database and tables automatically on first run.

const fs = require('fs');

function generateHTML(name) {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <title>${name}'s HTML Page</title>
</head>
<body>
  <h1>Hello, ${name}!</h1>
</body>
</html>`;

  return htmlContent;
}

module.exports = generateHTML;

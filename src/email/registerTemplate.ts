const inlineCSS = require("inline-css");
const domain = "http://localhost:8000";
const generateTemplate = async (hash: string, email: string) => {
  const _template = `<div>
  <style>
    h1 { color: black; }
    div{display:block;width:500px;flex-direction:column;align-items:center;justify-content:center}
    a{background:#902e35;text-decoration:none;padding:1rem 2rem; border-radius:10px;color:white;transition:all 1s}
    a:hover{
      transform: scale(1.1);
    }
  </style>
  <div>
  <h1>Welcome to Damirifa</h1>
  <p>Click the button below to confirm your email.</p>
  <a href="${domain}/confirm-email?uuid=${hash}&email=${email}" target="_blank">Verify email</a>
  </div>
</div>`;
  return await inlineCSS(_template, { url: "faker" });
};
export { generateTemplate };
